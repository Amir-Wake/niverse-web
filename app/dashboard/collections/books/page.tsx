"use client";
import { Button } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const collectionName = useSearchParams().get("collection");
  const [user] = useAuthState(auth);
  const sessionStorageUser = sessionStorage.getItem("user");

  useEffect(() => {
    if (!user && !sessionStorageUser) {
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
      <div className="text-center d-flex justify-content-between">
        <Button className="m-3 btn btn-secondary" onClick={handleBack}>
          &#x25c0; Collections
        </Button>
        <Button
          className=" m-3 "
          style={{
            backgroundColor: "red",
            borderColor: "red",
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      <br />
      <div className="p-4">
        <div style={{ width: "100%", margin: "auto" }}>
          <h2 className="text-center mb-4">{collectionName}</h2>
          <div className="text-center d-flex align-items-center justify-content-center mb-4">
            <p className="mb-0 mr-2">Search</p>
            <input
              className="w-50 border"
              type="text"
              placeholder="Search books..."
              onChange={handleSearch}
              style={{ padding: "10px" }}
            />
          </div>
          <ul
            className="book-list"
            style={{ listStyleType: "none", padding: 0 }}
          >
            {books.map((book, index) => (
              <li
                key={`${book.id}-${index}`}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <Link
                  href={`/dashboard/collections/books/view?collection=${collectionName}&id=${book.id}`}
                  style={{ textDecoration: "none", fontSize: "20px" }}
                >
                  {book.title}
                </Link>
                <div style={{ marginTop: "5px" }}>
                  <Button
                    variant="none"
                    size="sm"
                    onClick={() => handleEdit(book.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="none"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                    style={{ marginRight: "10px" }}
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
