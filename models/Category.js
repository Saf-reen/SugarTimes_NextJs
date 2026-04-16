import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emoji: { type: String, default: "" },
    color: { type: String, default: "from-emerald-500 to-teal-600" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
