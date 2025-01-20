import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBook, setCurrentBook] = useState(null); 
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
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book._id === id ? response.data : book))
            );
            setIsEditing(false); // Close the modal
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
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const openEditModal = (book) => {
        setCurrentBook(book);
        setIsEditing(true);
    };

    const closeEditModal = () => {
        setIsEditing(false);
        setCurrentBook(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (currentBook) {
            editBook(currentBook._id, currentBook);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Books List</h2>
            {user?.role === 'admin' && (
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
            )}
            <ul>
                {books.map((book) => (
                    <li key={book._id} className="mb-2">
                        <div className="p-2 border rounded shadow">
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            <p>Author: {book.author}</p>
                            <p>Status: {book.status}</p>
                            <p>Published Year: {book.publishedYear}</p>
                            {user?.role === 'admin' && (
                                <>
                                    <button
                                        className="mt-2 bg-yellow-500 text-white p-1 rounded"
                                        onClick={() => openEditModal(book)}>
                                        Edit
                                    </button>
                                    <button
                                        className="mt-2 ml-2 bg-red-500 text-white p-1 rounded"
                                        onClick={() => deleteBook(book._id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit Modal */}
            {isEditing && currentBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Edit Book</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={currentBook.title}
                                    onChange={(e) =>
                                        setCurrentBook({ ...currentBook, title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Author</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={currentBook.author}
                                    onChange={(e) =>
                                        setCurrentBook({ ...currentBook, author: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Published Year
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    value={currentBook.publishedYear}
                                    onChange={(e) =>
                                        setCurrentBook({
                                            ...currentBook,
                                            publishedYear: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={currentBook.status}
                                    onChange={(e) =>
                                        setCurrentBook({ ...currentBook, status: e.target.value })
                                    }>
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                                    onClick={closeEditModal}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;
