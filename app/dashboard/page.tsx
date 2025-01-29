"use client"
import React, { useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useRouter } from 'next/navigation'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FaBook, FaPlus } from 'react-icons/fa';

export default function Main() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const userSession = sessionStorage.getItem("user");

    useEffect(() => {
        if (!user && !userSession) {
            router.push("/login");
        }
    }, [user, router]);

    const handleSignOut = () => {
        signOut(auth);
        sessionStorage.removeItem("user");
    };

    const handleAddBook = () => {
        router.push("/dashboard/add");
    };

    const handleMove = () => {
        router.push("/dashboard/collections");
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="text-end">
                <Button
                    className="m-3"
                    style={{
                        backgroundColor: "red",
                        borderColor: "red",
                        fontSize: "1.5rem",
                        padding: "0.75rem 1.5rem"
                    }}
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </div>
            <h2 className="text-center mb-4">Dashboard</h2>
            <Card>
                <Card.Body className="justify-content-center max-w-50 mx-auto">
                    <Button className="w-100 mt-3 d-flex align-items-center justify-content-center" onClick={handleMove} style={{ border: '1px solid #ccc', fontSize: "1.5rem", padding: "0.75rem 1.5rem" }}>
                        <FaBook className="me-2" /> Collections
                    </Button>
                    <Button className="w-100 mt-3 d-flex align-items-center justify-content-center" onClick={handleAddBook} style={{ border: '1px solid #ccc', fontSize: "1.5rem", padding: "0.75rem 1.5rem" }}>
                        <FaPlus className="me-2" /> Add a book
                    </Button>
                </Card.Body>
            </Card>
        </>
    );
}
