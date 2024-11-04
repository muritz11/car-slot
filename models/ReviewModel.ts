import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IReview extends Document {
  slot: Types.ObjectId;
  user: Types.ObjectId;
  review: string;
}

const ReviewSchema: Schema = new Schema(
  {
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
