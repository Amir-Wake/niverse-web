"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavbarComp from "@/components/navbarComp";
import "bootstrap/dist/css/bootstrap.css";
import { BsBook, BsPerson, BsBuilding, BsCalendar, BsGlobe } from "react-icons/bs";

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
}

function View() {
  const [book, setBook] = useState<Book | null>(null);
  const Id = useSearchParams().get("id");
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

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

  useEffect(() => {
    fetchBooks();
  }, []);

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

  return (
    <>
      <title>Niverse</title>
      <NavbarComp
        isNavbarCollapsed={isNavbarCollapsed}
        handleNavbarToggle={handleNavbarToggle}
        handleNavItemClick={handleNavItemClick}
      />

      {book ? (
        <div
          className="max-w-4xl mx-auto p-4 bg-white"
          style={{ marginTop: "85px" }}
        >
          <div className="text-center absolute left-5 no-underline">
          </div>
          <div
            className="flex flex-col md:flex-row justify-center items-center"
            style={{ direction: book.language === "کوردی" ? "rtl" : "ltr" }}
          >
            <div className="md:w-1/2 ">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="rounded-lg border-2 border-gray-200" style={{width:"20em",height:"30em"}}
              />
            </div>
            <div className="md:w-2/3 md:px-6">
              <div className="text-center m-4">
                <p className="text-xl font-semibold mb-2 text-gray-900">
                  <strong></strong> {book.title} ,
                  <strong></strong> {book.author}
                </p>
              </div>
              <p className="text-lg mb-2 text-gray-900">
                <strong></strong> {book.shortDescription}
              </p>
              <p className="text-lg mb-2 text-gray-900">
                <strong></strong> {book.longDescription}
              </p>
            </div>
          </div>
          <hr className="my-1" />
            <div className="flex overflow-x-auto py-4">
              <div className="flex-none text-center m-2 min-w-[150px]">
              <p className="text-lg mb-2">
                <strong>Pages</strong>
                <BsBook size={30} className="mx-auto" />
                {book.printLength}
              </p>
              </div>
              <div className="flex-none text-center m-2 min-w-[150px]">
              <p className="text-lg mb-2">
                <strong>Language</strong>
                <BsGlobe size={30} className="mx-auto" />
                {book.language}
              </p>
              </div>
              <div className="flex-none text-center m-2 min-w-[150px]">
              <p className="text-lg mb-2">
                <strong>Translator</strong>
                <BsPerson size={30} className="mx-auto" />
                {book.translator}
              </p>
              </div>
              <div className="flex-none text-center m-2 min-w-[150px]">
              <p className="text-lg mb-2">
                <strong>Publisher</strong>
                <BsBuilding size={30} className="mx-auto" />
                {book.publisher}
              </p>
              </div>
              <div className="flex-none text-center m-2 min-w-[150px]">
              <p className="text-lg mb-2">
                <strong>Publication Date</strong>
                <BsCalendar size={30} className="mx-auto" />
                {book.publicationDate}
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
