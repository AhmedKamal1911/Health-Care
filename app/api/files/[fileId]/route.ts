import { BUCKET_ID, storage } from "@/lib/appwrite";
import { handleErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  try {
    const fileMeta = await storage.getFile(BUCKET_ID, fileId);

    const arrayBuffer = await storage.getFilePreview(BUCKET_ID, fileId);
    const fileBuffer = Buffer.from(arrayBuffer);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": fileMeta.mimeType,
        "Cache-Control": "private, max-age=3600",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    const { status, message } = handleErrorMessage(error);
    return NextResponse.json(message, {
      status: status,
      statusText: status === 404 ? "Not Found" : "Internal Error",
    });
  }
}
