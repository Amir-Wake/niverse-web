"use client"
import React, { useState, useEffect } from "react";
import NavbarComp from "@/components/navbarComp";
import appStore from "@/public/app-store-badge.svg";
import googlePlay from "@/public/google-play-badge.png";
import 'bootstrap/dist/css/bootstrap.css';
import bgni from "@/public/bgni.png";

export default function Home() {
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

  return (
    <div>
      <NavbarComp
        isNavbarCollapsed={isNavbarCollapsed}
        handleNavbarToggle={handleNavbarToggle}
        handleNavItemClick={handleNavItemClick}
      />
      <div className="container px-5 mt-5 pt-5">
        <div className="row gx-5 align-items-center">
          <div className="col-lg-6">
            <div className="mb-5 mb-lg-0 text-center text-lg-start">
              <h1 className="display-1 lh-1 mb-3">
                Discover Your Next Favorite Book.
              </h1>
              <p className="lead fw-normal text-muted mb-5">
                Explore a vast collection of books and find your next great
                read with our book app!
              </p>
                <div className="flex flex-col lg:flex-row items-center mb-3">
                <a href="#!" className="w-50">
                  <img
                  className="app-badge"
                  src={googlePlay.src}
                  alt="Google Play Badge"
                  style={{ width: "150px", height: "50px" }}
                  />
                </a>
                <a href="#!" className="w-50">
                  <img
                  className="app-badge"
                  src={appStore.src}
                  alt="App Store Badge"
                  style={{ width: "150px", height: "50px" }}
                  />
                </a>
                </div>
            </div>
          </div>
          <div className="col-lg-6">
            <img src={bgni.src} alt="Demo Screen" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
}
