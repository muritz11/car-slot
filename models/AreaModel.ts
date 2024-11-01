import mongoose, { Schema, Document, Model } from "mongoose";

interface IArea extends Document {
  title: string;
  location: string;
  coverUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AreaSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide area title"],
      unique: [true, "Area exist"],
    },
    location: {
      type: String,
      required: [true, "Please provide area location"],
    },
    coverUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Area: Model<IArea> =
  mongoose.models.Area || mongoose.model<IArea>("Area", AreaSchema);

export default Area;
