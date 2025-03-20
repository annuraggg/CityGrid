import mongoose from "mongoose";

const PendingInvite = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: false },
});

export default mongoose.model("PendingInvite", PendingInvite);
