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
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { 
  FaArrowLeft, 
  FaUserTie, 
  FaImage, 
  FaPlus,
  FaUpload
} from "react-icons/fa";

function AddAuthor() {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        router.push("/dashboard/authors");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let imageUrl = "";

            if (image) {
                const fileExtension = image.name.split(".").pop();
                const storageRef = ref(storage, `authors/${name}/image.${fileExtension}`);
                const uploadTask = uploadBytesResumable(storageRef, image);

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
                        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    }
                );

                await uploadTask.then(async () => {
                    imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                });
            }

            const authorData = {
                name,
                image: imageUrl,
                createdDate: new Date().toISOString(),
            };

            const token = await auth.currentUser?.getIdToken();

            const response = await fetch(`/api/authors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(authorData),
            });

            if (!response.ok) {
                throw new Error("Failed to add author");
            }

            router.push("/dashboard/authors");
        } catch (error) {
            console.error("Error adding author", error);
            alert("Error adding author. Please try again.");
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <title>Add Author - Nverse Dashboard</title>
            
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
                                Back to Authors
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <FaPlus className="mr-3 text-purple-600" />
                                Add New Author
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
                <div className="max-w-2xl mx-auto">
                    <Form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Author Image Section */}
                            <div className="md:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaImage className="mr-2 text-purple-600" />
                                        Author Photo
                                    </h3>
                                    <div className="space-y-4">
                                        {imagePreview ? (
                                            <div className="aspect-square relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Author preview"
                                                    className="w-full h-full object-cover rounded-full shadow-md border-4 border-purple-100"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-square bg-gray-100 rounded-full flex items-center justify-center">
                                                <div className="text-center text-gray-500">
                                                    <FaUserTie className="mx-auto text-4xl mb-2" />
                                                    <p className="text-sm">Upload photo</p>
                                                </div>
                                            </div>
                                        )}
                                        <Form.Group>
                                            <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Author Photo *
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                required
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Upload a clear photo of the author
                                            </p>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                        <FaUserTie className="mr-2 text-purple-600" />
                                        Author Information
                                    </h3>
                                    <Form.Group>
                                        <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Enter author's full name"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Enter the authors complete name as it should appear
                                        </p>
                                    </Form.Group>
                                </div>

                                {/* Upload Progress */}
                                {uploadProgress > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <FaUpload className="mr-2 text-purple-600" />
                                            Upload Progress
                                        </h3>
                                        <ProgressBar 
                                            now={uploadProgress} 
                                            label={`${Math.round(uploadProgress)}%`}
                                            className="mb-2"
                                        />
                                        <p className="text-sm text-gray-600">Uploading author photo...</p>
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
                                            disabled={loading || !name || !image}
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition-colors disabled:opacity-50 border-0"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Adding Author...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPlus className="mr-2" />
                                                    Add Author
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-500">
                                            * Required fields must be filled
                                        </p>
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

export default function AddAuthorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <AddAuthor />
        </Suspense>
    );
}
