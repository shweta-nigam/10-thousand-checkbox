import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    const connect = await mongoose.connect(uri);
    return connect;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
