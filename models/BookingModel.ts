import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IBooking extends Document {
  slot_id: Types.ObjectId;
  user_id: Types.ObjectId;
  sectionIndex: number;
  sectionSlotNumber: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema: Schema = new Schema(
  {
    slot_id: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
