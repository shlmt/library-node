import mongoose from "mongoose";

const bookCopySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
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