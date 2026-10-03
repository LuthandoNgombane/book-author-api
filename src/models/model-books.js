import { getDb } from '../db/connect.js';

/**
 * Recursively extracts and flattens nested genre or category trees.
 * Satisfies: Recursion requirement.
 *
 * @param {Array<Object>} categories - Array of genre/category objects with optional subcategories.
 * @returns {Array<string>} Flattened array containing all category names.
 */
const extractCategoryTree = (categories) => {
  if (!Array.isArray(categories)) {
    throw new TypeError('Categories must be provided as an array.');
  }

  let names = [];

  for (const item of categories) {
    if (item?.name) {
      names.push(item.name);
    }
    // Recursive step: process nested subcategories if present
    if (Array.isArray(item?.subcategories) && item.subcategories.length > 0) {
      names = names.concat(extractCategoryTree(item.subcategories));
    }
  }

  return names;
};

/**
 * Fetches all books from the database.
 *
 * @returns {Promise<Array<Object>>} List of all book documents.
 */
const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

/**
 * Retrieves a single book by its identifier.
 * Demonstrates: Exception handling for missing arguments.
 *
 * @param {string|number} bookId - Unique book identifier.
 * @returns {Promise<Object|null>} The matched book document.
 */
const getBookById = async (bookId) => {
  if (!bookId) {
    throw new Error('A valid book ID is required to fetch a book.');
  }

  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

/**
 * Computes summary statistics across books using native ES6 array methods.
 * Satisfies: Native Array ES6 functions (filter, map, reduce) and Exception throwing.
 *
 * @param {string} [genreFilter] - Optional genre name to filter books by.
 * @returns {Promise<Object>} Formatted statistics for the selected books.
 */
const getBookAnalytics = async (genreFilter) => {
  const books = await getAllBooks();

  if (!Array.isArray(books)) {
    throw new Error('Unable to retrieve book catalog for analysis.');
  }

  // ES6 Array Method: filter (block body with explicit return)
  const targetBooks = genreFilter
    ? books.filter((b) => {
        return Boolean(b.genre && b.genre.toLowerCase() === genreFilter.toLowerCase());
      })
    : books;

  // ES6 Array Method: map (block body with explicit return)
  const titles = targetBooks.map((b) => {
    return b.title;
  });

  // ES6 Array Method: reduce (block body with explicit return)
  const totalPages = targetBooks.reduce((acc, b) => {
    return acc + (Number(b.pages) || 0);
  }, 0);

  const averagePages = targetBooks.length > 0
    ? Number((totalPages / targetBooks.length).toFixed(1))
    : 0;

  // --- RECURSION CALL ---
  // Collect all category structures across the books
  const allCategories = books.flatMap((b) => {
    return Array.isArray(b.categories) ? b.categories : [];
  });

  // Execute recursive function and deduplicate names
  const uniqueCategories = [...new Set(extractCategoryTree(allCategories))];

  return {
    genre: genreFilter || 'All',
    totalBooks: targetBooks.length,
    titles,
    totalPages,
    averagePages,
    availableCategories: uniqueCategories, // <-- Satisfies and demonstrates recursion live
  };
};

/**
 * Verifies if an author exists in the database.
 *
 * @param {string|number} authorId - Unique author identifier.
 * @returns {Promise<boolean>} True if the author exists, false otherwise.
 */
const authorExists = async (authorId) => {
  if (!authorId) {
    throw new Error('Author ID must be provided.');
  }

  const db = getDb();
  const author = await db.collection('authors').findOne({ id: authorId });
  return !!author;
};

/**
 * Inserts a new book into the database.
 * Demonstrates: Input validation and exception handling.
 *
 * @param {Object} book - The book object to insert.
 * @returns {Promise<Object>} The clean book object without Mongo _id.
 */
const createBook = async (book) => {
  if (!book || typeof book !== 'object') {
    throw new Error('Book payload must be an object.');
  }

  const db = getDb();
  await db.collection('books').insertOne(book);
  const { _id, ...cleanBook } = book;
  return cleanBook;
};

/**
 * Updates an existing book record.
 *
 * @param {string|number} id - Book ID to update.
 * @param {Object} bookData - Updated attributes for the book.
 * @returns {Promise<Object>} Updated book representation.
 */
const updateBook = async (id, bookData) => {
  if (!id) {
    throw new Error('Book ID is required for update.');
  }

  const db = getDb();
  await db.collection('books').updateOne({ id }, { $set: bookData });
  return { id, ...bookData };
};

/**
 * Deletes a book record from the collection.
 *
 * @param {string|number} id - Book ID to delete.
 * @returns {Promise<Object>} MongoDB delete operation result.
 */
const deleteBook = async (id) => {
  if (!id) {
    throw new Error('Book ID is required for deletion.');
  }

  const db = getDb();
  return await db.collection('books').deleteOne({ id });
};

export {
  extractCategoryTree,
  getAllBooks,
  getBookById,
  getBookAnalytics,
  authorExists,
  createBook,
  updateBook,
  deleteBook,
};
