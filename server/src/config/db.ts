import mongoose from "mongoose";
import logger from "../utils/logger.js";

mongoose
  .connect(process.env.DB_STRING!, {
    dbName: process.env.DB_NAME,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error(err));

export default mongoose;
