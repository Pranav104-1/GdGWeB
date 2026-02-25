import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectdb = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}}`
    );
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
  }
};

export default connectdb;
