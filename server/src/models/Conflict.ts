import mongoose from "mongoose";

const ConflictSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    conflictingProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    status: { type: ["pending", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

const Conflict = mongoose.model("Conflict", ConflictSchema);
export default Conflict;
