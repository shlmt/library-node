import mongoose from "mongoose";
import { Book } from "../entities/book/book.model.js";
import { BookCopy } from "../entities/bookCopy/bookCopy.model.js";
import { Member } from "../entities/member/member.model.js";

const initializeDB = async () => {
  const [memberCount, bookCount, bookCopyCount] = await Promise.all([
    Member.countDocuments(),
    Book.countDocuments(),
    BookCopy.countDocuments(),
  ]);

  if (memberCount > 0 || bookCount > 0 || bookCopyCount > 0) {
    return;
  }

  const books = await Book.create([
    {
      isbn: "978-0132350884",
      title: "Clean Code",
      author: "Robert C. Martin",
      publisher: "Prentice Hall",
      category: "Programming",
    },
    {
      isbn: "978-1491950296",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      publisher: "O'Reilly Media",
      category: "מבוגרים בלבד",
    },
    {
      isbn: "978-1617294945",
      title: "Learning Node.js",
      author: "Marc Harter",
      publisher: "Manning",
      category: "קומיקס",
    },
  ]);

  await BookCopy.create([
    { _id: "0-84-1", book: books[0]._id, status: "available" },
    { _id: "0-84-2", book: books[0]._id },
    { _id: "7-96-1", book: books[1]._id, status: "lost" },
    { _id: "1-45-1", book: books[2]._id },
    { _id: "1-45-2", book: books[2]._id },
  ]);

  await Member.create([
    {
      name: "Alice Cohen",
      membershipNumber: "10001",
      membershipType: { name: "Standard", maxBooks: 5 },
    },
    {
      name: "David Levi",
      membershipNumber: "10002",
      membershipType: { name: "Standard", maxBooks: 5 },
    },
  ]);

  console.log("Database initialized with sample data");
};

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await initializeDB();

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
