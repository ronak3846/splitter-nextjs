import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    note: String,
    proofUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Settlement ||
  mongoose.model("Settlement", settlementSchema);
