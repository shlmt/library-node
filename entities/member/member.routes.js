import express from "express";
import { memberRepository } from "./member.repository.js";

const router = express.Router();

// GET /api/members
router.get("/", async (req, res) => {
  const members = await memberRepository.findAll();
  res.json(members);
});

// GET /api/members/:id
router.get("/:id", async (req, res) => {
  const member = await memberRepository.findById(req.params.id);

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
});

// POST /api/members
router.post("/", async (req, res) => {
  const member = await memberRepository.create(req.body);
  res.status(201).json(member);
});

// PUT /api/members/:id
router.put("/:id", async (req, res) => {
  const member = await memberRepository.update(req.params.id, req.body);

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
});

// DELETE /api/members/:id
router.delete("/:id", async (req, res) => {
  const member = await memberRepository.delete(req.params.id);

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.status(204).send();
});

export default router;
