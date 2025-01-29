"use client";
import { Card, Button } from "react-bootstrap";
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
      <div className="text-center d-flex justify-content-between">
        <Button className="m-3 btn btn-secondary" onClick={handleBack}>
          &#x25c0; Dashboard
        </Button>
        <Button
          className="m-3 "
          style={{
            backgroundColor: "red",
            borderColor: "red",
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      <br />
      <h2 className="text-center">Collections</h2>
      <Card>
        <Card.Body className="justify-content-center max-w-50 mx-auto">
          <ul>
            {collections.map((collection, index) => (
              <div key={index} className="d-flex align-items-center mt-3">
                <Button
                  className="w-100 d-flex align-items-center"
                  style={{
                    fontSize: "1.5rem",
                    padding: "1rem",
                  }}
                  onClick={() =>
                    router.push(
                      `/dashboard/collections/books?collection=${collection}`
                    )
                  }
                >
                  <FaFolder size={48} className="me-3" />
                  {collection}
                </Button>
              </div>
            ))}
          </ul>
        </Card.Body>
      </Card>
      <br />
      <br />
    </>
  );
}
