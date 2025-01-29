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

  interface SigninEvent extends React.FormEvent<HTMLFormElement> {}

  const signin = async (event: SigninEvent): Promise<void> => {
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
    } catch (error: any) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-disabled"
      ) {
        setError("Email or password is incorrect");
      } else {
        setError(error.message || "An unexpected error occurred");
      }
    }
    setLoading(false);
  };

  return (
    <section className="vh-100 ">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your login and password!
                  </p>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={signin}>
                    <div className="form-outline form-white mb-4">
                      <Form.Label className="form-label" htmlFor="typeEmailX">
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-outline form-white mb-4">
                      <Form.Label
                        className="form-label"
                        htmlFor="typePasswordX"
                      >
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      disabled={loading}
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Login
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
