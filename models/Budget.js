import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String, // e.g., "2025-08"
      required: true,
    },
    budgetAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
export default Budget;
