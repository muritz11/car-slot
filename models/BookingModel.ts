import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IBooking extends Document {
  slot: Types.ObjectId;
  sectionIndex: number;
  sectionSlotNumber: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema: Schema = new Schema(
  {
    slot: {
      type: Schema.Types.ObjectId,
      required: [true, "Please provide slot id"],
    },
    sectionIndex: {
      type: Number,
      required: true,
    },
    sectionSlotNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
