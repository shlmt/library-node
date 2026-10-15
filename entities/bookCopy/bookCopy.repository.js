import { BookCopy } from "./bookCopy.model.js";

export const bookCopyRepository = {
  findAll() {
    return BookCopy.find().populate("book").sort({ _id: 1 });
  },

  findById(barcode) {
    return BookCopy.findById(barcode).populate("book");
  },

  async create(data) {
    const bookCopy = await BookCopy.create({
      _id: data.barcode,
      book: data.book,
      status: data.status,
    });

    return bookCopy.populate("book");
  },

  async update(barcode, data) {
    const bookCopy = await BookCopy.findById(barcode);
    if (!bookCopy) {
      return null;
    }

    if (data.book !== undefined) {
      bookCopy.book = data.book;
    }

    if (data.status !== undefined) {
      const allowedTransitions = {
        new: ["available", "underRepair", "lost", "outOfStock"],
        available: ["underRepair", "lost", "outOfStock"],
        underRepair: ["available", "lost", "outOfStock"],
        lost: ["available", "outOfStock"],
        outOfStock: [],
      };

      if (data.status !== bookCopy.status && !allowedTransitions[bookCopy.status]?.includes(data.status)) {
        const error = new Error(`Cannot change status from ${bookCopy.status} to ${data.status}`);
        error.name = "ValidationError";
        throw error;
      }

      bookCopy.status = data.status;
    }
    await bookCopy.save();

    return bookCopy.populate("book");
  },

  delete(barcode) {
    return BookCopy.findByIdAndDelete(barcode);
  },
};
