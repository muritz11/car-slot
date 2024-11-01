import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dw5u8cfu2",
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

// Helper to initialize Formidable for handling `multipart/form-data`
const initFormidable = () => {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });
  return form;
};

// Disable Next.js's default body parser to use Formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: any) {
  const form = initFormidable();

  try {
    const { files } = await new Promise<{ files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) reject(err);
          resolve({ files });
        });
      }
    );

    // Check if file exists
    // @ts-ignore
    const file = files.file as formidable.File;
    if (!file) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "No file to upload",
      });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath);
    const { public_id, secure_url } = result;

    return NextResponse.json({
      success: true,
      status: 200,
      data: {
        public_id,
        secure_url,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred during file upload",
      data: error,
    });
  }
}
