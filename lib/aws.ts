"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "./config";
import { z } from "zod";
import { auth } from "./auth";

const S3_Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: config.AWS_ACCESS as string,
    secretAccessKey: config.AWS_SECRET as string,
  },
});

const formSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  filetype: z.enum(["image/jpeg", "image/png"]),
  file: z.instanceof(File, { message: "Invalid file" }),
});

export async function uploadImage(
  formData: FormData
): Promise<{ success: boolean; key?: string; error?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  try {
    const parsedData = formSchema.parse({
      filename: formData.get("filename"),
      filetype: formData.get("filetype"),
      file: formData.get("file"),
    });

    const arrayBuffer = await parsedData.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = `uploads/${parsedData.filename}-${Date.now()}`;
    const cmd = new PutObjectCommand({
      Bucket: "news-sass",
      Key: key,
      ContentType: parsedData.filetype,
      Body: buffer,
    });

    await S3_Client.send(cmd);
    return { success: true, key };
  } catch (err) {
    console.error("Error uploading image:", err);
    return {
      success: false,
      error: JSON.stringify(err),
    };
  }
}

const base64Schema = z.object({
  filename: z.string().min(1, "Filename is required"),
  filetype: z.enum(["image/jpeg", "image/png"]),
  base64: z.string().regex(/^data:image\/(jpeg|png);base64,.+/),
});

export async function uploadBase64Image(
  filename: string,
  filetype: "image/jpeg" | "image/png",
  base64: string
): Promise<{ success: boolean; key?: string; error?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  try {
    const parsedData = base64Schema.parse({ filename, filetype, base64 });

    const base64Data = parsedData.base64.replace(
      /^data:image\/(jpeg|png);base64,/,
      ""
    );
    const buffer = Buffer.from(base64Data, "base64");

    const key = `uploads/${parsedData.filename}-${Date.now()}`;
    const cmd = new PutObjectCommand({
      Bucket: "news-sass",
      Key: key,
      ContentType: parsedData.filetype,
      Body: buffer,
    });

    await S3_Client.send(cmd);
    return { success: true, key };
  } catch (err) {
    console.error("Error uploading base64 image:", err);
    return {
      success: false,
      error: JSON.stringify(err),
    };
  }
}
