import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    console.error(`Error ${status}: ${message}`);
    res.status(status).json({ message });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "../public");
    console.log(`[STATIC] Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    
    // Fallback to index.html for SPA routing
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  // Use PORT from environment (Railway) or default to 5000 (development)
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0"; // Always bind to 0.0.0.0 for production compatibility
  
  server.listen(port, host, () => {
    console.log(`🚀 Server running on port ${port} (host: ${host})`);
    console.log(`📊 Health check: http://${host}:${port}/ping`);
    console.log(`🏥 Alt health: http://${host}:${port}/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  });
})();