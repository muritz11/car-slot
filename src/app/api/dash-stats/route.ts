import { NextResponse } from "next/server";
import Area from "../../../../models/AreaModel";
import Booking from "../../../../models/BookingModel";
import { connectDB } from "../../../../utils/connect";
import mongoose from "mongoose";

export async function GET(req: any) {
  // Parse the URL to access query parameters
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    try {
      await connectDB();

      const activeCount = await Booking.countDocuments({
        bookingStatus: "booked",
      });
      const exitRequestCount = await Booking.countDocuments({
        bookingStatus: "exit-requested",
      });
      const areaCount = await Area.countDocuments();
      const totalEarnings = await Booking.aggregate([
        { $match: { bookingStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]);
      const bookingStats = await Booking.aggregate([
        // Match only bookings from the current year
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lte: new Date(new Date().getFullYear(), 11, 31),
            },
          },
        },
        // Group by month and booking status
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              status: "$bookingStatus",
            },
            count: { $sum: 1 },
          },
        },
        // Sort by month for easier processing on the frontend
        { $sort: { "_id.month": 1 } },
      ]);

      return NextResponse.json({
        success: true,
        data: {
          stats: {
            earnings: totalEarnings?.length ? totalEarnings[0].total : 0,
            activeBookingCount: activeCount,
            exitRequestCount,
            areaCount,
          },
          bookingChartSeries: bookingStats,
        },
      });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({
        success: false,
        status: 500,
        message:
          error?.message || "An error occurred while fetching dashboard stats",
      });
    }
  } else {
    try {
      await connectDB();

      const completedBookingCount = await Booking.countDocuments({
        bookingStatus: "completed",
        user_id: userId,
      });
      const cancelledBookingCount = await Booking.countDocuments({
        bookingStatus: "cancelled",
        user_id: userId,
      });
      const areaCount = await Area.countDocuments();
      const totalExpenditure = await Booking.aggregate([
        {
          $match: {
            bookingStatus: "completed",
            user_id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$price", 0] } }, // Defaults price to 0 if null
          },
        },
      ]);
      const bookingStats = await Booking.aggregate([
        // Match only bookings from the current year
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lte: new Date(new Date().getFullYear(), 11, 31),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              status: "$bookingStatus",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);

      return NextResponse.json({
        success: true,
        data: {
          stats: {
            totalExpenditure: totalExpenditure?.length
              ? totalExpenditure[0].total
              : 0,
            completedBookings: completedBookingCount,
            cancelledBookings: cancelledBookingCount,
            areaCount,
          },
          bookingChartSeries: bookingStats,
        },
      });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({
        success: false,
        status: 500,
        message:
          error?.message || "An error occurred while fetching dashboard stats",
      });
    }
  }
}
