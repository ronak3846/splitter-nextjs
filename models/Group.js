// models/Group.js
import mongoose from "mongoose";

// Member sub-schema
// const groupSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   members: [
//     {
//       name: { type: String, required: true },
//       email: { type: String, required: true },
//     },
//   ],
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId, // ✅ now this works
//     ref: "User",
//     required: true,
//   },
// }, {
//   timestamps: true,
// });

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // ✅ now this works
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// Export (with recompile safety)
export default mongoose.models.Group || mongoose.model("Group", groupSchema);
