import { NextResponse } from "next/server";
import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
// @ts-ignore
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "dw5u8cfu2",
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // @ts-ignore
    folder: "carSlot",
  },
});

export const upload = multer({
  storage: storage,
});

export async function POST(request: Request) {
  try {
    // @ts-ignore
    if (!request.file.path) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "No file to upload",
      });
    }

    // @ts-ignore
    const result = await cloudinary.uploader.upload(request.file.path);
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
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
