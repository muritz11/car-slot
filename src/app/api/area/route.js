import { NextResponse } from "next/server";
import Area from "../../../../models/AreaModel";
import { connectDB } from "../../../../utils/connect";

export async function GET(req) {
  try {
    await connectDB();
    const areas = await Area.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: areas,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: error?.message || "An error occurred while fetching areas",
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { title, location, coverUrl } = await req.json();
    const exists = await Area.findOne({ $or: [{ title }] });
    if (exists) {
      return NextResponse.json(
        { message: "Area already exist" },
        {
          status: 400,
        }
      );
    }
    await Area.create({
      title,
      location,
      coverUrl: coverUrl || undefined,
    });
    return NextResponse.json(
      { message: "Area created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while saving Area", error);
    return NextResponse.json(
      {
        message: "An error occurred while saving the Area.",
      },
      { status: 500 }
    );
  }
}
