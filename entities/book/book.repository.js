import { Book } from "./book.model.js";
import { BookCopy } from "../bookCopy/bookCopy.model.js";

export const bookRepository = {
  findAll() {
    return Book.find().sort({ title: 1 });
  },

  findById(id) {
    return Book.findById(id);
  },

  findByIsbn(isbn) {
    return Book.findOne({ isbn });
  },

  create(data) {
    return Book.create({
      isbn: data.isbn,
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      category: data.category,
    });
  },

  update(isbn, data) {
    const { isbn: _, ...updateData } = data;

    return Book.findOneAndUpdate({ isbn }, updateData, {
      new: true,
      runValidators: true,
    });
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
