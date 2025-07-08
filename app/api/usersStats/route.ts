import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userApi = process.env.NEXT_PUBLIC_USERS_STATS;
  try {
    if (!userApi) {
      throw new Error("Users API is not defined");
    }

    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    const apiUrl = `${userApi}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch users stats");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching users stats", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error fetching users stats" },
      { status: 500 }
    );
  }
}