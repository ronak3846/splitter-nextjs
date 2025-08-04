// import mongoose from "mongoose";

// const PersonalExpenseSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   category: {
//     type: String,
//     default: "other",
//   },

//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.models.PersonalExpense ||
//   mongoose.model("PersonalExpense", PersonalExpenseSchema);

import mongoose from "mongoose";

const PersonalExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },

  category: {
    id: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PersonalExpense ||
  mongoose.model("PersonalExpense", PersonalExpenseSchema);
