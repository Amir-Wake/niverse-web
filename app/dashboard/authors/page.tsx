"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, 
  FaUser, 
  FaTrash, 
  FaPlus, 
  FaSearch,
  FaUserTie
} from "react-icons/fa";

interface Author {
  id: string;
  name: string;
  image: string;
}

function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    filterAuthors(searchTerm);
  }, [searchTerm, allAuthors]);

  const fetchAuthors = (): void => {
    setLoading(true);
    fetch(`/api/authors`)
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
        setAllAuthors(data);
      })
      .catch((error) => {
        console.error("Error fetching authors", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const filterAuthors = (search: string): void => {
    if (!search.trim()) {
      setAuthors(allAuthors);
    } else {
      const filteredAuthors = allAuthors.filter((author) =>
        author.name.toLowerCase().includes(search.toLowerCase())
      );
      setAuthors(filteredAuthors);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
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

  const handleDelete = async (authorId: string, authorName: string) => {
    if (window.confirm(`Are you sure you want to delete "${authorName}"? This action cannot be undone.`)) {
      fetch(`/api/authors?id=${authorId}`, {
        method: "DELETE",
      })
        .then(() => {
          setAuthors(authors.filter((author) => author.id !== authorId));
          setAllAuthors(allAuthors.filter((author) => author.id !== authorId));
        })
        .catch((error) => {
          console.error("Error deleting author", error);
          alert("Error deleting author. Please try again.");
        });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Authors Management - Nverse Dashboard</title>
      
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
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaUserTie className="mr-3 text-purple-600" />
                Authors Management
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/authors/add"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Author
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Authors</h2>
            <span className="text-sm text-gray-500">
              {authors.length} of {allAuthors.length} authors
            </span>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search authors by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Authors Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">All Authors</h2>
            <Link
              href="/dashboard/authors/add"
              className="text-purple-600 hover:text-purple-700 flex items-center text-sm"
            >
              <FaPlus className="mr-1" />
              Add New
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading authors...</span>
            </div>
          ) : authors.length === 0 ? (
            <div className="text-center py-12">
              <FaUserTie className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No authors found" : "No authors available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first author"}
              </p>
              {!searchTerm && (
                <Link
                  href="/dashboard/authors/add"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add First Author
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="text-center">
                    <div className="relative mb-4">
                      <img
                        src={author.image}
                        alt={author.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=7c3aed&color=fff`;
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {author.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      <FaUser className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-500">Author</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleDelete(author.id, author.name)}
                        className="w-full flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authors...</p>
        </div>
      </div>
    }>
      <Authors />
    </Suspense>
  );
}
