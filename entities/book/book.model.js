import { getSQLiteDatabase } from "../../config/db.js";

/**
 * Book entity shape used by the SQLite app.
 * Example:
 * {
 *   _id: "978-0132350884",
 *   title: "Clean Code",
 *   author: "Robert C. Martin",
 *   publisher: "Prentice Hall",
 *   category: "Programming"
 * }
 */
const normalizeBook = (row) => ({
  ...row,
  _id: row._id,
  id: row._id,
});

export const Book = {
  find() {
    const rows = getSQLiteDatabase()
      .prepare("SELECT * FROM books ORDER BY title ASC")
      .all();

    return rows.map(normalizeBook);
  },

  findById(isbn) {
    const row = getSQLiteDatabase()
      .prepare("SELECT * FROM books WHERE _id = ?")
      .get(isbn);

    return row ? normalizeBook(row) : null;
  },

  create(data) {
    const items = Array.isArray(data) ? data : [data];
    const db = getSQLiteDatabase();

    const created = items.map((item) => {
      const insert = db.prepare(
        "INSERT INTO books (_id, title, author, publisher, category) VALUES (?, ?, ?, ?, ?)"
      );

      insert.run(item._id ?? item.isbn, item.title, item.author, item.publisher, item.category);
      return { ...item, _id: item._id ?? item.isbn, id: item._id ?? item.isbn };
    });

    return Array.isArray(data) ? created : created[0];
  },

  countDocuments() {
    return getSQLiteDatabase().prepare("SELECT COUNT(*) AS count FROM books").get().count;
  },

  findByIdAndUpdate(isbn, updateData, options = {}) {
    const db = getSQLiteDatabase();
    const existing = this.findById(isbn);

    if (!existing) {
      return null;
    }

    const merged = { ...existing, ...updateData };
    const update = db.prepare(
      "UPDATE books SET title = ?, author = ?, publisher = ?, category = ? WHERE _id = ?"
    );

    update.run(
      merged.title,
      merged.author,
      merged.publisher,
      merged.category,
      isbn,
    );

    return this.findById(isbn);
  },

  findByIdAndDelete(isbn) {
    const existing = this.findById(isbn);

    if (!existing) {
      return null;
    }

    getSQLiteDatabase()
      .prepare("DELETE FROM books WHERE _id = ?")
      .run(isbn);

    return existing;
  },
};
