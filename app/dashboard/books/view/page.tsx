"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

interface Book {
  collection: string;
  title: string;
  author: string;
  coverImageUrl: string;
  shortDescription: string;
  longDescription: string;
  genre: string[];
  printLength: string;
  language: string;
  translator: string;
  publisher: string;
  publicationDate: string;
  createdDate: string;
  downloadedNumber: number;
  wantToReadNumber: number;
  id: string;
}

function View() {
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const Id = useSearchParams()?.get("id") ?? "";
  let userSession: string | null = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      userSession = sessionStorage.getItem("user");
    }

    if (!user && !userSession) {
      router.push("/login");
    } else {
      fetchBooks();
    }
  }, [user, router]);

  const fetchBooks = (): void => {
    fetch(`/api/books?id=${Id}`)
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
    router.push("/dashboard/books");
  };

  if (!user) return null;

  return (
    <>
      <title>dashboard</title>
      <div className="flex justify-between items-center p-3 border-b-2 mb-10">
        <div className="w-1/4">
          <button className="p-2 text-2xl" onClick={handleBack}>
            &lt; Back
          </button>
        </div>
        <div className="w-2/4">
          <h2 className="text-center font-bold text-2xl">View</h2>
        </div>
        <div className="w-1/4 text-right">
          <button
            className="bg-red-500 text-white p-1 text-l rounded"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <br />

      {book ? (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-auto h-auto rounded-lg"
              />
            </div>
            <div className="md:w-2/3 md:pl-6">
              <p className="text-xl font-semibold mb-2 text-gray-900">
                <strong>Id:</strong> {book.id}
              </p>
              <p className="text-xl font-semibold mb-2 text-gray-900">
                <strong>Collection:</strong> {book.collection}
              </p>
              <p className="text-xl font-semibold mb-2 text-gray-900">
                <strong>Title:</strong> {book.title}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Author:</strong> {book.author}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Short Description:</strong> {book.shortDescription}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Long Description:</strong> {book.longDescription}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Genre:</strong> {book.genre.join(", ")}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Print Length:</strong> {book.printLength}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Language:</strong> {book.language}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Translator:</strong> {book.translator}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Publisher:</strong> {book.publisher}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Publication Date:</strong> {book.publicationDate}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Created Date:</strong> {book.createdDate}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Downloaded Number:</strong> {book.downloadedNumber}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong>Want to Read Number:</strong> {book.wantToReadNumber||0}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-900">Loading...</p>
      )}
      <br />
      <br />
    </>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <View />
    </Suspense>
  );
}
