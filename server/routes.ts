import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Ultra simple health check for Railway - just returns OK
  app.get("/health", (req, res) => {
    console.log(`[HEALTH] Health check requested from ${req.ip || req.connection.remoteAddress}`);
    res.status(200).send('OK');
  });

  // Alternative health check endpoints
  app.get("/", (req, res) => {
    console.log(`[ROOT] Root path accessed`);
    res.status(200).send('Sistema de Login - OK');
  });

  app.get("/ping", (req, res) => {
    console.log(`[PING] Ping endpoint accessed`);
    res.status(200).send('pong');
  });

  // Detailed health check endpoint  
  app.get("/health/json", (req, res) => {
    console.log(`[HEALTH] Detailed health check requested`);
    const response = {
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      port: process.env.PORT || "5000",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: "1.0.0"
    };
    console.log(`[HEALTH] Responding with:`, response);
    res.status(200).json(response);
  });

  // Detailed health check with database test
  app.get("/health/detailed", async (req, res) => {
    const startTime = Date.now();
    try {
      console.log("[HEALTH] Starting detailed health check...");
      
      // Test database connection with timeout
      const dbTest = await Promise.race([
        db.execute('SELECT 1'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout')), 5000)
        )
      ]);
      
      const duration = Date.now() - startTime;
      console.log(`[HEALTH] Database test successful in ${duration}ms`);
      
      res.status(200).json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        database: "connected",
        duration: `${duration}ms`,
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[HEALTH] Detailed health check failed in ${duration}ms:`, error);
      
      res.status(503).json({ 
        status: "error", 
        timestamp: new Date().toISOString(),
        database: "disconnected",
        duration: `${duration}ms`,
        environment: process.env.NODE_ENV || "development",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // put application routes here
  // prefix all routes with /api

  const httpServer = createServer(app);

  return httpServer;
}
