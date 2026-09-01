import mongoose from "mongoose";

const bookCopySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    titleIsbn: {
      type: String,
      required: true,
      ref: "Book",
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const BookCopy = mongoose.model("BookCopy", bookCopySchema);
