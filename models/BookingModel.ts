import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IBooking extends Document {
  slot: Types.ObjectId;
  user_id?: Types.ObjectId;
  sectionIndex: number;
  sectionSlotNumber: number;
  price?: number;
  bookingStatus:
    | "booked"
    | "exit-requested"
    | "cancelled"
    | "unavailable"
    | "completed";
  bookingDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema: Schema = new Schema(
  {
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sectionIndex: {
      type: Number,
      required: true,
    },
    sectionSlotNumber: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
    },
    bookingStatus: {
      type: String,
      enum: [
        "booked",
        "exit-requested",
        "cancelled",
        "unavailable",
        "completed",
      ],
      required: true,
    },
    bookingDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
