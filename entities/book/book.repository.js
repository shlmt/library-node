import { Book } from "./book.model.js";

export const bookRepository = {
  findAll() {
    return Book.find().sort({ title: 1 });
  },

  findById(isbn) {
    return Book.findById(isbn);
  },

  create(data) {
    return Book.create({
      _id: data.isbn,
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      category: data.category,
    });
  },

  update(isbn, data) {
    const { isbn: _, ...updateData } = data;

    return Book.findByIdAndUpdate(isbn, updateData, {
      new: true,
      runValidators: true,
    });
  },

  delete(isbn) {
    return Book.findByIdAndDelete(isbn);
  },
};
