import { NextResponse } from "next/server";
import Slot from "../../../../models/SlotModel";
import { connectDB } from "../../../../utils/connect";

export async function GET(req) {
  try {
    await connectDB();
    const items = await Slot.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: error?.message || "An error occurred while fetching slots",
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { area, sections } = await req.json();
    const exists = await Slot.findOne({ $or: [{ area }] });
    if (exists) {
      return NextResponse.json(
        { message: "Slot already exist" },
        {
          status: 400,
        }
      );
    }
    await Slot.create({
      area,
      sections,
    });
    return NextResponse.json(
      { message: "Slot created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while saving slot", error);
    return NextResponse.json(
      {
        message: "An error occurred while saving the slot.",
      },
      { status: 500 }
    );
  }
}
