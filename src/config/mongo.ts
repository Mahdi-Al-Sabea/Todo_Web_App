import mongoose from "mongoose";
import 'dotenv/config';

export const connectDB = async () => {
  //code used to connect to locally running mongodb
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};