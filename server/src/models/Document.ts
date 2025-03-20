import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const Document = mongoose.model("Document", DocumentSchema);
export default Document;
