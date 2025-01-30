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
    router.push("/dashboard/collections");
  };

  if (!user) {
    return null;
  }

  return (
    <>
    <title>dashboard</title>
      <div className="flex justify-end items-center text-center p-3 mb-20 border-b-2">
        <Button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      <h2 className="text-center mb-4 text-5xl p-2">Dashboard</h2>
      <div className="flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center">
            <Button
              className="w-full text-black mt-3 flex items-center justify-center rounded-md border border-gray-600 text-2xl p-6"
              onClick={handleMove}
            >
              <FaBook className="mr-2" /> Collections
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
