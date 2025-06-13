import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file found" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const stream = Readable.from(buffer);

    const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "meals",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        },
      );

      stream.pipe(uploadStream);
    });

    return new Response(
      JSON.stringify({
        url: upload.secure_url,
        public_id: upload.public_id,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Upload error", error);
    return new Response(JSON.stringify({ error: "Image upload failed" }), {
      status: 500,
    });
  }
}
