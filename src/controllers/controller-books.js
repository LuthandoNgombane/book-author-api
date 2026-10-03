import {
  getAllBooks as getAllBooksFromDb,
  getBookById as getBookByIdFromDb,
  getBookAnalytics as getBookAnalyticsFromDb,
  authorExists,
  createBook as createBookFromDb,
  updateBook as updateBookFromDb,
  deleteBook as deleteBookFromDb,
} from '../models/model-books.js';

/**
 * GET /books
 */
const getAllBooks = async (req, res) => {
  try {
    const books = await getAllBooksFromDb();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books.' });
  }
};

/**
 * GET /books/:id
 */
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookByIdFromDb(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to retrieve book.' });
  }
};

/**
 * GET /books/analytics
 */
const getBookAnalytics = async (req, res) => {
  try {
    const genreFilter = req.query.genre;
    const analytics = await getBookAnalyticsFromDb(genreFilter);
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * POST /books
 */
const createBook = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate, genre, pages } = req.body;

    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdFromDb(id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists.' });
    }

    const validAuthor = await authorExists(authorId);
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author.' });
    }

    const createdBook = await createBookFromDb({
      id,
      authorId,
      title,
      publicationDate,
      genre,
      pages,
    });
    return res.status(201).json(createdBook);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create book.' });
  }
};

/**
 * PUT /books/:id
 */
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate, genre, pages } = req.body;

    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdFromDb(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const validAuthor = await authorExists(authorId);
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author.' });
    }

    const updatedBook = await updateBookFromDb(id, {
      authorId,
      title,
      publicationDate,
      genre,
      pages,
    });
    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update book.' });
  }
};

/**
 * DELETE /books/:id
 */
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await getBookByIdFromDb(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    await deleteBookFromDb(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete book.' });
  }
};

export {
  getAllBooks,
  getBookById,
  getBookAnalytics,
  createBook,
  updateBook,
  deleteBook,
};