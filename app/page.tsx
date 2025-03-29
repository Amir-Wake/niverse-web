"use client";
import React from "react";
import appStore from "@/public/app-store-badge.svg";
import googlePlay from "@/public/google-play-badge.png";
import "bootstrap/dist/css/bootstrap.css";
import BooksPage from "@/components/booksPage";
import About from "@/components/about";
import bookTablet from "@/public/Book-Tablet.png";
import iPad2 from "@/public/iPad-2.png";
import iPad3 from "@/public/iPad-3.png";
import iPad4 from "@/public/iPad-4.png";

export default function Home() {
  return (
    <div>
      <title>Niverse</title>
      <div
        className="px-5 pt-2"
        style={{
          background: "linear-gradient(to top, black, white)",
        }}
      >
        <div className="row align-items-center pt-5">
          <div className="col-lg-6">
        <div className=" mb-lg-0 text-center text-lg-start">
          <h1 className="display-1 lh-1 mb-3">
            Discover Your Next Favorite Book.
          </h1>
            <p className="text-muted text-2xl mb-4">
             Explore a world of books that will take you on a journey of discovery and imagination.
            </p>
          <div className="flex flex-col lg:flex-row items-center mb-2 gap-3">
            <div className="flex-col items-center">
          <a href="#" className="w-50">
            <img
              className="app-badge"
              src={googlePlay.src}
              alt="Google Play Badge"
              style={{ width: "150px", height: "45px" }}
            />
          </a>
          <p className="text-lg p-1 text-center text-red-400">Coming soon...</p>
            </div>
            <div className="flex-col items-center">
          <a
            href="https://apps.apple.com/gb/app/niverse/id6742115218"
            className="w-50"
          >
            <img
              className="app-badge"
              src={appStore.src}
              alt="App Store Badge"
              style={{ width: "150px", height: "50px" }}
            />
          </a>
          <p className="text-lg p-1 text-center text-green-500">
            Available
          </p>
            </div>
          </div>
        </div>
          </div>
          <div className="col-lg-6">
        <img src={bookTablet.src} alt="Demo Screen" className="img-fluid" />
          </div>
        </div>
      </div>
      <div className="mt-2 text-center d-flex flex-column align-items-center justify-content-center">
        <h1 className="text-4xl my-3">Your Digital Library</h1>
        <div
          className="d-flex justify-content-center align-items-center overflow-hidden p-5"
          style={{
        maxWidth: "100%",
        whiteSpace: "nowrap",
        scrollBehavior: "smooth",
          }}
        >
          <img
        src={iPad2.src}
        alt="iPad2"
        className="img-fluid bg-transparent mx-2"
        style={{ width: "300px", height: "auto" }}
          />
          <img
        src={iPad4.src}
        alt="iPad4"
        className="img-fluid bg-transparent mx-2"
        style={{
          width: "300px",
          height: "auto",
          transform: "scale(1.1)", 
        }}
          />
          <img
        src={iPad3.src}
        alt="iPad3"
        className="img-fluid bg-transparent mx-2"
        style={{ width: "300px", height: "auto" }}
          />
        </div>
      </div>
      <BooksPage />

      <About />
      <footer className="bg-light py-4 mt-5">
        <div className="container text-center">
          <div className="row">
        <div className="col-md-3">
          <p className="mb-0">© 2025 Niverse</p>
        </div>
        <div className="col-md-3">
          <p className="mb-0">All Rights Reserved</p>
        </div>
        <div className="col-md-3">
          <a href="/about/privacy-policy" className="text-decoration-none">
            Privacy Policy
          </a>
        </div>
        <div className="col-md-3">
          <a href="/login" className="text-decoration-none">
            Admin
          </a>
        </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
