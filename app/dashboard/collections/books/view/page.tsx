"use client";
import { Card, Button } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

interface Book {
  title: string;
  author: string;
  coverImageUrl: string;
  shortDescription: string;
  longDescription: string;
  genre: string;
  printLength: string;
  language: string;
  translator: string;
  publisher: string;
  publicationDate: string;
}

export default function View() {
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const sessionStorageUser = sessionStorage.getItem("user");
  const collectionName = useSearchParams().get("collection");
  const Id = useSearchParams().get("id");
  useEffect(() => {
    if (!user && !sessionStorageUser) {
      router.push("/login");
    } else {
      fetchBooks();
    }
  }, [user, router]);

  const fetchBooks = (): void => {
    fetch(`/api/books?collection=${collectionName}&id=${Id}`)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
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
    router.push("/dashboard/collections/books?collection=" + collectionName);
  };

  if (!user) return null;

  return (
    <>
      <div className="text-center d-flex justify-content-between">
        <Button className="m-3 btn btn-secondary" onClick={handleBack}>
          &#x25c0; Books
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
      <h2 className="text-center mb-4">Book Details</h2>

      {book ? (
        <Card>
          <Card.Body className="p-4">
            <p>
              <strong>Title:</strong> {book.title}
            </p>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>Cover:</strong> <br />
              <img
                src={book.coverImageUrl}
                alt={book.title}
                style={{ width: 200, height: 300 }}
              />
            </p>
            <p>
              <strong>Short Description:</strong> {book.shortDescription}
            </p>
            <p>
              <strong>Long Description:</strong> {book.longDescription}
            </p>
            <p>
              <strong>Genre:</strong> {book.genre}
            </p>
            <p>
              <strong>Print Length:</strong> {book.printLength}
            </p>
            <p>
              <strong>Language:</strong> {book.language}
            </p>
            <p>
              <strong>Translator:</strong> {book.translator}
            </p>
            <p>
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p>
              <strong>Publication Date:</strong> {book.publicationDate}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading...</p>
      )}
      <br />
      <br />
    </>
  );
}
