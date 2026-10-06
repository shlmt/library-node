import { getSQLiteDatabase } from "../../config/db.js";

/**
 * Member entity shape used by the SQLite app.
 * Example:
 * {
 *   id: 1,
 *   name: "Alice Cohen",
 *   membershipNumber: "10001",
 *   isActive: true,
 *   note: "",
 *   createdAt: "2026-10-06T12:00:00.000Z"
 * }
 */
const normalizeMember = (row) => ({
  ...row,
  id: row.id,
  isActive: Boolean(row.isActive),
});

export const Member = {
  find() {
    const rows = getSQLiteDatabase()
      .prepare("SELECT * FROM members ORDER BY createdAt DESC")
      .all();

    return rows.map(normalizeMember);
  },

  findById(id) {
    const row = getSQLiteDatabase()
      .prepare("SELECT * FROM members WHERE id = ?")
      .get(Number(id));

    return row ? normalizeMember(row) : null;
  },

  create(data) {
    const items = Array.isArray(data) ? data : [data];
    const db = getSQLiteDatabase();

    const created = items.map((item) => {
      const insert = db.prepare(
        "INSERT INTO members (name, membershipNumber, isActive, note) VALUES (?, ?, ?, ?)"
      );

      const info = insert.run(
        item.name,
        item.membershipNumber,
        item.isActive === undefined ? 1 : Number(item.isActive),
        item.note ?? "",
      );

      return {
        ...item,
        id: info.lastInsertRowid,
        isActive: item.isActive !== false,
      };
    });

    return Array.isArray(data) ? created : created[0];
  },

  countDocuments() {
    return getSQLiteDatabase().prepare("SELECT COUNT(*) AS count FROM members").get().count;
  },

  findByIdAndUpdate(id, updateData) {
    const db = getSQLiteDatabase();
    const existing = this.findById(id);

    if (!existing) {
      return null;
    }

    const merged = { ...existing, ...updateData };
    db.prepare(
      "UPDATE members SET name = ?, membershipNumber = ?, isActive = ?, note = ? WHERE id = ?"
    ).run(
      merged.name,
      merged.membershipNumber,
      merged.isActive ? 1 : 0,
      merged.note ?? "",
      Number(id),
    );

    return this.findById(id);
  },

  findByIdAndDelete(id) {
    const existing = this.findById(id);

    if (!existing) {
      return null;
    }

    getSQLiteDatabase()
      .prepare("DELETE FROM members WHERE id = ?")
      .run(Number(id));

    return existing;
  },
};
