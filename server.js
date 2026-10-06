import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import memberRoutes from "./entities/member/member.routes.js";
import bookRoutes from "./entities/book/book.routes.js";
import bookCopyRoutes from "./entities/bookCopy/bookCopy.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

let swaggerUi = null;
let swaggerJsdoc = null;

try {
  const swaggerModule = await import("swagger-ui-express");
  swaggerUi = swaggerModule.default || swaggerModule;

  const jsdocModule = await import("swagger-jsdoc");
  swaggerJsdoc = jsdocModule.default || jsdocModule;
} catch (error) {
  console.warn("Swagger package not installed yet; skipping /admin route.", error.message);
}

if (swaggerUi && swaggerJsdoc) {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Library API",
        version: "1.0.0",
        description: "SQLite-based library management API",
      },
      servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ["./entities/**/*.js", "./server.js"],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use("/admin", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/admin.json", (req, res) => {
    res.json(swaggerSpec);
  });
} else {
  app.get("/admin", (req, res) => {
    res.status(503).json({
      message: "Swagger is disabled because the package is not installed in this environment.",
    });
  });
}

// API
app.use("/api/members", memberRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/book-copies", bookCopyRoutes);

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API docs: http://localhost:${PORT}/admin`);
        console.log(`AdminJS running on http://localhost:${PORT}/admin`);
    });
}).catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});
