"use client";
import { Button, Form } from "react-bootstrap";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { generateSequence } from "@/app/dashboard/utils/hash";
import { 
  FaArrowLeft, 
  FaBook, 
  FaUser, 
  FaImage, 
  FaFileAlt, 
  FaSave,
  FaCalendar,
  FaTags,
  FaBuilding
} from "react-icons/fa";

interface Book {
  collection: string;
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
  coverDominantColor: string;
  genre: string | string[];
  fileUrl: string;
  gdRatingAverage: number;
  gdRatingCount: string;
  version: number;
  createdDate: string;
}

interface UpdatedBookData extends Book {
  coverImageUrl: string;
  fileUrl: string;
  genre: string | string[];
}

interface HandleChangeEvent
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {
  target:
    | HTMLInputElement
    | (HTMLTextAreaElement & { name: string; value: string | number });
}

function Update() {
  const [book, setBook] = useState<Book | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const storage = getStorage();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const Id = useSearchParams()?.get("id") ?? "";
  let userSession: string | null = null;
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      userSession = sessionStorage.getItem("user");
    }

    if (!user && !userSession) {
      router.push("/login");
    }
    fetchBooks();
  }, [user, router]);

  const fetchBooks = (): void => {
    fetch(`/api/books?id=${Id}`)
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!book) {
      console.error("Book data is not available");
      return;
    }
    
    setLoading(true);
    setUploadProgress(true);
    
    try {
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

      const response = await fetch(`/api/books?id=${Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBookData),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      router.push("/dashboard/books");
    } catch (error) {
      console.error("Error updating book", error);
      alert("Error updating book. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(false);
    }
  };

  const handleChange = (e: HandleChangeEvent): void => {
    const { name, value } = e.target;
    setBook((prevBook) => {
      if (!prevBook) return prevBook;
      
      let convertedValue: string|number = value;
      
      // Convert numeric fields to proper types
      if (name === 'gdRatingAverage') {
        convertedValue = value === '' ? 0 : parseFloat(value) || 0;
      } else if (name === 'version') {
        convertedValue = value === '' ? 0 : parseInt(value, 10) || 0;
      }
      
      return {
        ...prevBook,
        [name]: convertedValue,
      };
    });
  };

  const handleBack = () => {
    router.push("/dashboard/books");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Update Book - Nverse Dashboard</title>
      
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
                Back to Books
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaBook className="mr-3 text-blue-600" />
                Update Book
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
        {book ? (
          <div className="max-w-4xl mx-auto">
            <Form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cover Image Section */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaImage className="mr-2 text-blue-600" />
                      Book Cover
                    </h3>
                    <div className="space-y-4">
                      <div className="aspect-[3/4] relative">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Cover Image
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Dominant Color
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="coverDominantColor"
                          value={book.coverDominantColor}
                          onChange={handleChange}
                          placeholder="#000000"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
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
                      <FaBook className="mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Collection
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="collection"
                          value={book.collection}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="language"
                          value={book.language}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                    </div>
                    <div className="mt-6">
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={book.title}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Author Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <FaUser className="mr-2 text-blue-600" />
                      Author Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Author
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="author"
                          value={book.author}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Translator
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="translator"
                          value={book.translator}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
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
                          name="shortDescription"
                          value={book.shortDescription}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Long Description
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="longDescription"
                          value={book.longDescription}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Form.Group>
                          <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                            Genre (comma separated)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="genre"
                            value={book.genre}
                            onChange={handleChange}
                            placeholder="fiction, drama, romance"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                            Age Rating
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="ageRate"
                            value={book.ageRate}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  {/* Publishing Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <FaBuilding className="mr-2 text-blue-600" />
                      Publishing Information
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Publisher
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="publisher"
                          value={book.publisher}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Publication Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="publicationDate"
                          value={book.publicationDate}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Print Length
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="printLength"
                          value={book.printLength}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Goodreads Rating */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <FaTags className="mr-2 text-blue-600" />
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
                          name="gdRatingAverage"
                          value={book.gdRatingAverage||0}
                          onChange={handleChange}
                          placeholder="4.25"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating Count
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="gdRatingCount"
                          value={book.gdRatingCount||"0"}
                          onChange={handleChange}
                          placeholder="1,234"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Version & Date Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <FaCalendar className="mr-2 text-blue-600" />
                      Version & Date Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Version
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          step="1"
                          name="version"
                          value={book.version||0}
                          onChange={handleChange}
                          placeholder="1"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                          Created Date
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="createdDate"
                          value={book.createdDate ? new Date(book.createdDate).toISOString().slice(0, 16) : ''}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
                      Book File
                    </h3>
                    <Form.Group>
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Book File (EPUB)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".epub"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Leave empty to keep current file
                      </p>
                    </Form.Group>
                  </div>

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
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors disabled:opacity-50 border-0"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {uploadProgress ? 'Uploading...' : 'Updating...'}
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Update Book
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading book details...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UpdatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <Update />
    </Suspense>
  );
}
