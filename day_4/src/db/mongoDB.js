import mongoose from "mongoose";

const connectDB = async () => {
  try {
    //connect to data base via URL
    const connections = await mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("⚙️ .. Connected to DB 🪖..."))
      .catch((error) =>
        console.log("MongoDB facing error intern connection ⭕ ... " + error)
      );
  } catch (error) {
    console.log("mongoDB connection fail ⚠️⚠️", error);
    process.exit(1);
  }
};

export default connectDB;
