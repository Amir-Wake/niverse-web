"use client";
import React, { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./booksPage.css";
import {books} from "./books";

function Books() {  
  return (
    <>
      <div style={{background: "linear-gradient(to bottom, white, white,black)"}}>
        <div>
          <h1 className="text-4xl text-center py-5">Explore Our Books</h1>
        </div>
        <div className="scroll-container">
          <div className="scroll-content">
            {[...books, ...books].map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="mb-1 p-2 w-auto inline-block"
              >
                <div className="no-underline text-lg text-black">
                  <div className="w-48 h-80 mx-auto border-1 border-gray-300 rounded-md">
                    <img
                      src={book.src}
                      alt="Cover"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <br />
        </div>
      </div>
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
