import express from "express";
import { bookCopyRepository } from "./bookCopy.repository.js";
import { bookRepository } from "../book/book.repository.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const bookCopies = await bookCopyRepository.findAll();
  res.json(bookCopies);
});

router.get("/:barcode", async (req, res) => {
  const bookCopy = await bookCopyRepository.findById(req.params.barcode);

  if (!bookCopy) {
    return res.status(404).json({ message: "Book copy not found" });
  }

  res.json(bookCopy);
});

router.post("/", async (req, res) => {
  if (!req.body?.book) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  const book = await bookRepository.findById(req.body.book);

  if (!book) {
    return res.status(404).json({ message: "Cannot create book copy: book does not exist" });
  }

  const bookCopy = await bookCopyRepository.create(req.body, book);
  res.status(201).json(bookCopy);
});

router.put("/:barcode", async (req, res) => {
  if (req.body.book) {
    const book = await bookRepository.findById(req.body.book);

    if (!book) {
      return res.status(404).json({ message: "Cannot assign book copy to a non-existing book" });
    }
  }

  const bookCopy = await bookCopyRepository.update(req.params.barcode, req.body);

  if (!bookCopy) {
    return res.status(404).json({ message: "Book copy not found" });
  }

  res.json(bookCopy);
});

router.delete("/:barcode", async (req, res) => {
  const bookCopy = await bookCopyRepository.delete(req.params.barcode);

  if (!bookCopy) {
    return res.status(404).json({ message: "Book copy not found" });
  }

  res.status(204).send();
});

export default router;
