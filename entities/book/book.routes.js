import express from "express";
import { bookRepository } from "./book.repository.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const books = await bookRepository.findAll();
  res.json(books);
});

router.get("/:isbn", async (req, res) => {
  const book = await bookRepository.findById(req.params.isbn);

  if (!book) {
    return res.status(404).json({ message: "Title not found" });
  }

  res.json(book);
});

router.post("/", async (req, res) => {
  if (!req.body?.isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  const book = await bookRepository.create(req.body);
  res.status(201).json(book);
});

router.put("/:isbn", async (req, res) => {
  const book = await bookRepository.update(req.params.isbn, req.body);

  if (!book) {
    return res.status(404).json({ message: "Title not found" });
  }

  res.json(book);
});

router.delete("/:isbn", async (req, res) => {
  const book = await bookRepository.delete(req.params.isbn);

  if (!book) {
    return res.status(404).json({ message: "Title not found" });
  }

  res.status(204).send();
});

export default router;
