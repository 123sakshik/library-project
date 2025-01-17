const express = require('express');
const { getBooks, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const router = express.Router();

router.get('/', authenticateToken, getBooks);
router.post('/', authenticateToken, authorizeRole('admin'), addBook);
router.put('/:id', authenticateToken, authorizeRole('admin'), updateBook);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteBook);

module.exports = router;
