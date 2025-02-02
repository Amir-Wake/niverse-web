import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const id = searchParams.get("id");
  const bookApi = process.env.NEXT_PUBLIC_BOOKS_API;

  try {
    if (!bookApi) {
      throw new Error("API is not defined");
    }

    let apiUrl = `${bookApi}`;
    if (search) {
      apiUrl += `?search=${search}`;
    }
    if (id) {
      apiUrl = `${bookApi}${id}`;
    }
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

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const bookApi = process.env.NEXT_PUBLIC_BOOKS_API;

  try {
    if (!bookApi) {
      throw new Error("API is not defined");
    }
    if (!id) {
      throw new Error("Book ID is required");
    }
    if (!token) {
      throw new Error("Authorization token is required");
    }

    const apiUrl = `${bookApi}${id}`;
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete book");
    }

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book", error);
    return NextResponse.json({ error: "Error deleting book" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { sourceCollection, destinationCollection, documentId } =
    await req.json();
  const collectionAPI = process.env.NEXT_PUBLIC_COLLECTIONS_API;

  try {
    if (!collectionAPI) {
      throw new Error("API is not defined");
    }
    if (!sourceCollection || !destinationCollection || !documentId) {
      throw new Error("Missing required fields");
    }

    const apiUrl = `${collectionAPI}/copyDocument`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceCollection,
        destinationCollection,
        documentId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to copy book");
    }

    return NextResponse.json(
      { message: "Book copied successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error copying book", error);
    return NextResponse.json({ error: "Error copying book" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const bookApi = process.env.NEXT_PUBLIC_BOOKS_API;
  const updatedBookData = await req.json();

  try {
    if (!bookApi) {
      throw new Error("API is not defined");
    }
    if (!id) {
      throw new Error("Book ID is required");
    }
    if (!token) {
      throw new Error("Authorization token is required");
    }

    const apiUrl = `${bookApi}${id}`;
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBookData),
    });

    if (!response.ok) {
      throw new Error("Failed to update book");
    }

    return NextResponse.json(
      { message: "Book updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating book", error);
    return NextResponse.json({ error: "Error updating book" }, { status: 500 });
  }
}
