import { NextResponse } from "next/server";
import Booking from "../../../../models/BookingModel";
import { connectDB } from "../../../../utils/connect";
import { isValid, parseISO } from "date-fns";
import Slot from "../../../../models/SlotModel";
import User from "../../../../models/UserModel";

export async function POST(req) {
  try {
    await connectDB();

    const { slot, sectionIndex, sectionSlotNumber } = await req.json();
    const alreadyBooked = await Booking.findOne({
      slot: slot,
      sectionIndex: sectionIndex,
      sectionSlotNumber: sectionSlotNumber,
      bookingStatus: "booked",
    });
    const isUnavailable = await Booking.findOne({
      slot: slot,
      sectionIndex: sectionIndex,
      sectionSlotNumber: sectionSlotNumber,
      bookingStatus: "unavailable",
    });
    if (alreadyBooked) {
      return NextResponse.json(
        { message: "Slot already booked" },
        {
          status: 400,
        }
      );
    }

    if (isUnavailable) {
      // delete recored
      await Booking.findByIdAndDelete(isUnavailable._id);
    } else {
      await Booking.create({
        slot,
        sectionIndex,
        sectionSlotNumber,
        bookingStatus: "unavailable",
      });
    }
    return NextResponse.json(
      { message: "Slot status updated" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating slot status.",
      },
      { status: 500 }
    );
  }
}
