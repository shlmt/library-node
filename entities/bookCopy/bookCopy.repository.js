import { BookCopy } from "./bookCopy.model.js";

export const bookCopyRepository = {
  findAll() {
    return BookCopy.find().populate("titleIsbn");
  },

  findById(barcode) {
    return BookCopy.findById(barcode).populate("titleIsbn");
  },

  create(data) {
    return BookCopy.create({
      _id: data.barcode,
      titleIsbn: data.titleIsbn,
      inStock: data.inStock,
    });
  },

  update(barcode, data) {
    const { barcode: _, ...updateData } = data;

    return BookCopy.findByIdAndUpdate(barcode, updateData, {
      new: true,
      runValidators: true,
    }).populate("titleIsbn");
  },

  delete(barcode) {
    return BookCopy.findByIdAndDelete(barcode);
  },
};
