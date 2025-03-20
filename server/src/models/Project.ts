import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Docuemnt" }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  schedule: {
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      isRescheduled: { type: Boolean, default: false },
    },
  },
  location: {
    type: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
  },
});

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
