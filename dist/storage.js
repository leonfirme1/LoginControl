import { consultants } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
const PostgresSessionStore = connectPg(session);
export class DatabaseStorage {
    constructor() {
        this.sessionStore = new PostgresSessionStore({
            pool,
            createTableIfMissing: true,
            tableName: 'session' // Explicitly set table name
        });
    }
    async getUser(id) {
        const [user] = await db.select().from(consultants).where(eq(consultants.id, id));
        return user || undefined;
    }
    async getUserByUsername(username) {
        console.log(`[STORAGE] Buscando usuário: ${username}`);
        try {
            const [user] = await db.select().from(consultants).where(eq(consultants.name, username));
            console.log(`[STORAGE] Resultado da busca:`, user || 'Nenhum usuário encontrado');
            return user || undefined;
        }
        catch (error) {
            console.error(`[STORAGE] Erro ao buscar usuário:`, error);
            throw error;
        }
    }
    async createUser(insertUser) {
        const [user] = await db
            .insert(consultants)
            .values(insertUser)
            .returning();
        return user;
    }
}
export const storage = new DatabaseStorage();
