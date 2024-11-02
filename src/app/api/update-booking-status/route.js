import { NextResponse } from "next/server";
import Booking from "../../../../models/BookingModel";
import { connectDB } from "../../../../utils/connect";

export async function PUT(req) {
  await connectDB();

  const { status, bookingId } = await req.json();
  try {
    const booking = await Booking.updateOne(
      { _id: bookingId },
      {
        $set: {
          bookingStatus: status,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "success",
        data: booking,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed",
        data: error,
      },
      {
        status: 500,
      }
    );
  }
}
