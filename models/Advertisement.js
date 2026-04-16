import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, default: "" },
  placement: {
    type: String,
    enum: ["middle", "sidebar", "both"],
    default: "middle",
  },
  // Empty array = show on ALL categories. Otherwise restricted to the
  // given parent-category or sub-category labels.
  categories: { type: [String], default: [] },
  active: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

advertisementSchema.index({ placement: 1, active: 1 });
advertisementSchema.index({ categories: 1 });

export default mongoose.model("Advertisement", advertisementSchema);
