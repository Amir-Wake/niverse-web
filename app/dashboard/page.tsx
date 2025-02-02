"use client";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { FaBook, FaPlus } from "react-icons/fa";

export default function Main() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  let userSession: string | null = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      userSession = sessionStorage.getItem("user");
    }

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
    router.push("/dashboard/books");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <title>dashboard</title>
      <div className="flex justify-between items-center p-3 border-b-2 mb-10">
        <div className="w-2/4">
          <h2 className="text-center font-bold text-2xl">Dashboard</h2>
        </div>
        <div className="w-1/4 text-right">
          <button
            className="bg-red-500 text-white p-2 text-xl rounded"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <br />
      <div className="flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center">
            <Button
              className="w-full text-black mt-3 flex items-center justify-center rounded-md border border-gray-600 text-2xl p-6"
              onClick={handleMove}
            >
              <FaBook className="mr-2" /> Books
            </Button>
            <Button
              className="w-full mt-3 text-black flex items-center justify-center rounded-md border border-gray-600 text-2xl p-6"
              onClick={handleAddBook}
            >
              <FaPlus className="mr-2" /> Add a book
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
