"use client";
import { Button } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  image: string;
}

function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;

    if (!user && !userSession) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = (): void => {
    fetch(`/api/authors`)
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
      })
      .catch((error) => {
        console.error("Error fetching books", error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("user");
        router.push("/login");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  const handleBack = () => {
    router.push("/dashboard");
  };


  const handleDelete = async (authorId: string) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      fetch(`/api/authors?id=${authorId}`, {
        method: "DELETE",
      })
        .then(() => {
          setAuthors(authors.filter((author) => author.id !== authorId));
        })
        .catch((error) => {
          console.error("Error deleting book", error);
        });
    }
  };

  if (!user) return null;

  return (
    <>
      <title>dashboard</title>
      <div className="flex justify-between items-center p-3 border-b-2 mb-10">
        <div className="w-1/4">
          <button className="p-2 text-2xl" onClick={handleBack}>
            &lt; Back
          </button>
        </div>
        <div className="w-2/4">
          <h2 className="text-center font-bold text-2xl">Authors</h2>
        </div>
        <div className="w-1/4 text-right">
          <button
            className="bg-red-500 text-white p-1 text-l rounded"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <br />
      <div className="p-4 border rounded shadow-md">
        <div className="w-1/2 mx-auto">
          <ul className="list-none p-0">
            {authors.map((author, index) => (
              <li
                key={`${author.id}-${index}`}
                className="mb-2 p-2 border border-gray-300 flex-row flex items-center justify-between rounded-md hover:bg-gray-100 transition-colors"
              >
                <div
                  className="no-underline text-lg"
                >
                    <img
                        src={author.image}
                        alt={author.name}
                        className="w-16 h-16 rounded-full mx-2 inline-block"
                    />
                  {author.name}
                </div>
                <div className="mt-1">
                  <Button
                    variant="none"
                    size="sm"
                    
                    onClick={() => handleDelete(author.id)}
                    className="mr-2 bg-red-500 p-1 rounded"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
            <div className="mt-4 text-center bg-blue-400 p-2 rounded">
                <Link href="/dashboard/authors/add">
                <Button variant="primary">Add Author</Button>
                </Link>
            </div>
        </div>
      </div>
      <br />
      <br />
    </>
  );
}

export default function AuthorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Authors />
    </Suspense>
  );
}
