const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
    const books = await Book.find();
    res.json(books);
};

exports.addBook = async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
};

exports.updateBook = async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
};

exports.deleteBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
};
