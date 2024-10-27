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
// export const Area = mongoose.models && "Area" in mongoose.models ? mongoose.models.Post : mongoose.model("Area", AreaSchema);
const Area: Model<IArea> = mongoose.model<IArea>("Area", AreaSchema);

export default Area;
