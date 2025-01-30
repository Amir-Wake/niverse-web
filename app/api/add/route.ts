import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const collection = new URL(req.url).searchParams.get("collection");
  const bookApi = process.env.NEXT_PUBLIC_BOOKS_API;
  const googleVisionApiUrl = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_URL;
  const googleVisionApiKey = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY;
  if (!googleVisionApiUrl || !googleVisionApiKey) {
    throw new Error("Google Vision API URL or Key is not defined");
  }
  const colorAPI = googleVisionApiUrl + googleVisionApiKey;

  const bookData = await req.json();
  const token = req.headers.get("Authorization")?.split(" ")[1];

  try {
    if (!bookApi) {
      throw new Error("API is not defined");
    }
    if (!token) {
      throw new Error("Authorization token is required");
    }
    let coverDominantColor = null;
    const coverImageUrl = bookData.coverImageUrl;
    if (coverImageUrl) {
      const requestData = {
        requests: [
          {
            image: { source: { imageUri: coverImageUrl } },
            features: [{ type: "IMAGE_PROPERTIES", maxResults: 10 }],
          },
        ],
      };

      try {
        const response = await fetch(colorAPI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const data = await response.json();
          const colors =
            data.responses[0].imagePropertiesAnnotation.dominantColors.colors;
          if (colors.length > 0) {
            interface ImagePropertiesAnnotation {
              dominantColors: {
                colors: Array<{
                  color: {
                    red: number;
                    green: number;
                    blue: number;
                  };
                  pixelFraction: number;
                }>;
              };
            }
            const highestPixelFractionColor = colors.reduce(
              (
                prev: { pixelFraction: number },
                current: { pixelFraction: number }
              ) => (prev.pixelFraction > current.pixelFraction ? prev : current)
            );
            const rgbString = `rgb(${highestPixelFractionColor.color.red},${highestPixelFractionColor.color.green},${highestPixelFractionColor.color.blue})`;
            coverDominantColor = rgbString;
          }
        } else {
          console.error("Error fetching color data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching color data:", error);
      }
    }

    if (coverDominantColor) {
      bookData.coverDominantColor = coverDominantColor;
    }

    const apiUrl = `${bookApi}?collection=${collection}`;
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
  } catch (error: any) {
    console.error("Error adding book", error);
    return NextResponse.json({ error: "Error adding book" }, { status: 500 });
  }
}
