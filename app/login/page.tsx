"use client";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { auth, getUserRole } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard/");
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
      if (
        (error as { code: string }).code === "auth/wrong-password" ||
        (error as { code: string }).code === "auth/user-not-found" ||
        (error as { code: string }).code === "auth/invalid-credential" ||
        (error as { code: string }).code === "auth/invalid-email" ||
        (error as { code: string }).code === "auth/user-disabled"
      ) {
        setError("Email or password is incorrect");
      } else {
        setError((error as { message: string }).message || "An unexpected error occurred");
      }
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="container py-5">
        <div className="flex justify-center items-center h-full">
          <div className="w-full max-w-md">
            <div className="bg-black text-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Login</h2>
                <p className="text-gray-400">Please enter your login and password!</p>
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <Form onSubmit={signin}>
                <div className="mb-4">
                  <Form.Label className="block text-sm font-medium mb-1" htmlFor="typeEmailX">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    id="typeEmailX"
                    className="form-control text-black form-control-lg w-full p-2 border border-gray-300 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Form.Label className="block text-sm font-medium mb-1" htmlFor="typePasswordX">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    id="typePasswordX"
                    className="form-control text-black form-control-lg w-full p-2 border border-gray-300 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  type="submit"
                >
                  Login
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
