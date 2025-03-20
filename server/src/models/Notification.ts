import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
