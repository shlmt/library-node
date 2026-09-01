import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    publisher: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Book = mongoose.model("Book", bookSchema);
