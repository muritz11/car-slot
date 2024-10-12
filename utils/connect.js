import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to db.`);
  } catch (error) {
    console.log(`Error connecting to db.`, error);
  }
}
