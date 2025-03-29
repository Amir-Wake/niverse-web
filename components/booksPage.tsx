"use client";
import React, { Suspense, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface Book {
  id: string;
  title: string;
  coverImageUrl: string;
}

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const allBooksApi = `${process.env.NEXT_PUBLIC_NEWBOOKS_API}`;
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  useEffect(() => {
    try {
      fetch(allBooksApi)
        .then((response) => response.json())
        .then((data) => {
          setBooks(data);
        });
    } catch (error) {
      console.error("Error fetching books", error);
    }
  }, []);

  return (
    < >
    <div style={{ background: "linear-gradient(to bottom, white, grey)" }}>
      <div>
        <h1 className="text-4xl text-center py-5">Explore Our Books</h1>
      </div>

      <Carousel
        swipeable={true}
        draggable={true}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        centerMode={true}
        autoPlaySpeed={2000}
        keyBoardControl={true}
        customTransition="all 1s linear"
        transitionDuration={1000}
        removeArrowOnDeviceType={["desktop", "tablet", "mobile"]}
      >
        {books.map((book, index) => (
          <div
            key={`${book.id}-${index}`}
            className="mb-1 p-2 w-auto"
          >
            <div
              className="no-underline text-lg text-black"
            >
                <div className="w-48 h-80 mx-auto border-1 border-gray-200 rounded-md">
                <img
                  src={book.coverImageUrl}
                  alt="Cover"
                  className="object-cover w-full h-full rounded-md"
                />
                </div>
                <div className="text-center font-semibold text-xl mt-2">
                {book.title.length > 30 ? book.title.slice(0, 30) + "..." : book.title}
                </div>
            </div>
          </div>
        ))}
      </Carousel>

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
