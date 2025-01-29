import { NextResponse } from "next/server";

export async function GET() {
    const collectionAPI = process.env.NEXT_PUBLIC_COLLECTIONS_API;

    try {
        if (!collectionAPI) {
            throw new Error("NEXT_PUBLIC_COLLECTIONS_API is not defined");
        }
        const response = await fetch(collectionAPI);
        const text = await response.text();
        let data = text ? JSON.parse(text) : [];
        if (Array.isArray(data)) {
            data = data.filter(item => item !== "users");
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("There was an error fetching the collections!", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
