"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { 
  FaArrowLeft, 
  FaChartBar, 
  FaBell, 
  FaEnvelope, 
  FaMobile, 
  FaUserShield,
  FaUsers,
  FaEye,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

interface UserStats {
  userId: string;
  email: string;
  pushNotificationsEnabled: boolean;
  expoPushToken: string | null;
  emailNotificationsEnabled: boolean;
}

export default function UsersAnalytics() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [usersData, setUsersData] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
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
      const token = await auth.currentUser?.getIdToken();
      
      const response = await fetch('/api/usersStats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data: UserStats[] = await response.json();
        setUsersData(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch users analytics data:', errorData);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      alert('Error fetching analytics data');
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
  };

  if (!user) return null;

  const UserCard = ({ user, index }: { 
    user: UserStats; 
    index: number;
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="text-2xl font-bold text-blue-600 w-8 text-center">
            #{index + 1}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 truncate">{user.email}</h4>
          <p className="text-gray-600 text-sm">User ID: {user.userId.slice(0, 8)}...</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              {user.pushNotificationsEnabled ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FaCheckCircle className="mr-1" />
                  Push Enabled
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <FaTimesCircle className="mr-1" />
                  Push Disabled
                </span>
              )}
              {user.emailNotificationsEnabled ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FaEnvelope className="mr-1" />
                  Email Enabled
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <FaEnvelope className="mr-1" />
                  Email Disabled
                </span>
              )}
              {user.expoPushToken ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <FaMobile className="mr-1" />
                  Has Token
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <FaMobile className="mr-1" />
                  No Token
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Users Analytics - Nverse Dashboard</title>
      
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
                <FaUsers className="mr-3 text-blue-600" />
                Users Analytics & Reports
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
              <p className="text-gray-600">Loading users analytics data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">{usersData.length.toLocaleString()}</p>
                  </div>
                  <FaUsers className="text-blue-500 text-3xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Push Notifications Enabled</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {usersData.filter(user => user.pushNotificationsEnabled).length.toLocaleString()}
                    </p>
                  </div>
                  <FaBell className="text-green-500 text-3xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Email Notifications Enabled</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {usersData.filter(user => user.emailNotificationsEnabled).length.toLocaleString()}
                    </p>
                  </div>
                  <FaEnvelope className="text-purple-500 text-3xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Users with Push Tokens</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {usersData.filter(user => user.expoPushToken && user.expoPushToken.trim() !== '').length.toLocaleString()}
                    </p>
                  </div>
                  <FaMobile className="text-orange-500 text-3xl" />
                </div>
              </div>
            </div>

            {/* All Users List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-white text-lg font-semibold flex items-center">
                  <FaUsers className="mr-2" />
                  All Users ({usersData.length})
                </h3>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {usersData.length > 0 ? (
                  usersData.map((user, index) => (
                    <UserCard
                      key={`user-${user.userId}-${index}`}
                      user={user}
                      index={index}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No users found</p>
                )}
              </div>
            </div>

            {/* Notification Settings Overview */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="mr-2 text-blue-500" />
                Notification Settings Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaCheckCircle className="mx-auto text-3xl text-green-500 mb-2" />
                  <p className="text-sm text-gray-600">Both Enabled</p>
                  <p className="text-xl font-bold text-gray-800">
                    {usersData.filter(user => user.pushNotificationsEnabled && user.emailNotificationsEnabled).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaBell className="mx-auto text-3xl text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600">Push Only</p>
                  <p className="text-xl font-bold text-gray-800">
                    {usersData.filter(user => user.pushNotificationsEnabled && !user.emailNotificationsEnabled).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="mx-auto text-3xl text-purple-500 mb-2" />
                  <p className="text-sm text-gray-600">Email Only</p>
                  <p className="text-xl font-bold text-gray-800">
                    {usersData.filter(user => !user.pushNotificationsEnabled && user.emailNotificationsEnabled).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaTimesCircle className="mx-auto text-3xl text-red-500 mb-2" />
                  <p className="text-sm text-gray-600">Both Disabled</p>
                  <p className="text-xl font-bold text-gray-800">
                    {usersData.filter(user => !user.pushNotificationsEnabled && !user.emailNotificationsEnabled).length}
                  </p>
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
                  onClick={() => router.push("/dashboard/analytics")}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                >
                  <FaChartBar className="mr-2" /> Books Analytics
                </button>
                <button
                  onClick={() => handleUpdateUsersStats()}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                >
                  <FaUsers className="mr-2" /> Update User Stats
                </button>
                <button
                  onClick={() => router.push("/dashboard/books")}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center py-3 rounded-lg transition-colors"
                >
                  <FaUsers className="mr-2" /> Manage Books
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