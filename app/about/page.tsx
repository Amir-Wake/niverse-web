"use client";
import React, { useState, useEffect } from "react";
import NavbarComp from "@/components/navbarComp";
import "bootstrap/dist/css/bootstrap.css";

export default function About() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const [result, setResult] = React.useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target as HTMLFormElement);

    formData.append("access_key", "1601eeac-004d-42c3-9f8f-f42048fd9298");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      setResult("Message Submitted Successfully");
      (event.target as HTMLFormElement).reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
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
              <h1 className="display-1 lh-1 mb-3">About Us</h1>
              <p className="lead fw-normal text-muted mb-5">
                We are passionate about books and dedicated to helping you
                discover your next great read. Our app offers a vast collection
                of books across various genres, ensuring there is something for
                everyone.
              </p>
              <p className="lead fw-normal text-muted mb-5">
                Join our community of book lovers and start exploring today!
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <h1 className="display-1 lh-1 mb-3">Contact Us</h1>
            <p className="lead fw-normal text-muted mb-5">
              Have a question or feedback? We would love to hear from you! Fill out
              the form below, and we will get back to you as soon as possible.
            </p>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  name="message"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="text-center mb-2">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
            <div className="text-center mb-2">
              <span>{result}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
