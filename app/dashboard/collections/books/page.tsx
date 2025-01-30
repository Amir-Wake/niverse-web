"use client";
import { Button } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

interface Book {
  id: string;
  title: string;
}

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const collectionName = useSearchParams().get("collection");
  const [user] = useAuthState(auth);
  let userSession: string | null = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      userSession = sessionStorage.getItem("user");
    }

    if (!user && !userSession) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    fetchBooks(searchTerm);
  }, [searchTerm]);

  const fetchBooks = (search: string): void => {
    const searchQuery = search ? `&search=${search}` : "";
    fetch(`/api/books?collection=${collectionName}${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error("Error fetching books", error);
      });
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
    router.push("/dashboard/collections");
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (bookId: string) => {
    router.push(
      `/dashboard/collections/books/update?collection=${collectionName}&id=${bookId}`
    );
  };

  const handleDelete = async (bookId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (window.confirm("Are you sure you want to delete this book?")) {
      fetch(`/api/books?id=${bookId}&collection=${collectionName}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          setBooks(books.filter((book) => book.id !== bookId));
        })
        .catch((error) => {
          console.error("Error deleting book", error);
        });
    }
  };

  const handleCopy = (bookId: string) => {
    const collectionToCopy = prompt(
      "Enter the collection to copy the book to:"
    );
    if (collectionToCopy) {
      fetch(`/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCollection: collectionName,
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
    <>
      <title>dashboard</title>
      <div className="flex justify-between items-center text-center p-3 border-b-2">
        <Button className="py-2 px-4 rounded text-xl" onClick={handleBack}>
          &#x25c0; Collections
        </Button>
        <h2 className="text-center text-2xl font-bold">{collectionName}</h2>
        <Button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      <br />
      <div className="p-4 border rounded shadow-md">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-center mb-4 text-center">
            <div className="relative w-1/2 min-w-full">
              <input
                className="w-full border p-2 pl-10 text-black"
                type="text"
                placeholder="Search books..."
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <ul className="list-none p-0">
            {books.map((book, index) => (
              <li
                key={`${book.id}-${index}`}
                className="mb-2 p-2 border border-gray-300"
              >
                <Link
                  href={`/dashboard/collections/books/view?collection=${collectionName}&id=${book.id}`}
                  className="no-underline text-lg"
                >
                  {book.title}
                </Link>
                <div className="mt-1">
                  <Button
                    variant="none"
                    size="sm"
                    onClick={() => handleEdit(book.id)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="none"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                    className="mr-2"
                  >
                    Delete
                  </Button>
                  <Button
                    variant="none"
                    size="sm"
                    onClick={() => handleCopy(book.id)}
                  >
                    Copy
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <br />
      <br />
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Books />
    </Suspense>
  );
}
