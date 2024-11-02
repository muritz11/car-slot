import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface ISlot extends Document {
  area: Types.ObjectId;
  sections: {
    title: string;
    numberOfSlots: number;
    price: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SlotSchema: Schema = new Schema(
  {
    area: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      required: [true, "Please provide an area"],
      unique: [true, "area exist"],
    },
    sections: {
      type: [
        {
          title: String,
          numberOfSlots: Number,
          price: Number,
        },
      ],
      required: [true, "Please provide sections"],
    },
  },
  {
    timestamps: true,
  }
);

const Slot: Model<ISlot> =
  mongoose.models.Slot || mongoose.model<ISlot>("Slot", SlotSchema);

export default Slot;
