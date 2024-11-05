import { NextResponse } from "next/server";
import Booking from "../../../../models/BookingModel";
import { connectDB } from "../../../../utils/connect";
import { isValid, parseISO } from "date-fns";
import Slot from "../../../../models/SlotModel";
import User from "../../../../models/UserModel";
import Area from "../../../../models/AreaModel";

export async function GET(req) {
  // Parse the URL to access query parameters
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  if (!userId) {
    try {
      await connectDB();
      let items;
      if (status) {
        if (status === "unavailable") {
          items = await Booking.find({
            bookingStatus: { $in: ["booked", "unavailable"] },
          })
            .populate({ path: "slot", populate: { path: "area" } })
            .populate("user_id")
            .sort({ createdAt: -1 });
        } else {
          items = await Booking.find({ bookingStatus: status })
            .populate({ path: "slot", populate: { path: "area" } })
            .populate("user_id")
            .sort({ createdAt: -1 });
        }
      } else {
        items = await Booking.find()
          .populate({ path: "slot", populate: { path: "area" } })
          .populate("user_id")
          .sort({ createdAt: -1 });
      }

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
  } else {
    try {
      await connectDB();
      let items;
      if (status) {
        items = await Booking.find({ user_id: userId, bookingStatus: status })
          .populate({ path: "slot", populate: { path: "area" } })
          .populate("user_id")
          .sort({ createdAt: -1 });
      } else {
        items = await Booking.find({ user_id: userId })
          .populate({ path: "slot", populate: { path: "area" } })
          .populate("user_id")
          .sort({ createdAt: -1 });
      }

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
}

export async function POST(req) {
  try {
    await connectDB();

    const {
      slot,
      area,
      user_id,
      sectionIndex,
      sectionSlotNumber,
      bookingDate,
      price,
    } = await req.json();
    const exists = await Booking.findOne({
      slot: slot,
      sectionIndex: sectionIndex,
      sectionSlotNumber: sectionSlotNumber,
      bookingStatus: { $in: ["booked", "unavailable"] },
    });
    // TODO: status= booked or requested
    const activeBookingStatus = await Booking.findOne({
      user_id,
      bookingStatus: { $in: ["booked", "exit-requested"] },
    });
    if (exists) {
      return NextResponse.json(
        { message: "Slot already booked or unavailable" },
        {
          status: 400,
        }
      );
    }
    if (activeBookingStatus) {
      return NextResponse.json(
        {
          message:
            "You have an active booking, exit current slot to book another",
        },
        {
          status: 400,
        }
      );
    }

    // Validate and parse bookingDate
    let parsedDate;
    if (bookingDate) {
      parsedDate = parseISO(bookingDate); // Parses ISO 8601 date strings
      if (!isValid(parsedDate)) {
        console.log("parsed date", parseDate);
        return NextResponse.json(
          { message: "Invalid booking date format." },
          { status: 400 }
        );
      }
    } else {
      console.log("parsed date", parseDate);
      return NextResponse.json(
        { message: "Booking date is required." },
        { status: 400 }
      );
    }

    await Booking.create({
      slot,
      user_id,
      area,
      sectionIndex,
      sectionSlotNumber,
      price,
      bookingDate: parsedDate,
      bookingStatus: "booked",
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
