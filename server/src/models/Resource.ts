import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    photo: { type: String },
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", ResourceSchema);
export default Resource;
