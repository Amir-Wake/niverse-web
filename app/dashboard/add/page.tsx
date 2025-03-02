"use client";
import { Button, Form, ProgressBar } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import React, { Suspense, useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { generateSequence } from "@/app/dashboard/utils/hash";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

function Add() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [printLength, setPrintLength] = useState("");
  const [language, setLanguage] = useState("");
  const [ageRate, setAgeRate] = useState("");
  const [publisher, setPublisher] = useState("");
  const [translator, setTranslator] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [genre, setGenre] = useState("");
  const [collection, setCollection] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const storage = getStorage();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleEpubChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setEpubFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let coverImageUrl = "";
    let fileUrl = "";

    const fileSequence = generateSequence(title);

    if (coverImage) {
      const fileExtension = coverImage.name.split(".").pop();
      const storageRef = ref(storage, `books/${title}/cover.${fileExtension}`);
      const uploadTask = uploadBytesResumable(storageRef, coverImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error", error);
        },
        async () => {
          coverImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        }
      );

      await uploadTask.then(async () => {
        coverImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      });
    }

    if (epubFile) {
      const fileExtension = epubFile.name.split(".").pop();
      const storageRef = ref(
        storage,
        `books/${title}/${fileSequence}.${fileExtension}`
      );
      const uploadTask = uploadBytesResumable(storageRef, epubFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error", error);
        },
        async () => {
          fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
        }
      );

      await uploadTask.then(async () => {
        fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
      });
    }

    const genreArray = genre.split(",").map((g) => g.trim().toLowerCase());

    const bookData = {
      collection,
      title,
      author,
      shortDescription,
      longDescription,
      printLength,
      language,
      publisher,
      translator,
      ageRate,
      publicationDate,
      coverImageUrl,
      fileUrl,
      genre: genreArray,
      createdDate: new Date().toISOString(),
    };

    const token = await auth.currentUser?.getIdToken();

    fetch(`/api/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add book");
        }
        return response.json();
      })
      .then(() => {
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error adding book", error);
      });
  };

  if (!user) return null;

  return (
    <>
      <title>dashboard</title>
      <div className="flex justify-between items-center p-3 border-b-2 mb-10">
        <div className="w-1/4">
          <button className=" p-2 text-2xl" onClick={handleBack}>
            &lt; Back
          </button>
        </div>
        <div className="w-2/4">
          <h2 className="text-center font-bold text-2xl">Add</h2>
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
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <Form
              onSubmit={handleSubmit}
              className="space-y-4 bg-white text-black p-3"
            >
              <Form.Group id="collection">
                <Form.Label>Collection</Form.Label>
                <Form.Control
                  type="text"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="author">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="shortDescription" className="mt-3">
                <Form.Label>Short Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="longDescription" className="mt-3">
                <Form.Label>Long Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="genre" className="mt-3">
                <Form.Label>Genre (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="printLength" className="mt-3">
                <Form.Label>Print Length</Form.Label>
                <Form.Control
                  type="text"
                  value={printLength}
                  onChange={(e) => setPrintLength(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="ageRate" className="mt-3">
                <Form.Label>Age Rating</Form.Label>
                <Form.Control
                  type="text"
                  value={ageRate}
                  onChange={(e) => setAgeRate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="language" className="mt-3">
                <Form.Label>Language</Form.Label>
                <Form.Control
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="publisher" className="mt-3">
                <Form.Label>Publisher</Form.Label>
                <Form.Control
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="translator" className="mt-3">
                <Form.Label>Translator</Form.Label>
                <Form.Control
                  type="text"
                  value={translator}
                  onChange={(e) => setTranslator(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="publicationDate" className="mt-3">
                <Form.Label>Publication Date</Form.Label>
                <Form.Control
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="coverImage" className="mt-3">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control
                  required
                  type="file"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <Form.Group id="epubFile" className="mt-3">
                <Form.Label>File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleEpubChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </Form.Group>
              <div className="text-center mt-4">
                <Button
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  type="submit"
                >
                  Add Book
                  {uploadProgress > 0 && (
                    <ProgressBar
                      now={uploadProgress}
                      label={`${Math.round(uploadProgress)}%`}
                      className="m-3"
                    />
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <br />
      <br />
    </>
  );
}

export default function AddPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Add />
    </Suspense>
  );
}
