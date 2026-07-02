import mongoose from 'mongoose';
import { env } from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
