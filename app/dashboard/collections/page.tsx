"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { FaFolder } from "react-icons/fa";

export default function Collections() {
  const [collections, setCollections] = useState<string[]>([]);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const sessionStorageUser = sessionStorage.getItem("user");

  useEffect(() => {
    if (!user && !sessionStorageUser) {
      router.push("/login");
    }
  }, [user, router]);

  const handleSignOut = () => {
    signOut(auth);
    sessionStorage.removeItem("user");
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
      });
  }, []);
  if (!user) {
    return null;
  }
  return (
    <>
      <div className="flex justify-between items-center text-center p-3 mb-20">
        <button
          className=" py-2 px-4 rounded text-xl"
          onClick={handleBack}
        >
          &#x25c0; Dashboard
        </button>
        <h2 className="text-center font-semibold text-2xl p-2 ">
            Collections
          </h2>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded text-xl"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
      <br />
      <div className="flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <ul>
            {collections.map((collection, index) => (
              <div key={index} className="flex items-center mt-3">
                <button
                  className="w-full text-black mt-3 flex items-center justify-center rounded-md border border-gray-600 text-2xl p-6"
                  onClick={() =>
                    router.push(
                      `/dashboard/collections/books?collection=${collection}`
                    )
                  }
                >
                  <FaFolder size={48} className="mr-3" />
                  {collection}
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <br />
      <br />
    </>
  );
}
