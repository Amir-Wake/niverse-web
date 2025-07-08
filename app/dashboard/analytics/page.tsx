"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { 
  FaArrowLeft, 
  FaChartBar, 
  FaDownload, 
  FaHeart, 
  FaStar, 
  FaBook, 
  FaUserShield,
  FaTrophy,
  FaEye
} from "react-icons/fa";

interface BookStats {
  id: string;
  title: string;
  author: string;
  downloadedNumber: number;
  wantToReadNumber: number;
  reviewCount: number;
}

export default function Analytics() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [booksData, setBooksData] = useState<BookStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [topDownloaded, setTopDownloaded] = useState<BookStats[]>([]);
  const [topWantToRead, setTopWantToRead] = useState<BookStats[]>([]);
  const [topRated, setTopRated] = useState<BookStats[]>([]);
  let userSession: string | null = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      userSession = sessionStorage.getItem("user");
    }

    if (!user && !userSession) {
      router.push("/login");
    } else {
      fetchAnalyticsData();
    }
  }, [user, router]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/booksStats');
      if (response.ok) {
        const data: BookStats[] = await response.json();
        setBooksData(data);
        
        // Sort and get top 10 for each category
        const sortedByDownloads = [...data].sort((a, b) => (b.downloadedNumber || 0) - (a.downloadedNumber || 0)).slice(0, 10);
        const sortedByWantToRead = [...data].sort((a, b) => (b.wantToReadNumber || 0) - (a.wantToReadNumber || 0)).slice(0, 10);
        const sortedByRating = [...data].sort((a, b) => {
          // Sort by review count only
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }).slice(0, 10);
        
        setTopDownloaded(sortedByDownloads);
        setTopWantToRead(sortedByWantToRead);
        setTopRated(sortedByRating);
      } else {
        console.error('Failed to fetch books analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  if (!user) return null;

  const BookCard = ({ book, rank, metric, value }: { 
    book: BookStats; 
    rank: number; 
    metric: string; 
    value: number 
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="text-2xl font-bold text-blue-600 w-8 text-center">
            #{rank}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h4>
          <p className="text-gray-600 text-sm truncate">{book.author}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm font-medium text-blue-600">
              {metric}: {value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Analytics - Nverse Dashboard</title>
      
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
                <FaChartBar className="mr-3 text-blue-600" />
                Analytics & Reports
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaUserShield className="inline mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Books</p>
                    <p className="text-2xl font-bold text-gray-800">{booksData.length.toLocaleString()}</p>
                  </div>
                  <FaBook className="text-blue-500 text-3xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Downloads</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {booksData.reduce((sum, book) => sum + (book.downloadedNumber || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <FaDownload className="text-green-500 text-3xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Want to Read</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {booksData.reduce((sum, book) => sum + (book.wantToReadNumber || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <FaHeart className="text-purple-500 text-3xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {booksData.reduce((sum, book) => sum + (book.reviewCount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <FaStar className="text-orange-500 text-3xl" />
                </div>
              </div>
            </div>

            {/* Top Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Top Downloaded Books */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                  <h3 className="text-white text-lg font-semibold flex items-center">
                    <FaDownload className="mr-2" />
                    Top Downloaded Books
                  </h3>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {topDownloaded.map((book, index) => (
                    <BookCard
                      key={`downloaded-${book.id}-${index}`}
                      book={book}
                      rank={index + 1}
                      metric="Downloads"
                      value={book.downloadedNumber || 0}
                    />
                  ))}
                </div>
              </div>

              {/* Top Want to Read Books */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                  <h3 className="text-white text-lg font-semibold flex items-center">
                    <FaHeart className="mr-2" />
                    Most Wanted Books
                  </h3>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {topWantToRead.map((book, index) => (
                    <BookCard
                      key={`wanttoread-${book.id}-${index}`}
                      book={book}
                      rank={index + 1}
                      metric="Want to Read"
                      value={book.wantToReadNumber || 0}
                    />
                  ))}
                </div>
              </div>

              {/* Top Rated Books */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                  <h3 className="text-white text-lg font-semibold flex items-center">
                    <FaTrophy className="mr-2" />
                    Most Reviewed Books
                  </h3>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {topRated.map((book, index) => (
                    <BookCard
                      key={`rated-${book.id}-${index}`}
                      book={book}
                      rank={index + 1}
                      metric="Reviews"
                      value={book.reviewCount || 0}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaEye className="mr-2 text-blue-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push("/dashboard/books")}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                >
                  <FaBook className="mr-2" /> Manage Books
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                >
                  <FaChartBar className="mr-2" /> Refresh Data
                </button>
                <button
                  onClick={() => router.push("/dashboard/add")}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                >
                  <FaBook className="mr-2" /> Add New Book
                </button>
                <button
                  onClick={handleBack}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                >
                  <FaArrowLeft className="mr-2" /> Back to Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}