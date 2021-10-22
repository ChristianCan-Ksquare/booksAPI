// Models
const { Book } = require("../models");

// Fetch all books
const getAll = (req, res) => {
  Book.getAll((books) => {
    res.send(books);
  });
};

// Get book by guid
const getByGuid = (req, res) => {
  const { guid } = req.params;
  // Read all book
  Book.getAll((books) => {
    // Filter by guid
    const book = books.find((ent) => ent.guid === guid);

    if (book) {
      res.send(book);
    } else {
      res.status(404).send({
        message: "Ups!!! Book not found.",
      });
    }
  });
};

// Add new book to books
const createBook = (req, res) => {
  const { body } = req;

  Book.getAll((books) => {
    // Find if book already exists
    const book = books.find((ent) => bookExists(ent));
    function bookExists(book) {
      if (
        book.title === body.title &&
        book.author === body.author &&
        book.year === body.year
      ) {
        return book;
      }
    }

    if (book) {
      res.status(404).send({
        message: "Ups!!! Book already exists.",
      });
    } else {
      // Create new instance
      const newBook = new Book(body);
      // Save in db
      newBook.save();
      res.send({
        message: "Book successfully added!!!",
        guid: newBook.getGuid(),
      });
    }
  });
};

// Update an existing book
const updateBook = (req, res) => {
  const {
    params: { guid },
    body,
  } = req;
  // Read all book
  Book.getAll((books) => {
    // Filter by guid
    const book = books.find((ent) => ent.guid === guid);

    if (book) {
      const book_2 = books.find((ent) => bookExists(ent));
      function bookExists(book) {
        if (
          book.title === body.title &&
          book.author === body.author &&
          book.year === body.year
        ) {
          return book;
        }
      }

      if (book_2) {
        res.status(400).send({
          message:
            "Ups!!! A book with the same characteristics already exists.",
        });
      } else {
        Object.assign(book, body);
        Book.update(books);
        res.send({
          message: "Book successfully updated!!!",
        });
      }
    } else {
      res.status(404).send({
        message: "Ups!!! Book not found.",
      });
    }
  });
};

// Delete book from books
const deleteBook = (req, res) => {
  const { guid } = req.params;
  // Read all books
  Book.getAll((books) => {
    // Filter by guid
    const bookIdx = books.findIndex((ent) => ent.guid === guid);

    if (bookIdx !== -1) {
      books.splice(bookIdx, 1);
      Book.update(books);
      res.send({
        message: "Book successfully deleted!!!",
      });
    } else {
      res.status(404).send({
        message: "Ups!!! Book not found.",
      });
    }
  });
};

module.exports = {
  getAll,
  getByGuid,
  createBook,
  updateBook,
  deleteBook,
};
