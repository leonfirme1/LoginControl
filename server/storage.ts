import { consultants, type Consultant, type InsertConsultant } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<Consultant | undefined>;
  getUserByUsername(username: string): Promise<Consultant | undefined>;
  createUser(user: InsertConsultant): Promise<Consultant>;
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session' // Explicitly set table name
    });
  }

  async getUser(id: number): Promise<Consultant | undefined> {
    const [user] = await db.select().from(consultants).where(eq(consultants.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<Consultant | undefined> {
    console.log(`[STORAGE] Buscando usuário: ${username}`);
    
    // Força nova conexão para dados sempre atualizados
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        'SELECT id, name, password FROM consultants WHERE name = $1',
        [username]
      );
      await client.query('COMMIT');
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(`[STORAGE] Usuário encontrado:`, { id: user.id, name: user.name });
        return {
          id: user.id,
          name: user.name,
          password: user.password
        };
      }
      
      // Debug: lista todos os usuários disponíveis
      const allUsers = await client.query('SELECT id, name FROM consultants ORDER BY id');
      console.log(`[STORAGE] Total usuários na base: ${allUsers.rows.length}`);
      allUsers.rows.forEach(u => console.log(`  - ${u.id}: ${u.name}`));
      
      return undefined;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`[STORAGE] Erro ao buscar usuário:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createUser(insertUser: InsertConsultant): Promise<Consultant> {
    const [user] = await db
      .insert(consultants)
      .values(insertUser)
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
