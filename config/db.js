import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

let sqliteDatabase;

export const getSQLiteDatabase = () => {
  if (sqliteDatabase) {
    return sqliteDatabase;
  }

  const sqlitePath = process.env.SQLITE_PATH || path.join(process.cwd(), "data", "library.sqlite");
  const directory = path.dirname(sqlitePath);

  fs.mkdirSync(directory, { recursive: true });

  sqliteDatabase = new Database(sqlitePath);
  sqliteDatabase.pragma("foreign_keys = ON");

  return sqliteDatabase;
};

const initializeSQLiteDB = () => {
  const db = getSQLiteDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      _id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      publisher TEXT NOT NULL,
      category TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      membershipNumber TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      isActive INTEGER NOT NULL DEFAULT 1,
      note TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS book_copies (
      _id TEXT PRIMARY KEY,
      titleIsbn TEXT NOT NULL,
      inStock INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (titleIsbn) REFERENCES books(_id)
    );
  `);
};

const initializeSQLiteSeedData = () => {
  const db = getSQLiteDatabase();

  const hasBooks = db.prepare("SELECT COUNT(*) AS count FROM books").get().count;
  if (hasBooks > 0) {
    return;
  }

  db.transaction(() => {
    db.prepare(
      "INSERT INTO books (_id, title, author, publisher, category) VALUES (?, ?, ?, ?, ?)"
    ).run(
      "978-0132350884",
      "Clean Code",
      "Robert C. Martin",
      "Prentice Hall",
      "Programming",
    );

    db.prepare(
      "INSERT INTO books (_id, title, author, publisher, category) VALUES (?, ?, ?, ?, ?)"
    ).run(
      "978-1491950296",
      "Designing Data-Intensive Applications",
      "Martin Kleppmann",
      "O'Reilly Media",
      "Databases",
    );

    db.prepare(
      "INSERT INTO books (_id, title, author, publisher, category) VALUES (?, ?, ?, ?, ?)"
    ).run(
      "978-1617294945",
      "Learning Node.js",
      "Marc Harter",
      "Manning",
      "Programming",
    );

    db.prepare(
      "INSERT INTO members (name, membershipNumber, isActive, note) VALUES (?, ?, ?, ?)"
    ).run("Alice Cohen", "10001", 1, "");

    db.prepare(
      "INSERT INTO members (name, membershipNumber, isActive, note) VALUES (?, ?, ?, ?)"
    ).run("David Levi", "10002", 1, "");

    db.prepare(
      "INSERT INTO book_copies (_id, titleIsbn, inStock) VALUES (?, ?, ?)"
    ).run("001", "978-0132350884", 1);
    db.prepare(
      "INSERT INTO book_copies (_id, titleIsbn, inStock) VALUES (?, ?, ?)"
    ).run("002", "978-0132350884", 1);
    db.prepare(
      "INSERT INTO book_copies (_id, titleIsbn, inStock) VALUES (?, ?, ?)"
    ).run("003", "978-1491950296", 1);
    db.prepare(
      "INSERT INTO book_copies (_id, titleIsbn, inStock) VALUES (?, ?, ?)"
    ).run("004", "978-1617294945", 1);
    db.prepare(
      "INSERT INTO book_copies (_id, titleIsbn, inStock) VALUES (?, ?, ?)"
    ).run("005", "978-1617294945", 1);
  })();

  console.log("SQLite sample data initialized");
};

export const connectDB = async () => {
  initializeSQLiteDB();
  initializeSQLiteSeedData();
  console.log("SQLite connected");
};
