"use client";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { auth, getUserRole } from "@/firebase/config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user);
        if (role === "admin") {
          sessionStorage.setItem("user", "true");
          router.push("/dashboard/");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const signin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRole(auth.currentUser);
      if (role !== "admin") {
        setError("Email or password is incorrect");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("user", "true");
      router.push("/dashboard/");
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/invalid-email" ||
        errorCode === "auth/user-disabled"
      ) {
        setError("Email or password is incorrect");
      } else {
        setError((error as { message: string }).message || "An unexpected error occurred");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-pink-500 rounded-full opacity-30 animate-ping"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Nverse
            </h1>
            <p className="text-gray-300 text-sm mt-2">Admin Portal</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <Form onSubmit={signin} className="space-y-6">
            <div className="space-y-2">
              <Form.Label className="text-white text-sm font-medium" htmlFor="typeEmailX">
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                id="typeEmailX"
                className="w-full p-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Form.Label className="text-white text-sm font-medium" htmlFor="typePasswordX">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                id="typePasswordX"
                className="w-full p-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-0"
              type="submit"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">Secure admin access only</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">© 2025 Nverse. All rights reserved.</p>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
    </div>
  );
}
