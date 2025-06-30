import express from "express";
import { createServer } from "http";
import { setupAuth } from "./auth.js";
import { storage } from "./storage.js";
// Node.js 18 compatibility - avoid all path resolution issues
const app = express();
const PORT = process.env.PORT || 3000;
// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error("Server error:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});
// Health check endpoints (Railway requirements)
app.get("/ping", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.get("/health", async (_req, res) => {
    try {
        // Test database connection
        await storage.getUser(1);
        res.status(200).json({
            status: "healthy",
            database: "connected",
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error("Health check failed:", error);
        res.status(503).json({
            status: "unhealthy",
            database: "disconnected",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
// Root endpoint
app.get("/", (_req, res) => {
    res.json({
        message: "Controle de Horas API",
        status: "running",
        version: "1.0.0"
    });
});
// Setup authentication routes
setupAuth(app);
// Simple static file serving for production
if (process.env.NODE_ENV === "production") {
    // Serve any static files that might exist
    app.use(express.static("dist/public", { fallthrough: true }));
    // SPA fallback - send a simple HTML for any unmatched routes
    app.get("*", (_req, res) => {
        res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controle de Horas</title>
    <script type="module" crossorigin src="/assets/index.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index.css">
</head>
<body>
    <div id="root"></div>
</body>
</html>`);
    });
}
// Start server
const server = createServer(app);
server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: Connected to PostgreSQL`);
    console.log(`🔐 Authentication: Enabled`);
    console.log(`💚 Health checks: /ping, /health, /`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
