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
    <div className="min-h-screen">
      <title>Nverse - Your Digital Reading Universe</title>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Discover Your
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
                    Reading Universe
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-200 max-w-2xl">
                  Immerse yourself in a world of endless stories. From bestsellers to hidden gems, 
                  find your next literary adventure in our digital library.
                </p>
              </div>
              
              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="https://apps.apple.com/app/nverse/id6742115218"
                  className="group transition-transform hover:scale-105"
                >
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-3 border border-white border-opacity-20">
                    <img
                      src={appStore.src}
                      alt="Download on App Store"
                      className="w-40 h-12 object-contain"
                    />
                  </div>
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.amir19225.ebookdv1"
                  className="group transition-transform hover:scale-105"
                >
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-3 border border-white border-opacity-20">
                    <img
                      src={googlePlay.src}
                      alt="Get it on Google Play"
                      className="w-40 h-12 object-contain"
                    />
                  </div>
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white">100+</h3>
                  <p className="text-gray-300">Free Books</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white">500+</h3>
                  <p className="text-gray-300">Happy Readers</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white">5★</h3>
                  <p className="text-gray-300">App Rating</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <img 
                src={bookTablet.src} 
                alt="Nverse App Demo" 
                className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Library, Everywhere You Go
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience seamless reading across all your devices with our beautifully designed app
            </p>
          </div>
          
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20"></div>
            </div>
            
            {/* Device showcase */}
            <div className="relative flex justify-center items-center space-x-8 overflow-hidden">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <img
                  src={iPad2.src}
                  alt="Reading Experience"
                  className="w-64 lg:w-80 drop-shadow-xl"
                />
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300 z-10">
                <img
                  src={iPad4.src}
                  alt="Library View"
                  className="w-72 lg:w-96 drop-shadow-2xl"
                />
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <img
                  src={iPad3.src}
                  alt="Book Details"
                  className="w-64 lg:w-80 drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className=" bg-white">
        <BooksPage />
      </section>

      {/* About Section */}
      <section className=" bg-gradient-to-b from-gray-50 to-white">
        <About />
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Your Reading Journey Today
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of readers who have already discovered their new favorite books
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="https://apps.apple.com/app/nverse/id6742115218"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors transform hover:scale-105"
            >
              Download for iOS
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.amir19225.ebookdv1"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-600 transition-colors transform hover:scale-105"
            >
              Download for Android
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Nverse</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Your gateway to endless stories and knowledge. Discover, read, and explore 
                the universe of books at your fingertips.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Books</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li>
                  <a href="/login" className="text-gray-400 hover:text-white transition-colors">
                    Admin Portal
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">© 2025 Nverse. All rights reserved.</p>
              <p className="text-gray-400 mt-4 md:mt-0">Made with ❤️ for book lovers</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
