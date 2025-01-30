"use client"
import React, { useState, useEffect } from "react";
import appStore from "@/public/app-store-badge.svg";
import googlePlay from "@/public/google-play-badge.svg";
import demoScreen from "@/public/demo-screen.mp4";
import bgni from "@/public/bgni.png";
import './styles.css';

export default function Home() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleNavbarToggle = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  const handleFeedbackModalToggle = () => {
    setIsFeedbackModalOpen(!isFeedbackModalOpen);
  };

  const handleNavItemClick = () => {
    setIsNavbarCollapsed(true);
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
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,600;1,600&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,300;0,500;0,600;0,700;1,300;1,500;1,600;1,700&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;1,400&amp;display=swap"
        rel="stylesheet"
      />

      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm"
        id="mainNav"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <div className="container px-5">
          <a
            className="navbar-brand fw-bold "
            href="#page-top"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              handleNavItemClick();
            }}
          >
            <h1 className="m-1 ">niVerse</h1>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavbarToggle}
            aria-controls="navbarResponsive"
            aria-expanded={!isNavbarCollapsed}
            aria-label="Toggle navigation"
          >
            Menu &nbsp;
            <i className="bi-list"></i>
          </button>
          <div
            className={`navbar-collapse ${isNavbarCollapsed ? "collapse" : "show"}`}
            id="navbarResponsive"
          >
            
            <ul className="navbar-nav ms-auto me-4 my-3 my-lg-0">
              <li className="nav-item">
                <a className="nav-link me-lg-3" href="#features" onClick={handleNavItemClick}>
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link me-lg-3" href="#download" onClick={handleNavItemClick}>
                  Download
                </a>
              </li>
            </ul>
            <button
              className="btn btn-primary rounded-pill px-3 mb-2 mb-lg-0"
              onClick={handleFeedbackModalToggle}
            >
              <span className="d-flex align-items-center">
                <i className="bi-chat-text-fill me-2"></i>
                <span className="small">Send Feedback</span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      <header className="masthead">
        <div className="container px-5">
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
                <div className="d-flex flex-column flex-lg-row align-items-center">
                  <a className="me-lg-3 mb-4 mb-lg-0" href="#!">
                    <img
                      className="app-badge"
                      src={googlePlay.src}
                      alt="Google Play Badge"
                    />
                  </a>
                  <a href="#!">
                    <img
                      className="app-badge"
                      src={appStore.src}
                      alt="App Store Badge"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="masthead-device-mockup">
                <svg
                  className="circle"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="circleGradient"
                      gradientTransform="rotate(45)"
                    >
                      <stop className="gradient-start-color" offset="0%"></stop>
                      <stop className="gradient-end-color" offset="100%"></stop>
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <div className="device-wrapper">
                  <div
                    className="device"
                    data-device="iPhoneX"
                    data-orientation="portrait"
                    data-color="black"
                  >
                    <div className="screen bg-black">
                      <video
                        autoPlay
                        loop
                        style={{ maxWidth: "100%", height: "100%" }}
                      >
                        <source src={demoScreen} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <aside className="text-center bg-gradient-primary-to-secondary">
        <div className="container px-5">
          <div className="row gx-5 justify-content-center">
            <div className="col-xl-8">
              <div className="h2 fs-1 text-white mb-4">
                An intuitive solution to a common problem that we all face,
                wrapped up in a single app!
              </div>{" "}
            </div>
          </div>
        </div>
      </aside>

      <section id="features">
        <div className="container px-5">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-8 order-lg-1 mb-5 mb-lg-0">
              <div className="container-fluid px-5">
                <div className="row gx-5">
                  <div className="col-md-6 mb-5">
                    <div className="text-center">
                      <i className="bi-book icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Vast Collection</h3>
                      <p className="text-muted mb-0">
                        Explore a vast collection of books from various genres
                        and authors.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-5">
                    <div className="text-center">
                      <i className="bi-search icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Easy Search</h3>
                      <p className="text-muted mb-0">
                        Find your next read easily with our powerful search and
                        filter options.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-5 mb-md-0">
                    <div className="text-center">
                      <i className="bi-star icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Personalized Recommendations</h3>
                      <p className="text-muted mb-0">
                        Get book recommendations tailored to your preferences.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-center">
                      <i className="bi-share icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Share with Friends</h3>
                      <p className="text-muted mb-0">
                        Share your favorite books and reviews with your friends.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 order-lg-0">
              <div className="features-device-mockup">
                <svg
                  className="circle"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="circleGradient"
                      gradientTransform="rotate(45)"
                    >
                      <stop className="gradient-start-color" offset="0%"></stop>
                      <stop className="gradient-end-color" offset="100%"></stop>
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <div className="device-wrapper">
                  <div
                    className="device"
                    data-device="iPhoneX"
                    data-orientation="portrait"
                    data-color="black"
                  >
                    <div className="screen bg-black">
                      <video
                        autoPlay
                        loop
                        style={{ maxWidth: "100%", height: "100%" }}
                      >
                        <source src={demoScreen} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light">
        <div className="container px-5">
          <div className="row gx-5 align-items-center justify-content-center justify-content-lg-between">
            <div className="col-12 col-lg-5">
              <h2 className="display-4 lh-1 mb-4">
                Enter a new age of reading
              </h2>
              <p className="lead fw-normal text-muted mb-5 mb-lg-0">
                Discover the joy of reading with our app. Whether you are into
                fiction, non-fiction, or anything in between, we have got you
                covered.
              </p>
            </div>
            <div className="col-sm-8 col-md-6">
              <div className="px-5 px-sm-0">
                <img
                  className="img-fluid rounded-circle"
                  src={bgni.src}
                  alt="..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-secondary-to-primary" id="download">
        <div className="container px-5">
          <h2 className="text-center text-white font-alt mb-4">
            Get the app now!
          </h2>
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center">
            <a className="me-lg-3 mb-4 mb-lg-0" href="#!">
              <img
                className="app-badge"
                src={googlePlay.src}
                alt="Google Play Badge"
              />
            </a>
            <a href="#!">
              <img className="app-badge" src={appStore.src} alt="App Store Badge" />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-black text-center py-5">
        <div className="container px-5">
          <div className="text-white-50 small">
            <div className="mb-2">
              &copy; niVerse 2025. All Rights Reserved.
            </div>
            <a href="#!">Privacy</a>
            <span className="mx-1">&middot;</span>
            <a href="#!">Terms</a>
            <span className="mx-1">&middot;</span>
            <a href="#!">FAQ</a>
          </div>
        </div>
      </footer>

      <div
        className={`modal fade ${isFeedbackModalOpen ? "show" : ""}`}
        id="feedbackModal"
        aria-labelledby="feedbackModalLabel"
        aria-hidden={!isFeedbackModalOpen}
        style={{ display: isFeedbackModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-dark gradient-dark p-4">
              <h5
                className="modal-title font-alt text-white"
                id="feedbackModalLabel"
              >
                Send feedback
              </h5>
              <button
                className="btn-close btn-close-white"
                type="button"
                onClick={handleFeedbackModalToggle}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body border-0 p-4">
              <form
                id="contactForm"
                action="https://api.web3forms.com/submit"
                method="POST"
              >
                <input
                  type="hidden"
                  name="access_key"
                  value="1601eeac-004d-42c3-9f8f-f42048fd9298"
                />
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    name="name"
                    id="name"
                    type="text"
                    placeholder="Enter your name..."
                    data-sb-validations="required"
                  />
                  <label htmlFor="name">Full name</label>
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="name:required"
                  >
                    A name is required.
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    data-sb-validations="required,email"
                  />
                  <label htmlFor="email">Email address</label>
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="email:required"
                  >
                    An email is required.
                  </div>
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="email:email"
                  >
                    Email is not valid.
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    data-sb-validations="required"
                  />
                  <label htmlFor="phone">Phone number</label>
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="phone:required"
                  >
                    A phone number is required.
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    placeholder="Enter your message here..."
                    style={{ height: "10rem" }}
                    data-sb-validations="required"
                  ></textarea>
                  <label htmlFor="message">Message</label>
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="message:required"
                  >
                    A message is required.
                  </div>
                </div>
                <div className="d-none" id="submitSuccessMessage">
                  <div className="text-center mb-3">
                    <div className="fw-bolder">Form submission successful!</div>
                    <br />
                  </div>
                </div>
                <div className="d-none" id="submitErrorMessage">
                  <div className="text-center text-danger mb-3">
                    Error sending message!
                  </div>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary rounded-pill btn-lg "
                    id="submitButton"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
