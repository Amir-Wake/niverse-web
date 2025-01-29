"use client";
import { Card, Button, Form, ProgressBar } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { generateSequence } from "@/app/dashboard/utils/hash";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function Add() {
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

  useEffect(() => {
    if (!user) {
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
    let coverDominantColor = "";

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
      coverDominantColor,
      fileUrl,
      genre: genreArray,
      createdDate: new Date().toISOString(),
    };

    const token = await auth.currentUser?.getIdToken();

    fetch(`/api/add?collection=${collection}`, {
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
      <div className="text-center d-flex justify-content-between">
        <Button className="m-3 btn btn-secondary" onClick={handleBack}>
          &#x25c0; Books
        </Button>
        <Button
          className=" m-3 "
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
      <h2 className="text-center mb-4">Add Book</h2>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="collection">
              <Form.Label>Collection</Form.Label>
              <Form.Control
                type="text"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="author">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="shortDescription">
              <Form.Label>Short Description</Form.Label>
              <Form.Control
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="longDescription">
              <Form.Label>Long Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                required
              />
              <Form.Group id="genre">
                <Form.Label>Genre (separated by commas)</Form.Label>
                <Form.Control
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                />
              </Form.Group>
            </Form.Group>
            <Form.Group id="printLength">
              <Form.Label>Print Length</Form.Label>
              <Form.Control
                type="text"
                value={printLength}
                onChange={(e) => setPrintLength(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="ageRate">
              <Form.Label>Age Rating</Form.Label>
              <Form.Control
                type="text"
                value={ageRate}
                onChange={(e) => setAgeRate(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="language">
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="publisher">
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="translator">
              <Form.Label>Translator</Form.Label>
              <Form.Control
                type="text"
                value={translator}
                onChange={(e) => setTranslator(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="publicationDate">
              <Form.Label>Publication Date</Form.Label>
              <Form.Control
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="coverImage">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control required type="file" onChange={handleImageChange} />
            </Form.Group>
            <Form.Group id="epubFile">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" onChange={handleEpubChange} />
            </Form.Group>
            <div className="text-center">
              <Button className="w-25 mt-3" type="submit">
                Add Book
              </Button>
            </div>
          </Form>
          {uploadProgress > 0 && (
            <ProgressBar
              now={uploadProgress}
              label={`${Math.round(uploadProgress)}%`}
              className="mt-3"
            />
          )}
        </Card.Body>
      </Card>
      <br />
      <br />
    </>
  );
}
