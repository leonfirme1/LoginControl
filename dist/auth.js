import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
const scryptAsync = promisify(scrypt);
async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64));
    return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
    // Handle plain text passwords for existing data
    if (!stored.includes('.')) {
        return supplied === stored;
    }
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64));
    return timingSafeEqual(hashedBuf, suppliedBuf);
}
export function setupAuth(app) {
    const sessionSettings = {
        secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    };
    app.set("trust proxy", 1);
    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy({ usernameField: 'name' }, // Use 'name' field instead of 'username'
    async (name, password, done) => {
        try {
            console.log(`[AUTH] Tentativa de login: ${name}`);
            const user = await storage.getUserByUsername(name);
            console.log(`[AUTH] Usuário encontrado:`, user ? 'Sim' : 'Não');
            if (!user) {
                console.log(`[AUTH] Usuário não encontrado: ${name}`);
                return done(null, false);
            }
            const passwordMatch = await comparePasswords(password, user.password);
            console.log(`[AUTH] Senha correta:`, passwordMatch ? 'Sim' : 'Não');
            console.log(`[AUTH] Senha fornecida: '${password}', Senha armazenada: '${user.password}'`);
            if (!passwordMatch) {
                return done(null, false);
            }
            else {
                console.log(`[AUTH] Login bem-sucedido para: ${name}`);
                return done(null, user);
            }
        }
        catch (error) {
            console.error(`[AUTH] Erro no login:`, error);
            return done(error);
        }
    }));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });
    app.post("/api/register", async (req, res, next) => {
        try {
            const { name, password } = req.body;
            if (!name || !password) {
                return res.status(400).json({ message: "Nome e senha são obrigatórios" });
            }
            const existingUser = await storage.getUserByUsername(name);
            if (existingUser) {
                return res.status(400).json({ message: "Usuário já existe" });
            }
            const user = await storage.createUser({
                name,
                password: await hashPassword(password),
            });
            req.login(user, (err) => {
                if (err)
                    return next(err);
                res.status(201).json(user);
            });
        }
        catch (error) {
            next(error);
        }
    });
    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err)
                return next(err);
            if (!user) {
                return res.status(401).json({ message: "Usuário ou senha inválidos" });
            }
            req.login(user, (err) => {
                if (err)
                    return next(err);
                res.status(200).json(user);
            });
        })(req, res, next);
    });
    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err)
                return next(err);
            res.sendStatus(200);
        });
    });
    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        res.json(req.user);
    });
}
