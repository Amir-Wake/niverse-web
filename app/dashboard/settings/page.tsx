"use client";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { 
  FaCog, 
  FaArrowLeft, 
  FaSave,
  FaInfoCircle,
  FaMobile,
  FaEdit
} from "react-icons/fa";

export default function SystemSettings() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [minimumVersion, setMinimumVersion] = useState<string>("");
  const [contentUpdateDate, setContentUpdateDate] = useState<string>("");
  const [updateReviewsUrl, setUpdateReviewsUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    fetchSettings();
  }, [user, router]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/remote_config');
      if (response.ok) {
        const data = await response.json();
        const configDoc = data[0];
        
        setMinimumVersion(configDoc?.minimum_required_version || "");
        setContentUpdateDate(configDoc?.content_update_date || "");
        setUpdateReviewsUrl(configDoc?.update_reviews || "");
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Error fetching settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMinimumVersion = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/remote_config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minimum_required_version: minimumVersion
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Minimum required version updated successfully!');
      } else {
        throw new Error(result.details || result.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating minimum version:', error);
      alert('Error updating minimum version: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateContentDate = async () => {
    try {
      const currentNumber = parseInt(contentUpdateDate) || 0;
      const newNumber = currentNumber + 1;
      
      const confirmUpdate = confirm(
        `Current content update date: ${contentUpdateDate}\n\nDo you want to update it to: ${newNumber}?`
      );
      
      if (confirmUpdate) {
        setSaving(true);
        const token = await auth.currentUser?.getIdToken();
        
        const response = await fetch('/api/remote_config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            content_update_date: newNumber.toString()
          }),
        });

        const result = await response.json();
        
        if (response.ok) {
          setContentUpdateDate(newNumber.toString());
          alert(`Content update date updated successfully!\nNew value: ${newNumber}`);
        } else {
          throw new Error(result.details || result.error || 'Failed to update');
        }
      }
    } catch (error) {
      console.error('Error updating content date:', error);
      alert('Error updating content date: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <title>System Settings - Nverse Admin</title>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="mr-4 p-2 hover:bg-gray-500 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <FaCog className="mr-3" />
                  System Settings
                </h1>
                <p className="text-gray-200 mt-1">Manage application configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg text-gray-600">Loading settings...</div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* App Version Settings */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <h3 className="text-white text-lg font-semibold flex items-center">
                    <FaMobile className="mr-2" />
                    App Version Settings
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Minimum Required Version */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Required Version
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={minimumVersion}
                            onChange={(e) => setMinimumVersion(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 1.2.0"
                          />
                          <Button
                            onClick={handleSaveMinimumVersion}
                            disabled={saving || !minimumVersion.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <FaSave className="mr-2" />
                            {saving ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Users with app versions below this will be prompted to update
                        </p>
                      </div>
                    </div>

                    {/* Content Update Date */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content Update Date
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={contentUpdateDate}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                          <Button
                            onClick={handleUpdateContentDate}
                            disabled={saving}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <FaEdit className="mr-2" />
                            {saving ? 'Updating...' : 'Update'}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Forces app to refresh content when incremented
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service URLs */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                  <h3 className="text-white text-lg font-semibold flex items-center">
                    <FaInfoCircle className="mr-2" />
                    Service Configuration
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Reviews Service URL
                      </label>
                      <input
                        type="text"
                        value={updateReviewsUrl}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Cloud function URL for updating book reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Configuration Summary */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                  <h3 className="text-white text-lg font-semibold flex items-center">
                    <FaInfoCircle className="mr-2" />
                    Current Configuration
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-800">Min Version</h4>
                      <p className="text-2xl font-bold text-blue-900">{minimumVersion || 'Not set'}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-semibold text-orange-800">Content Update</h4>
                      <p className="text-2xl font-bold text-orange-900">{contentUpdateDate || '0'}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-800">Services</h4>
                      <p className="text-sm text-green-900">
                        {updateReviewsUrl ? 'Configured' : 'Not configured'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}