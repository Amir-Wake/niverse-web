import { NextResponse } from "next/server";

export async function GET() {
  const authorApi = process.env.NEXT_PUBLIC_AUTHOR_API;

  try {
    if (!authorApi) {
      throw new Error("API is not defined");
    }

    const apiUrl = `${authorApi}authors`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch authors from ${apiUrl}`);
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching authors", error);
    return NextResponse.json(
      { error: "Error fetching authors" },
      { status: 500 }
    );
  }
}

// delete author
export async function DELETE(request: Request) {
  const authorApi = process.env.NEXT_PUBLIC_AUTHOR_API;
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get("id");

  if (!authorApi || !authorId) {
    return NextResponse.json(
      { error: "API or author ID is not defined" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `${authorApi}authors/${authorId}`;
    const response = await fetch(apiUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete author");
    }

    return NextResponse.json({ message: "Author deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting author", error);
    return NextResponse.json(
      { error: "Error deleting author" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authorApi = process.env.NEXT_PUBLIC_AUTHOR_API;

  if (!authorApi) {
    return NextResponse.json(
      { error: "API is not defined" },
      { status: 400 }
    );
  }

  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is missing" },
        { status: 401 }
      );
    }

    const apiUrl = `${authorApi}authors`;
    const authorData = await request.json();

    const response = await fetch(apiUrl, {
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

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error adding author", error);
    return NextResponse.json(
      { error: "Error adding author" },
      { status: 500 }
    );
  }
}
