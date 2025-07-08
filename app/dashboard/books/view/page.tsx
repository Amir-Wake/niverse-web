"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { 
  FaArrowLeft, 
  FaBook, 
  FaUser, 
  FaCalendar, 
  FaLanguage, 
  FaDownload, 
  FaHeart,
  FaEdit,
  FaTrash,
  FaTags,
  FaBuilding,
  FaFileAlt
} from "react-icons/fa";

interface Book {
  collection: string;
  title: string;
  author: string;
  coverImageUrl: string;
  shortDescription: string;
  longDescription: string;
  genre: string[];
  printLength: string;
  language: string;
  translator: string;
  publisher: string;
  publicationDate: string;
  createdDate: string;
  downloadedNumber: number;
  wantToReadNumber: number;
  id: string;
}

function View() {
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const Id = useSearchParams()?.get("id") ?? "";
  let userSession: string | null = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      userSession = sessionStorage.getItem("user");
    }

    if (!user && !userSession) {
      router.push("/login");
    } else {
      fetchBooks();
    }
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

  const handleBack = () => {
    router.push("/dashboard/books");
  };

  const handleEdit = () => {
    router.push(`/dashboard/books/update?id=${Id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      const token = await auth.currentUser?.getIdToken();
      fetch(`/api/books?id=${Id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          router.push("/dashboard/books");
        })
        .catch((error) => {
          console.error("Error deleting book", error);
        });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Book Details - Nverse Dashboard</title>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Books
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaBook className="mr-3 text-blue-600" />
                Book Details
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {book && (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <FaEdit className="mr-2" />
                    Edit Book
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={handleSignOut}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {book ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="aspect-[3/4] relative mb-6">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <FaDownload className="mx-auto text-blue-600 text-2xl mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{book.downloadedNumber || 0}</div>
                    <div className="text-sm text-blue-600">Downloads</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <FaHeart className="mx-auto text-red-600 text-2xl mb-2" />
                    <div className="text-2xl font-bold text-red-900">{book.wantToReadNumber || 0}</div>
                    <div className="text-sm text-red-600">Want to Read</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h2>
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <FaUser className="mr-2" />
                  by {book.author}
                </div>
                
                {/* Metadata Grid */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaTags className="mr-3 mt-1 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">Genre</div>
                        <div className="text-gray-600">{book.genre?.join(", ") || "Not specified"}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaLanguage className="mr-3 mt-1 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">Language</div>
                        <div className="text-gray-600">{book.language}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaFileAlt className="mr-3 mt-1 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">Pages</div>
                        <div className="text-gray-600">{book.printLength}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaBuilding className="mr-3 mt-1 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">Publisher</div>
                        <div className="text-gray-600">{book.publisher || "Not specified"}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaCalendar className="mr-3 mt-1 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">Publication Date</div>
                        <div className="text-gray-600">{book.publicationDate}</div>
                      </div>
                    </div>
                    {book.translator && (
                      <div className="flex items-start">
                        <FaLanguage className="mr-3 mt-1 text-gray-400" />
                        <div>
                          <div className="font-semibold text-gray-900">Translator</div>
                          <div className="text-gray-600">{book.translator}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Short Description</h4>
                    <p className="text-gray-600 leading-relaxed">{book.shortDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Full Description</h4>
                    <p className="text-gray-600 leading-relaxed">{book.longDescription}</p>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">System Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-900">Book ID:</span>
                      <span className="ml-2 text-gray-600 font-mono text-sm">{book.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Collection:</span>
                      <span className="ml-2 text-gray-600">{book.collection}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-900">Created Date:</span>
                      <span className="ml-2 text-gray-600">{book.createdDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <View />
    </Suspense>
  );
}
