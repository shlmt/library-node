import { BookCopy } from "./bookCopy.model.js";

const categoryDigits = {
  קומיקס: "1",
  ילדים: "2",
  מנוקד: "3",
  נוער: "4",
  עיון: "5",
  סיפורת: "6",
  "מבוגרים בלבד": "7",
  מתכונים: "8",
  "פסיכולוגיה ורפואה": "9",
};

const createBarcode = async (book) => {
  const isbnDigits = book.isbn.replace(/\D/g, "");
  if (isbnDigits.length < 2) {
    const error = new Error("Book ISBN must contain at least two digits");
    error.name = "ValidationError";
    throw error;
  }

  const prefix = `${categoryDigits[book.category] ?? "0"}-${isbnDigits.slice(-2)}`;
  const matchingCopies = await BookCopy.find({
    _id: new RegExp(`^${prefix}-\\d+$`),
  }).select("_id").lean();
  const nextNumber = matchingCopies.reduce((highest, copy) => {
    const number = Number(copy._id.slice(prefix.length + 1));
    return Math.max(highest, number);
  }, 0) + 1;

  return `${prefix}-${nextNumber}`;
};

const withBookDetails = (copy, book) => {
  const bookData = book.toObject();
  const bookId = bookData._id;
  const isbnId = bookData.isbn;
  delete bookData._id;
  delete bookData.isbn;
  delete bookData.createdAt;
  delete bookData.updatedAt;
  delete bookData.copies;

  const copyData = copy.toObject();
  copyData.book = bookId;

  return { ...copyData, isbnId, ...bookData };
};

export const bookCopyRepository = {
  async findAll() {
    const copies = await BookCopy.find().populate("book").sort({ _id: 1 });
    return copies.map((copy) => withBookDetails(copy, copy.book));
  },

  async findById(barcode) {
    const copy = await BookCopy.findById(barcode).populate("book");
    return copy ? withBookDetails(copy, copy.book) : null;
  },

  async create(data, book) {
    const bookCopy = await BookCopy.create({
      _id: await createBarcode(book),
      book: data.book,
      status: data.status,
    });

    const populatedCopy = await bookCopy.populate("book");
    return withBookDetails(populatedCopy, populatedCopy.book);
  },

  async update(barcode, data) {
    const bookCopy = await BookCopy.findById(barcode);
    if (!bookCopy) {
      return null;
    }

    if (data.book !== undefined) {
      bookCopy.book = data.book;
    }

    if (data.status !== undefined) {
      const allowedTransitions = {
        new: ["available", "underRepair", "lost", "outOfStock"],
        available: ["underRepair", "lost", "outOfStock"],
        underRepair: ["available", "lost", "outOfStock"],
        lost: ["available", "outOfStock"],
        outOfStock: [],
      };

      if (data.status !== bookCopy.status && !allowedTransitions[bookCopy.status]?.includes(data.status)) {
        const error = new Error(`Cannot change status from ${bookCopy.status} to ${data.status}`);
        error.name = "ValidationError";
        throw error;
      }

      bookCopy.status = data.status;
    }
    await bookCopy.save();

    const populatedCopy = await bookCopy.populate("book");
    return withBookDetails(populatedCopy, populatedCopy.book);
  },

  delete(barcode) {
    return BookCopy.findByIdAndDelete(barcode);
  },
};
