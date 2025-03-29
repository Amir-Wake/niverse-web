import { NextResponse } from "next/server";

export async function GET() {
  const bookApi = process.env.NEXT_PUBLIC_NEWBOOKS_API;

  try {
    if (!bookApi) {
      throw new Error("API is not defined");
    }

    const apiUrl = `${bookApi}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching books", error);
    return NextResponse.json(
      { error: "Error fetching books" },
      { status: 500 }
    );
  }
}
