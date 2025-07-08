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
import {
  FaArrowLeft,
  FaBook,
  FaUser,
  FaImage,
  FaFileAlt,
  FaPlus,
  FaTags,
  FaBuilding,
  FaUpload,
} from "react-icons/fa";

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
  const [coverDominantColor, setCoverDominantColor] = useState("");
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [genre, setGenre] = useState("");
  const [collection, setCollection] = useState("");
  const [gdRatingAverage, setGdRatingAverage] = useState("");
  const [gdRatingCount, setGdRatingCount] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
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
      const file = e.target.files[0];
      setCoverImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
    setLoading(true);

    try {
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
        coverDominantColor,
        fileUrl,
        genre: genreArray,
        gdRatingAverage: gdRatingAverage ? parseFloat(gdRatingAverage) : 0,
        gdRatingCount: gdRatingCount || "0",
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
          router.push("/dashboard/books");
        })
        .catch((error) => {
          console.error("Error adding book", error);
          alert("Error adding book. Please try again.");
        })
        .finally(() => {
          setLoading(false);
          setUploadProgress(0);
        });
    } catch (error) {
      console.error("Error adding book", error);
      alert("Error adding book. Please try again.");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Add New Book - Nverse Dashboard</title>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                disabled={loading}
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaPlus className="mr-3 text-green-600" />
                Add New Book
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={loading}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cover Image Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaImage className="mr-2 text-green-600" />
                    Book Cover
                  </h3>
                  <div className="space-y-4">
                    {coverPreview ? (
                      <div className="aspect-[3/4] relative">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <FaImage className="mx-auto text-4xl mb-2" />
                          <p className="text-sm">Upload cover image</p>
                        </div>
                      </div>
                    )}
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image *
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Dominant Color
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={coverDominantColor}
                        onChange={(e) => setCoverDominantColor(e.target.value)}
                        placeholder="rgb(255, 255, 255)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FaBook className="mr-2 text-green-600" />
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Collection
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={collection}
                        onChange={(e) => setCollection(e.target.value)}
                        placeholder="e.g., books, novels"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Language *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                        placeholder="e.g., English, Kurdish"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                  </div>
                  <div className="mt-6">
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter book title"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Author Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FaUser className="mr-2 text-green-600" />
                    Author Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Author *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        placeholder="Author name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Translator
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={translator}
                        onChange={(e) => setTranslator(e.target.value)}
                        placeholder="Translator name (if applicable)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Content Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FaFileAlt className="mr-2 text-green-600" />
                    Content Details
                  </h3>
                  <div className="space-y-6">
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        placeholder="Brief description of the book..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Long Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        placeholder="Detailed description of the book..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Genre (comma separated)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          placeholder="fiction, drama, romance"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Age Rating *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={ageRate}
                          onChange={(e) => setAgeRate(e.target.value)}
                          required
                          placeholder="e.g., 13+, 18+"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>

                {/* Publishing Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FaBuilding className="mr-2 text-green-600" />
                    Publishing Information
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Publisher
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        placeholder="Publisher name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Publication Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={publicationDate}
                        onChange={(e) => setPublicationDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Print Length
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={printLength}
                        onChange={(e) => setPrintLength(e.target.value)}
                        placeholder="e.g., 250 pages"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Goodreads Rating */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FaTags className="mr-2 text-green-600" />
                    Goodreads Rating
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Average Rating
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        value={gdRatingAverage}
                        onChange={(e) => setGdRatingAverage(e.target.value)}
                        placeholder="4.25"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating Count
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={gdRatingCount}
                        onChange={(e) => setGdRatingCount(e.target.value)}
                        placeholder="1,234"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* File Upload */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FaUpload className="mr-2 text-green-600" />
                    Book File
                  </h3>
                  <Form.Group>
                    <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                      EPUB File
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".epub"
                      onChange={handleEpubChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload the book file in EPUB format
                    </p>
                  </Form.Group>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Upload Progress
                    </h3>
                    <ProgressBar
                      now={uploadProgress}
                      label={`${Math.round(uploadProgress)}%`}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-600">Uploading files...</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      disabled={loading || !title || !author}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-colors disabled:opacity-50 border-0"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding Book...
                        </>
                      ) : (
                        <>
                          <FaPlus className="mr-2" />
                          Add Book
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <Add />
    </Suspense>
  );
}
