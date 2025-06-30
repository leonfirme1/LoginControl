import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the AWS RDS PostgreSQL connection string
const getDatabaseUrl = () => {
  // Use AWS RDS connection details
  const host = 'controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com';
  const port = '5432';
  const database = 'controlehoras';
  const username = process.env.PGUSER || process.env.PGUSERNAME;
  const password = process.env.PGPASSWORD;
  
  if (!username || !password) {
    throw new Error(
      "Credenciais do banco de dados devem ser configuradas. Configure as variáveis PGUSER e PGPASSWORD.",
    );
  }
  
  return `postgresql://${username}:${password}@${host}:${port}/${database}`;
};

const databaseUrl = getDatabaseUrl();
console.log('[DB] Database URL configurada:', databaseUrl.replace(/:[^:@]*@/, ':***@'));

// Configure SSL based on environment
const sslConfig = process.env.NODE_ENV === 'production' 
  ? { rejectUnauthorized: false } // For Railway/production with self-signed certs
  : false; // For development

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: sslConfig
});
export const db = drizzle(pool, { schema });
