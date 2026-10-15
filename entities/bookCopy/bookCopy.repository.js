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
      inStock: data.inStock,
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
    if (data.inStock !== undefined) {
      bookCopy.inStock = data.inStock;
    }
    await bookCopy.save();

    return bookCopy.populate("book");
  },

  delete(barcode) {
    return BookCopy.findByIdAndDelete(barcode);
  },
};
