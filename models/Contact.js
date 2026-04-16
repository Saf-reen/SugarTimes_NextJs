import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fullName:       { type: String, required: true },
  designation:    { type: String, default: "" },
  email:          { type: String, required: true },
  contactNo:      { type: String, default: "" },
  subject:        { type: String, default: "General Enquiry" },
  commentsOrMessage: { type: String, required: true },
  status: { type: String, default: "unread", enum: ["unread", "read", "resolved"] },
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);
