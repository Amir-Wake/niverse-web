import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const bookApi = process.env.NEXT_PUBLIC_BOOKS_API;
  const bookData = await req.json();
  const token = req.headers.get("Authorization")?.split(" ")[1];

  try {
    if (!bookApi) {
      throw new Error("API is not defined");
    }
    if (!token) {
      throw new Error("Authorization token is required");
    }

    const apiUrl = `${bookApi}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error("Failed to add book");
    }

    return NextResponse.json(
      { message: "Book added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding book", error);
    return NextResponse.json({ error: "Error adding book" }, { status: 500 });
  }
}
