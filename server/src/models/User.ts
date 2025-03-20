import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    role: { type: String, enum: ["pm", "citizen", "hod"], required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    uid: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
