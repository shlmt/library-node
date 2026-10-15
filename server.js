import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { connectDB } from "./config/db.js";
import { openApiSpec } from "./config/openapi.js";
import { errorHandler } from "./middleware/errorHandler.js";

import memberRoutes from "./entities/member/member.routes.js";
import bookRoutes from "./entities/book/book.routes.js";
import bookCopyRoutes from "./entities/bookCopy/bookCopy.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use("/api/members", memberRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/book-copies", bookCopyRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use(errorHandler);

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Swagger UI running on http://localhost:${PORT}/api-docs`);
    });
}).catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});
