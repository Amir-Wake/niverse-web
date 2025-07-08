import { NextResponse } from "next/server";

export async function GET() {
  const api = process.env.NEXT_PUBLIC_REMOTE_CONFIG_API;
  try {
    if (!api) {
      return NextResponse.json(
        { error: "API is not defined" },
        { status: 400 }
      );
    }

    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch remote config");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching remote config", error);
    return NextResponse.json(
      { error: "Error fetching remote config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const api = process.env.NEXT_PUBLIC_REMOTE_CONFIG_API;
  try {
    if (!api) {
      return NextResponse.json(
        { error: "API is not defined" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      content_update_date,
      documentId,
      minimumVersion,
      minimum_required_version,
      ...rest
    } = body;

    const minVersionValue = minimumVersion || minimum_required_version;

    if (documentId && !content_update_date) {
      return NextResponse.json(
        { error: "content_update_date is required" },
        { status: 400 }
      );
    }

    if (!documentId && !minVersionValue) {
      return NextResponse.json(
        { error: "Either documentId or minimumVersion is required" },
        { status: 400 }
      );
    }

    const getResponse = await fetch(api);
    if (!getResponse.ok) {
      throw new Error("Failed to fetch current remote config");
    }

    const currentData = await getResponse.json();

    let targetDoc: Record<string, unknown> | null = null;
    if (documentId) {
      targetDoc = currentData.find((doc: Record<string, unknown>) => doc.docId === documentId);
    } else if (minVersionValue) {
      targetDoc = currentData.find(
        (doc: Record<string, unknown>) =>
          doc.minimum_required_version === minVersionValue ||
          doc.minimumVersion === minVersionValue
      );
      if (!targetDoc) {
        targetDoc = currentData.find(
          (doc: Record<string, unknown>) =>
            String(doc.minimum_required_version) === String(minVersionValue)
        );
      }
    }

    if (!targetDoc && minVersionValue) {
      const docWithMinField = currentData.find(
        (doc: Record<string, unknown>) => doc.minimum_required_version !== undefined
      );
      if (docWithMinField) {
        targetDoc = docWithMinField;
      }
    }

    if (!targetDoc) {
      if (minVersionValue) {
        const newDoc: Record<string, unknown> = { minimum_required_version: minVersionValue };
        for (const key in rest) {
          if (
            rest[key] !== undefined &&
            rest[key] !== null &&
            rest[key] !== ""
          ) {
            newDoc[key] = rest[key];
          }
        }
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(newDoc),
        });

        let result;
        try {
          result = await response.json();
        } catch {
          result = {};
        }

        if (!response.ok) {
          return NextResponse.json(
            {
              error: "Failed to create minimum version config",
              details: result?.error || result?.message || null,
            },
            { status: response.status }
          );
        }

        return NextResponse.json(
          {
            message: "Minimum version config created successfully",
            ...newDoc,
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { error: "No matching document found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { ...targetDoc };
    if (documentId) {
      updateData.content_update_date = content_update_date;
    }
    if (minVersionValue && !documentId) {
      Object.assign(updateData, rest, {
        minimum_required_version: minVersionValue,
      });
    }

    const response = await fetch(`${api}/${targetDoc.docId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let result;
      try {
        result = await response.json();
      } catch {
        result = {};
      }
      return NextResponse.json(
        {
          error: "Failed to update remote config",
          details: result?.error || result?.message || null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: "Remote config updated successfully",
        ...updateData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating remote config", error);
    return NextResponse.json(
      {
        error: "Error updating remote config",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}