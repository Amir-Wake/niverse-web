"use client";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import NavbarComp from "@/components/navbarComp";
import "bootstrap/dist/css/bootstrap.css";

interface Book {
  id: string;
  title: string;
}

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

  useEffect(() => {
    fetchBooks(searchTerm);
  }, [searchTerm]);

  const fetchBooks = (search: string): void => {
    const searchQuery = search ? `search=${search}` : "";
    fetch(`/api/books?${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error("Error fetching books", error);
      });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleNavbarToggle = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  const handleNavItemClick = () => {
    if (window.innerWidth < 992) {
      setIsNavbarCollapsed(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && window.innerWidth < 992) {
        setIsNavbarCollapsed(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsNavbarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <title>Niverse</title>
      <div>
      <NavbarComp
        isNavbarCollapsed={isNavbarCollapsed}
        handleNavbarToggle={handleNavbarToggle}
        handleNavItemClick={handleNavItemClick}
      />
        </div>
      <div className="container px-5" style={{ marginTop: 85 }}>
        <div className="w-50 mx-auto">
          <div className="relative min-w-full  p-2 flex items-center ">
            <FaSearch className="absolute right-4 text-black " />
            <input
              className="w-full border p-2 pl-10 text-black bg-gray-300 rounded-md  "
              type="text"
              placeholder="Search books..."
              onChange={handleSearch}
            />
          </div>
        </div>
        <ul className="list-none p-0">
          {books.map((book, index) => (
            <li
              key={`${book.id}-${index}`}
              className="mb-1 p-2 w-auto"
            >
              <Link
                href={`/books/view?id=${book.id}`}
                className="no-underline text-lg text-black"
              >
                {book.title.length>25?book.title.slice(0,25)+"...":book.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <br />
        <br />
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
