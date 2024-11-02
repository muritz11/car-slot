import { NextResponse } from "next/server";
import Area from "../../../../models/AreaModel";
import Slot from "../../../../models/SlotModel";
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

export async function PUT(req) {
  await connectDB();

  const { title, location, areaId, coverUrl } = await req.json();
  try {
    const area = await Area.updateOne(
      { _id: areaId },
      {
        $set: {
          title,
          location,
          coverUrl: coverUrl || undefined,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "success",
        data: area,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Faileds",
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

  const { areaId } = await req.json();

  if (!areaId) {
    return NextResponse.json({ error: "Area ID is required" }, { status: 400 });
  }

  try {
    // Find and delete the slot by its ID
    const deletedArea = await Area.findByIdAndDelete(areaId);

    if (!deletedArea) {
      return NextResponse.json(
        { success: false, message: "Area not found" },
        { status: 404 }
      );
    }
    const deletedSlots = await Slot.deleteMany({ area: areaId });

    return NextResponse.json(
      {
        success: true,
        message: "Area deleted successfully",
        slot: deletedArea,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting area:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the area" },
      { status: 500 }
    );
  }
}
