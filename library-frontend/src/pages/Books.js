import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Books = () => {
    const [books, setBooks] = useState([]);
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/books', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, [token]);

    const addBook = async (newBook) => {
        try {
            const response = await axios.post('http://localhost:5000/books', newBook, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks((prevBooks) => [...prevBooks, response.data]);
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const editBook = async (id, updatedBook) => {
        try {
            const response = await axios.put(`http://localhost:5000/books/${id}`, updatedBook, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks((prevBooks) => prevBooks.map((book) => (book.id === id ? response.data : book)));
        } catch (error) {
            console.error('Error editing book:', error);
        }
    };

    const deleteBook = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/books/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Books List</h2>
            <button
                className="mb-4 bg-blue-500 text-white p-2 rounded"
                onClick={() =>
                    addBook({
                        title: 'New Book',
                        author: 'Author Name',
                        publishedYear: 2023,
                        status: 'available',
                    })
                }>
                Add Book
            </button>
            <ul>
                {books.map((book) => (
                    <li key={book.id} className="mb-2">
                        <div className="p-2 border rounded shadow">
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            <p>Author: {book.author}</p>
                            <p>Status: {book.status}</p>
                            <p>Published Year: {book.publishedYear}</p>
                            <button
                                className="mt-2 bg-yellow-500 text-white p-1 rounded"
                                onClick={() =>
                                    editBook(book.id, {
                                        title: `${book.title} (Edited)`,
                                        author: book.author,
                                        publishedYear: book.publishedYear,
                                        status: book.status,
                                    })
                                }>
                                Edit
                            </button>
                            <button
                                className="mt-2 ml-2 bg-red-500 text-white p-1 rounded"
                                onClick={() => deleteBook(book.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Books;