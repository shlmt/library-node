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
  const book = await bookRepository.findById(req.body.titleIsbn);

  if (!book) {
    return res.status(404).json({ message: "Cannot create book copy: book does not exist" });
  }

  const bookCopy = await bookCopyRepository.create(req.body);
  res.status(201).json(bookCopy);
});

router.put("/:barcode", async (req, res) => {
  if (req.body.titleIsbn) {
    const title = await bookRepository.findById(req.body.titleIsbn);

    if (!title) {
      return res.status(404).json({ message: "Cannot assign book copy to non-existing title" });
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
