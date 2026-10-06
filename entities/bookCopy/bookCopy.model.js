import { getSQLiteDatabase } from "../../config/db.js";
import { Book } from "../book/book.model.js";

/**
 * BookCopy entity shape used by the SQLite app.
 * Example:
 * {
 *   _id: "001",
 *   titleIsbn: "978-0132350884",
 *   inStock: true,
 *   title: { ...book object } // populated relation
 * }
 */
const normalizeBookCopy = (row) => ({
  ...row,
  _id: row._id,
  id: row._id,
  inStock: Boolean(row.inStock),
  titleIsbn: row.titleIsbn,
});

export const BookCopy = {
  find() {
    const rows = getSQLiteDatabase()
      .prepare("SELECT * FROM book_copies ORDER BY _id ASC")
      .all();

    const result = rows.map((row) => ({
      ...normalizeBookCopy(row),
      titleIsbn: Book.findById(row.titleIsbn),
    }));

    result.populate = (field) => {
      if (field === "titleIsbn") {
        return result.map((item) => ({
          ...item,
          titleIsbn: Book.findById(item.titleIsbn?._id ?? item.titleIsbn),
        }));
      }

      return result;
    };

    return result;
  },

  findById(barcode) {
    const row = getSQLiteDatabase()
      .prepare("SELECT * FROM book_copies WHERE _id = ?")
      .get(barcode);

    if (!row) {
      return null;
    }

    const item = {
      ...normalizeBookCopy(row),
      titleIsbn: Book.findById(row.titleIsbn),
    };

    item.populate = (field) => {
      if (field === "titleIsbn") {
        return { ...item, titleIsbn: Book.findById(item.titleIsbn?._id ?? item.titleIsbn) };
      }

      return item;
    };

    return item;
  },

  create(data) {
    const items = Array.isArray(data) ? data : [data];
    const db = getSQLiteDatabase();

    const created = items.map((item) => {
      const insert = db.prepare(
        "INSERT INTO book_copies (_id, titleIsbn, inStock) VALUES (?, ?, ?)"
      );

      insert.run(item._id ?? item.barcode, item.titleIsbn, item.inStock === undefined ? 1 : Number(item.inStock));

      return {
        ...item,
        _id: item._id ?? item.barcode,
        id: item._id ?? item.barcode,
        inStock: item.inStock !== false,
        titleIsbn: Book.findById(item.titleIsbn),
      };
    });

    return Array.isArray(data) ? created : created[0];
  },

  countDocuments() {
    return getSQLiteDatabase().prepare("SELECT COUNT(*) AS count FROM book_copies").get().count;
  },

  findByIdAndUpdate(barcode, updateData) {
    const db = getSQLiteDatabase();
    const existing = this.findById(barcode);

    if (!existing) {
      return null;
    }

    const merged = { ...existing, ...updateData };
    db.prepare("UPDATE book_copies SET titleIsbn = ?, inStock = ? WHERE _id = ?").run(
      merged.titleIsbn?._id ?? merged.titleIsbn,
      merged.inStock ? 1 : 0,
      barcode,
    );

    return this.findById(barcode);
  },

  findByIdAndDelete(barcode) {
    const existing = this.findById(barcode);

    if (!existing) {
      return null;
    }

    getSQLiteDatabase()
      .prepare("DELETE FROM book_copies WHERE _id = ?")
      .run(barcode);

    return existing;
  },
};
