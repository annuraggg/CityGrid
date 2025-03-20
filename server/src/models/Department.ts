import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
    hod: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    inviteStatus: {
      type: String,
      enum: ["expired", "pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", DepartmentSchema);
export default Department;
