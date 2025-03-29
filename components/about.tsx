import React from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function About() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target as HTMLFormElement);

    formData.append("access_key", "1601eeac-004d-42c3-9f8f-f42048fd9298");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      setResult("Message Submitted Successfully");
      (event.target as HTMLFormElement).reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div style={{ background: "linear-gradient(to bottom, grey, white)" }}>
      <div className="container px-5 pt-5" >
        <div className="row gx-5 align-items-center">
          <div className="col-lg-6">
            <div className="mb-5 mb-lg-0 text-center text-lg-start">
              <h1 className="display-1 lh-1 mb-3">About Us</h1>
                <p className="lead fw-normal text-muted mb-5">
                We are a volunteer-driven project, passionate about preserving and presenting books in the best way possible. 
                Using the latest technology, we strive to make a vast collection of books accessible to everyone.
                </p>
                <p className="lead fw-normal text-muted mb-5">
                If you share our passion and want to be part of this journey, we would love to hear from you. 
                Contact us and join our community today!
                </p>
            </div>
          </div>
          <div className="col-lg-6">
            <h1 className="display-1 lh-1 mb-3 text-center">Contact Us</h1>
            <p className="lead fw-normal text-muted mb-4">
              Have questions, feedback, or want to share a book? 
              Fill out the form below, and our team will get back to you as soon as possible. 
              We look forward to hearing from you!
            </p>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label id="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                />
              </div>
              <div className="mb-3">
                <label id="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label id="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  name="message"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="text-center mb-2">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
            <div className="text-center mb-2">
              <span>{result}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
