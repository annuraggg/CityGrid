import mongoose from "mongoose";
import departmentController from "../controllers/departmentController.js";

const ResourceShareSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "dispatched", "received"],
    default: "pending",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const ResourceShare = mongoose.model("ResourceShare", ResourceShareSchema);
export default ResourceShare;
