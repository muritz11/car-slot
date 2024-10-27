import { NextResponse } from "next/server";
import Booking from "../../../../models/BookingModel";
import { connectDB } from "../../../../utils/connect";

export async function GET(req) {
  try {
    await connectDB();
    const items = await Booking.find().populate("slot").sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: error?.message || "An error occurred while fetching Bookings",
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { slot_id, user_id, sectionIndex, sectionSlotNumber } =
      await req.json();
    const exists = await Booking.findOne({
      slot_id: slot_id,
      sectionIndex: sectionIndex,
      sectionSlotNumber: sectionSlotNumber,
    });
    if (exists) {
      return NextResponse.json(
        { message: "Slot has already been booked" },
        {
          status: 400,
        }
      );
    }
    await Booking.create({
      slot_id,
      user_id,
      sectionIndex,
      sectionSlotNumber,
    });
    return NextResponse.json(
      { message: "Slot booked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while booking slot", error);
    return NextResponse.json(
      {
        message: "An error occurred while booking slot.",
      },
      { status: 500 }
    );
  }
}
