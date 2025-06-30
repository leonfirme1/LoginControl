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
    try {
      const [user] = await db.select().from(consultants).where(eq(consultants.name, username));
      console.log(`[STORAGE] Resultado da busca:`, user || 'Nenhum usuário encontrado');
      return user || undefined;
    } catch (error) {
      console.error(`[STORAGE] Erro ao buscar usuário:`, error);
      throw error;
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
