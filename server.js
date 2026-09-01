import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { createAdminRouter } from "./admin/admin.js";

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

// AdminJS
const adminRouter = await createAdminRouter();
app.use("/admin", adminRouter);

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`AdminJS running on http://localhost:${PORT}/admin`);
    });
}).catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});
