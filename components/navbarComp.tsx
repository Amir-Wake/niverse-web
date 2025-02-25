import React from "react";
import iconTr from "@/public/iconTr.png";
import Link from "next/link";

interface NavbarCompProps {
    isNavbarCollapsed: boolean;
    handleNavbarToggle: () => void;
    handleNavItemClick: () => void;
}

function NavbarComp({ isNavbarCollapsed, handleNavbarToggle, handleNavItemClick }: NavbarCompProps) {
    
    return (
        <nav className="navbar navbar-expand-lg fixed-top bg-white flex" style={{height:"80px"}} id="mainNav">
            <div className="container px-5 bg-white border-gray-400 border-b-2">
                <Link
                    className="navbar-brand fw-bold flex items-center"
                    href="/"
                    onClick={() => {
                        handleNavItemClick();
                    }}
                >
                    <img src={iconTr.src} alt="niverse Logo" className="h-16 mr-2" />
                    <h2 className="mt-3 text-red-500">Niverse</h2>
                </Link>
                <button
                    className="navbar-toggler border-red-500 border-2"
                    type="button"
                    onClick={handleNavbarToggle}
                    aria-controls="navbarResponsive"
                    aria-expanded={!isNavbarCollapsed}
                    aria-label="Toggle navigation"
                >
                    Menu &nbsp;
                    
                </button>
                <div className={` navbar-collapse ${isNavbarCollapsed ? "collapse" : "show"}`} id="navbarResponsive">
                    <ul className="navbar-nav ms-auto me-4 my-3 my-lg-0">
                    <li className="nav-item">
                            <Link className="nav-link me-lg-3 text-lg text-black" href="/" onClick={handleNavItemClick}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link me-lg-3 text-lg text-black" href="/books" onClick={handleNavItemClick}>
                                Books
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link me-lg-3 text-lg text-black" href="/about" onClick={handleNavItemClick}>
                                About
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavbarComp;
