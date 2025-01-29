"use client";
import { Card, Button, Form } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { generateSequence } from "@/app/dashboard/utils/hash";

interface Book {
  title: string;
  author: string;
  shortDescription: string;
  longDescription: string;
  printLength: string;
  ageRate: string;
  language: string;
  translator: string;
  publisher: string;
  publicationDate: string;
  coverImageUrl: string;
  genre: string | string[];
  fileUrl: string;
}
interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

interface UpdatedBookData extends Book {
  coverImageUrl: string;
  fileUrl: string;
  genre: string | string[];
}
interface HandleChangeEvent
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {
  target:
    | HTMLInputElement
    | (HTMLTextAreaElement & { name: string; value: string });
}

export default function Update() {
  const [book, setBook] = useState<Book | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const storage = getStorage();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const collectionName = useSearchParams().get("collection");
  const Id = useSearchParams().get("id");
  const sessionStorageUser = sessionStorage.getItem("user");

  useEffect(() => {
    if (!user && !sessionStorageUser) {
      router.push("/login");
    } else {
      fetchBooks();
    }
  }, [user, router]);

  const fetchBooks = (): void => {
    fetch(`/api/books?collection=${collectionName}&id=${Id}`)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent): void => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!book) {
      console.error("Book data is not available");
      return;
    }
    let coverImageUrl = book.coverImageUrl;
    let fileUrl = book.fileUrl;
    const fileSequence = generateSequence(book.title);

    if (coverImage) {
      const fileExtension = coverImage.name.split(".").pop();
      const storageRef = ref(
        storage,
        `books/${book.title}/cover.${fileExtension}`
      );
      await uploadBytes(storageRef, coverImage);
      coverImageUrl = await getDownloadURL(storageRef);
    }

    if (file) {
      const fileExtension = file.name.split(".").pop();
      const storageRef = ref(
        storage,
        `books/${book.title}/${fileSequence}.${fileExtension}`
      );
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }

    const updatedBookData: UpdatedBookData = {
      ...book,
      coverImageUrl,
      fileUrl,
      genre:
        typeof book.genre === "string" && book.genre.length > 0
          ? book.genre.split(",").map((g) => g.trim().toLowerCase())
          : book.genre,
    };

    const token = await auth.currentUser?.getIdToken();

    fetch(`/api/books?id=${Id}&collection=${collectionName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBookData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update book");
        }
        return response.json();
      })
      .then(() => {
        router.push(
          "/dashboard/collections/books?collection=" + collectionName
        );
      })
      .catch((error) => {
        console.error("Error updating book", error);
      });
  };

  const handleChange = (e: HandleChangeEvent): void => {
    const { name, value } = e.target;
    setBook((prevBook) => {
      if (!prevBook) return prevBook;
      return {
        ...prevBook,
        [name]: value,
      };
    });
  };

  const handleBack = () => {
    router.push("/dashboard/collections/books?collection=" + collectionName);
  };

  if(!user) return null;

  return (
    <>
      <div className="text-center d-flex justify-content-between">
        <Button className="m-3 btn btn-secondary" onClick={handleBack}>
          &#x25c0; {collectionName}
        </Button>
        <Button
          className=" m-3 "
          style={{
            backgroundColor: "red",
            borderColor: "red",
            marginLeft: "20px",
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      <br />
      <h2 className="text-center mb-4">Update Book</h2>
      <Card>
        <Card.Body>
          {book && (
            <Form onSubmit={handleSubmit}>
              <Form.Group id="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="author">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={book.author}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="coverImage" className="mt-3">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  style={{ width: 200, height: 300 }}
                />
              </Form.Group>
              <Form.Group id="file" className="mt-3">
                <Form.Label>File</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <Form.Group id="shortDescription" className="mt-3">
                <Form.Label>Short Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="shortDescription"
                  value={book.shortDescription}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="longDescription">
                <Form.Label>Long Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="longDescription"
                  value={book.longDescription}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="genre">
                <Form.Label>Genre (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={book.genre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="printLength">
                <Form.Label>Print Length</Form.Label>
                <Form.Control
                  type="text"
                  name="printLength"
                  value={book.printLength}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="ageRate">
                <Form.Label>Age Rating</Form.Label>
                <Form.Control
                  type="text"
                  name="ageRate"
                  value={book.ageRate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="language">
                <Form.Label>Language</Form.Label>
                <Form.Control
                  type="text"
                  name="language"
                  value={book.language}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="publisher">
                <Form.Label>Publisher</Form.Label>
                <Form.Control
                  type="text"
                  name="publisher"
                  value={book.publisher}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id="translator">
                <Form.Label>Translator</Form.Label>
                <Form.Control
                  type="text"
                  name="translator"
                  value={book.translator}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group id="publicationDate">
                <Form.Label>Publication Date</Form.Label>
                <Form.Control
                  type="date"
                  name="publicationDate"
                  value={book.publicationDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <div className="text-center">
                <Button className="w-25 mt-3" type="submit">
                  Update Book
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
      <br />
      <br />
    </>
  );
}
