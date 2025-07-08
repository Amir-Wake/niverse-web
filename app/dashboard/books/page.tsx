"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch, FaEdit, FaTrash, FaCopy, FaArrowLeft, FaBook, FaUser, FaLanguage, FaPlus } from "react-icons/fa";

interface Book {
  bookId: string;
  title: string;
  author: string;
  translator: string;
}

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;

    if (!user && !userSession) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks(searchTerm);
  }, [searchTerm, allBooks]);

  const fetchBooks = (): void => {
    setLoading(true);
    fetch(`/api/AllBooks`)
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a: Book, b: Book) => a.title.localeCompare(b.title));
        setAllBooks(sortedData);
        setBooks(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching books", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const filterBooks = (search: string): void => {
    if (!search.trim()) {
      setBooks(allBooks);
    } else {
      const filteredBooks = allBooks.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        (book.translator && book.translator.toLowerCase().includes(search.toLowerCase()))
      ).sort((a, b) => a.title.localeCompare(b.title));
      setBooks(filteredBooks);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("user");
        router.push("/login");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (bookId: string) => {
    router.push(`/dashboard/books/update?id=${bookId}`);
  };

  const handleDelete = async (bookId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      fetch(`/api/books?id=${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          // Update both books and allBooks to maintain filter state
          setBooks(books.filter((book) => book.bookId !== bookId));
          setAllBooks(allBooks.filter((book) => book.bookId !== bookId));
        })
        .catch((error) => {
          console.error("Error deleting book", error);
        });
    }
  };

  const handleCopy = (bookId: string) => {
    const collectionToCopy = prompt("Enter the collection to copy the book to:");
    if (collectionToCopy) {
      fetch(`/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCollection: "books",
          destinationCollection: collectionToCopy,
          documentId: bookId,
        }),
      })
        .then(() => {
          alert("Book copied successfully");
        })
        .catch((error) => {
          console.error("Error copying book", error);
        });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Books Management - Nverse Dashboard</title>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaBook className="mr-3 text-blue-600" />
                Books Management
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/add"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Book
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Books</h2>
            <span className="text-sm text-gray-500">
              {books.length} of {allBooks.length} books
            </span>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or translator..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Books</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading books...</span>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No books found" : "No books available"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first book"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {books.map((book) => (
                <div
                  key={book.bookId}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/dashboard/books/view?id=${book.bookId}`}
                        className="block group"
                      >
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {book.title}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          <span>By {book.author}</span>
                        </div>
                        {book.translator && (
                          <div className="flex items-center">
                            <FaLanguage className="mr-1" />
                            <span>Translated by {book.translator}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(book.bookId)}
                        className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit Book"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleCopy(book.bookId)}
                        className="flex items-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        title="Copy Book"
                      >
                        <FaCopy className="mr-1" />
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(book.bookId)}
                        className="flex items-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Book"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    }>
      <Books />
    </Suspense>
  );
}
