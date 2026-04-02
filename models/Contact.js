import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  commentsOrMessage: { type: String, required: true },
  status: { type: String, default: "unread", enum: ["unread", "read", "resolved"] },
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);
