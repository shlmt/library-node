import { Book } from "./book.model.js";
import { BookCopy } from "../bookCopy/bookCopy.model.js";

const withCopies = async (books) => {
  if (books.length === 0) {
    return [];
  }

  const copies = await BookCopy.find({
    book: { $in: books.map((book) => book._id) },
  })
    .select("_id book status")
    .sort({ _id: 1 })
    .lean();

  const copiesByBook = new Map(books.map((book) => [book._id.toString(), []]));
  for (const copy of copies) {
    copiesByBook.get(copy.book.toString()).push({
      _id: copy._id,
      status: copy.status,
    });
  }

  return books.map((book) => ({
    ...book.toObject(),
    copies: copiesByBook.get(book._id.toString()),
  }));
};

export const bookRepository = {
  async findAll({ includeCopies = true } = {}) {
    const books = await Book.find().sort({ title: 1 });
    return includeCopies
      ? withCopies(books)
      : books.map((book) => book.toObject());
  },

  async findById(id) {
    const book = await Book.findById(id);
    return book ? (await withCopies([book]))[0] : null;
  },

  async findByIsbn(isbn, { includeCopies = true } = {}) {
    const book = await Book.findOne({ isbn });
    if (!book) {
      return null;
    }

    return includeCopies
      ? (await withCopies([book]))[0]
      : book.toObject();
  },

  async create(data) {
    const book = await Book.create({
      isbn: data.isbn,
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      category: data.category,
    });

    return (await withCopies([book]))[0];
  },

  async update(isbn, data) {
    const { isbn: _, ...updateData } = data;

    const book = await Book.findOneAndUpdate({ isbn }, updateData, {
      new: true,
      runValidators: true,
    });

    return book ? (await withCopies([book]))[0] : null;
  },

  async delete(isbn) {
    const book = await Book.findOne({ isbn });
    if (!book) {
      return null;
    }

    if (await BookCopy.exists({ book: book._id })) {
      return { conflict: true };
    }

    return Book.findByIdAndDelete(book._id);
  },
};
