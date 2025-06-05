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

function AddAuthor() {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
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
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
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

        fetch(`/api/authors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(authorData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add author");
                }
                return response.json();
            })
            .then(() => {
                router.push("/dashboard");
            })
            .catch((error) => {
                console.error("Error adding author", error);
            });
    };

    if (!user) return null;

    return (
        <>
            <title>dashboard</title>
            <div className="flex justify-between items-center p-3 border-b-2 mb-10">
                <div className="w-1/4">
                    <button className="p-2 text-2xl" onClick={handleBack}>
                        &lt; Back
                    </button>
                </div>
                <div className="w-2/4">
                    <h2 className="text-center font-bold text-2xl">Add Author</h2>
                </div>
                <div className="w-1/4 text-right">
                    <button
                        className="bg-red-500 text-white p-1 text-l rounded"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
            <br />
            <div className="container mx-auto">
                <div className="flex justify-center">
                    <div className="w-full max-w-lg">
                        <Form
                            onSubmit={handleSubmit}
                            className="space-y-4 bg-white text-black p-3"
                        >
                            <Form.Group id="name">
                                <Form.Label>Name*</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </Form.Group>
                            <Form.Group id="image" className="mt-3">
                                <Form.Label>Image*</Form.Label>
                                <Form.Control
                                    required
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </Form.Group>
                            <div className="text-center mt-4">
                                <Button
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                    type="submit"
                                >
                                    Add Author
                                    {uploadProgress > 0 && (
                                        <ProgressBar
                                            now={uploadProgress}
                                            label={`${Math.round(uploadProgress)}%`}
                                            className="m-3"
                                        />
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
            <br />
            <br />
        </>
    );
}

export default function AddAuthorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddAuthor />
        </Suspense>
    );
}
