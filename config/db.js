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
      _id: "978-0132350884",
      title: "Clean Code",
      author: "Robert C. Martin",
      publisher: "Prentice Hall",
      category: "Programming",
    },
    {
      _id: "978-1491950296",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      publisher: "O'Reilly Media",
      category: "Databases",
    },
    {
      _id: "978-1617294945",
      title: "Learning Node.js",
      author: "Marc Harter",
      publisher: "Manning",
      category: "Programming",
    },
  ]);

  await Promise.all([
    Member.create([
      { name: "Alice Cohen", membershipNumber: "10001" },
      { name: "David Levi", membershipNumber: "10002" },
    ]),
    BookCopy.create([
      { _id: "001", titleIsbn: books[0]._id },
      { _id: "002", titleIsbn: books[0]._id },
      { _id: "003", titleIsbn: books[1]._id },
      { _id: "004", titleIsbn: books[2]._id },
      { _id: "005", titleIsbn: books[2]._id },
    ]),
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
