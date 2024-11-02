import { NextResponse } from "next/server";
import Slot from "../../../../models/SlotModel";
import Area from "../../../../models/AreaModel";
import { connectDB } from "../../../../utils/connect";

export async function GET(req) {
  // Parse the URL to access query parameters
  const { searchParams } = new URL(req.url);
  const slotId = searchParams.get("slotId");

  if (!slotId) {
    try {
      await connectDB();
      const items = await Slot.find()
        .populate({
          path: "area",
          model: Area,
        })
        .sort({ createdAt: -1 });

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
  } else {
    try {
      await connectDB();
      const item = await Slot.findOne({ _id: slotId });

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message: "Slot not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: item,
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
}

export async function POST(req) {
  try {
    await connectDB();

    const { area, sections } = await req.json();
    const exists = await Slot.findOne({ $or: [{ area }] });
    if (exists) {
      return NextResponse.json(
        { message: "Slot for this area already exist" },
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

export async function PUT(req) {
  await connectDB();

  const { area, sections, slotId } = await req.json();
  try {
    const slot = await Slot.updateOne(
      { _id: slotId },
      {
        $set: {
          area,
          sections,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "success",
        data: slot,
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

export async function DELETE(req) {
  await connectDB();

  const { slotId } = await req.json();

  if (!slotId) {
    return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
  }

  try {
    // Find and delete the slot by its ID
    const deletedSlot = await Slot.findByIdAndDelete(slotId);

    if (!deletedSlot) {
      return NextResponse.json(
        { success: false, message: "Slot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Slot deleted successfully",
        slot: deletedSlot,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting slot:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the slot" },
      { status: 500 }
    );
  }
}
