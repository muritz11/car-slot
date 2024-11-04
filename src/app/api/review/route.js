import { NextResponse } from "next/server";
import Review from "../../../../models/ReviewModel";
import { connectDB } from "../../../../utils/connect";

export async function GET(req) {
  // Parse the URL to access query parameters
  const { searchParams } = new URL(req.url);
  const slotId = searchParams.get("slotId");

  try {
    await connectDB();
    let items;
    if (!slotId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid slot ID",
        },
        { status: 400 }
      );
    } else {
      items = await Review.find({ slot: slotId })
        .populate("slot")
        .populate("user")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "An error occurred while fetching reviews",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { slotId, user_id, review } = await req.json();
    const exists = await Review.findOne({
      slot: slotId,
      user: user_id,
    });
    if (exists) {
      return NextResponse.json(
        { message: "You already reviewed this slot" },
        {
          status: 400,
        }
      );
    }

    await Review.create({
      slot: slotId,
      user: user_id,
      review,
    });
    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    console.log("Error while submitting review", error);
    return NextResponse.json(
      {
        message: "An error occurred while submitting review.",
      },
      { status: 500 }
    );
  }
}
