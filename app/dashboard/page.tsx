"use client";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { 
  FaBook, 
  FaPlus, 
  FaChartBar, 
  FaEdit, 
  FaStar, 
  FaBell, 
  FaDownload, 
  FaHeart, 
  FaInfoCircle,
  FaUsers,
  FaCog,
  FaUserShield,
  FaMobile
} from "react-icons/fa";

     interface RemoteConfigDoc {
          docId?: string;
          content_update_date?: string;
          update_reviews?: string;
        }

        interface BookStats {
          downloadedNumber: number;
          wantToReadNumber: number;
          reviewCount: number;
        }

export default function Main() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [totalWantToRead, setTotalWantToRead] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [showVersions, setShowVersions] = useState(false);
  let userSession: string | null = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      userSession = sessionStorage.getItem("user");
    }

    if (!user && !userSession) {
      router.push("/login");
    } else {
      fetchBooksStats();
    }
  }, [user, router]);

  const fetchBooksStats = async () => {
    try {
      const response = await fetch('/api/booksStats');
      if (response.ok) {
        const booksData: BookStats[] = await response.json();
        
        // Calculate total downloads
        const totalDownloadCount = booksData.reduce((sum, book) => {
          return sum + (book.downloadedNumber || 0);
        }, 0);

        // Calculate total want to read
        const totalWantToReadCount = booksData.reduce((sum, book) => {
          return sum + (book.wantToReadNumber || 0);
        }, 0);

        // Calculate total reviews
        const totalReviewCount = booksData.reduce((sum, book) => {
          return sum + (book.reviewCount || 0);
        }, 0);
        
        setTotalDownloads(totalDownloadCount);
        setTotalBooks(booksData.length);
        setTotalWantToRead(totalWantToReadCount);
        setTotalReviews(totalReviewCount);
      } else {
        console.error('Failed to fetch books stats');
      }
    } catch (error) {
      console.error('Error fetching books stats:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = () => {
    signOut(auth);
    sessionStorage.removeItem("user");
  };

  const handleAddBook = () => {
    router.push("/dashboard/add");
  };

  const handleMove = () => {
    router.push("/dashboard/books");
  };

  const handleShowVersions = () => {
    setShowVersions(true);
  };

  const handleCloseVersions = () => {
    setShowVersions(false);
  };

  if (!user) {
    return null;
  }

  const handleUpdateApp = async () => {
    try {
      const response = await fetch('/api/remote_config');
      if (response.ok) {
        const data = await response.json();
        const configDoc: RemoteConfigDoc | undefined = (data as RemoteConfigDoc[]).find((doc: RemoteConfigDoc) => doc.content_update_date !== undefined);
        const currentDate = configDoc?.content_update_date || '0';
        
        const currentNumber = parseInt(currentDate) || 0;
        const newNumber = currentNumber + 1;
        
        const confirmUpdate = confirm(
          `Current content update date: ${currentDate}\n\nDo you want to update it to: ${newNumber}?`
        );
        
        if (confirmUpdate) {
          const token = await auth.currentUser?.getIdToken();
          const updateResponse = await fetch('/api/remote_config', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              content_update_date: newNumber.toString(),
              documentId: configDoc?.docId 
            }),
          });

          const updateResult = await updateResponse.json();
          
          if (updateResponse.ok) {
            alert(`App content update date updated successfully!\nNew value: ${newNumber}`);
          } else {
            console.error('Update failed:', updateResult);
            throw new Error(updateResult.error || 'Failed to update app');
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Fetch failed:', errorData);
        throw new Error(errorData.error || 'Failed to fetch current update date');
      }
    } catch (error) {
      console.error('Error updating app:', error);
      alert(`Error updating app: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

   const handleUpdateReviews = async () => {
    try {
      const response = await fetch('/api/remote_config');
      if (!response.ok) {
        throw new Error('Failed to fetch remote config');
      }
      
      const data = await response.json();
      const configDoc: RemoteConfigDoc | undefined = (data as RemoteConfigDoc[]).find((doc: RemoteConfigDoc) => doc.update_reviews);
      const api = configDoc?.update_reviews;
      
      if (!api) {
        throw new Error('Update reviews URL not found in remote config');
      }
      
      const confirmUpdate = confirm(
        "Do you want to update all book reviews and recalculate average ratings?\n\nThis will open the update service in a new tab."
      );
      
      if (confirmUpdate) {
        window.open(api, '_blank');
        alert("Update service opened in a new tab. Please check the tab for the update status.");
      }
    } catch (error) {
      console.error('Error opening update reviews:', error);
      alert(`Error opening update reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const handleUpdateBooksStats = async () => {
    try {
      const confirmUpdate = confirm(
        "Do you want to update all book statistics (downloads, want to read, reviews)?\n\nThis will open the update service in a new tab."
      );
      
      if (confirmUpdate) {
        window.open('https://createbookstats-udaeuh6qca-uc.a.run.app', '_blank');
        alert("Book stats update service opened in a new tab. Please check the tab for the update status.");
      }
    } catch (error) {
      console.error('Error opening update book stats:', error);
      alert(`Error opening update book stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const handleUpdateUsersStats = async () => {
    try {
      const confirmUpdate = confirm(
        "Do you want to update all user statistics (notifications, tokens)?\n\nThis will open the update service in a new tab."
      );
      
      if (confirmUpdate) {
        window.open('https://createusersstats-udaeuh6qca-uc.a.run.app', '_blank');
        alert("User stats update service opened in a new tab. Please check the tab for the update status.");
      }
    } catch (error) {
      console.error('Error opening update user stats:', error);
      alert(`Error opening update user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return (
    <>
      <title>Nverse Admin Dashboard</title>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Nverse Dashboard</h1>
              <p className="text-blue-100 mt-1">Welcome back, Admin</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">{currentTime.toLocaleDateString()}</p>
              <p className="text-xs text-blue-200">{currentTime.toLocaleTimeString()}</p>
              <button
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleSignOut}
              >
                <FaUserShield className="inline mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Books</p>
                  <p className="text-2xl font-bold text-gray-800">{totalBooks.toLocaleString()}</p>
                </div>
                <FaBook className="text-blue-500 text-3xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-800">{totalDownloads.toLocaleString()}</p>
                </div>
                <FaDownload className="text-green-500 text-3xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Want to Read</p>
                  <p className="text-2xl font-bold text-gray-800">{totalWantToRead.toLocaleString()}</p>
                </div>
                <FaUsers className="text-purple-500 text-3xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-800">{totalReviews.toLocaleString()}</p>
                </div>
                <FaStar className="text-orange-500 text-3xl" />
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Content Management */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-white text-lg font-semibold flex items-center">
                  <FaBook className="mr-2" />
                  Content Management
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <Button
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={handleMove}
                >
                  <FaBook className="mr-2" /> Manage Books
                </Button>
                <Button
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => router.push("/dashboard/authors")}
                >
                  <FaUsers className="mr-2" /> Manage Authors
                </Button>
                <Button
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={handleAddBook}
                >
                  <FaPlus className="mr-2" /> Add New Book
                </Button>
              </div>
            </div>

            {/* Analytics & Reports */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h3 className="text-white text-lg font-semibold flex items-center">
                  <FaChartBar className="mr-2" />
                  Analytics & Reports
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <Button
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => router.push("/dashboard/analytics")}
                >
                  <FaChartBar className="mr-2" /> Books Analytics
                </Button>
                <Button
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => router.push("/dashboard/usersAnalytics")}
                >
                  <FaUsers className="mr-2" /> Users Analytics
                </Button>
                <Button
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => {/* TODO: Add function */}}
                >
                  <FaDownload className="mr-2" /> Download Reports
                </Button>
                <Button
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => {/* TODO: Add function */}}
                >
                  <FaHeart className="mr-2" /> User Engagement
                </Button>
              </div>
            </div>

            {/* System Management */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                <h3 className="text-white text-lg font-semibold flex items-center">
                  <FaCog className="mr-2" />
                  System Management
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <Button
                  className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => {handleUpdateApp()}}
                >
                  <FaEdit className="mr-2" /> Update App
                </Button>
                <Button
                  className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => {handleUpdateReviews()}}
                >
                  <FaStar className="mr-2" /> Update Reviews
                </Button>
                <Button
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => {handleUpdateBooksStats()}}
                >
                  <FaChartBar className="mr-2" /> Update Book Stats
                </Button>
                <Button
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => {handleUpdateUsersStats()}}
                >
                  <FaUsers className="mr-2" /> Update User Stats
                </Button>
                <Button
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                  onClick={() => {/* TODO: Add function */}}
                >
                  <FaBell className="mr-2" /> Send Notifications
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Tools */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500" />
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                onClick={handleShowVersions}
              >
                <FaInfoCircle className="mr-2" /> App Versions
              </Button>
              <Button
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                onClick={() => router.push("/dashboard/settings")}
              >
                <FaCog className="mr-2" /> System Settings
              </Button>
              <Button
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                onClick={() => {/* TODO: Add function */}}
              >
                <FaUserShield className="mr-2" /> Admin Logs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* App Versions Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                App Versions
              </h3>
              <button
                onClick={handleCloseVersions}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaChartBar className="text-blue-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Web Dashboard</h4>
                </div>
                <p className="text-gray-600">Version: 1.2.0</p>
                <p className="text-gray-500 text-sm">Last Updated: 2024-01-15</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaMobile className="text-green-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Mobile App</h4>
                </div>
                <p className="text-gray-600">Version: 2.1.3</p>
                <p className="text-gray-500 text-sm">Last Updated: 2024-01-10</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaCog className="text-purple-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Server API</h4>
                </div>
                <p className="text-gray-600">Version: 1.2.1</p>
                <p className="text-gray-500 text-sm">Last Updated: 2024-01-12</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseVersions}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
