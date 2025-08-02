// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Group from "@/models/Group";
// import Expense from "@/models/Expense";
// import { Types } from "mongoose";

// export async function DELETE(req, context) {
//   await connectDB();
//   const { id, memberId } = await context.params;

//   try {
//     // Delete all expenses where the member is involved in this group
//     await Expense.deleteMany({
//       group: id,
//       $or: [{ paidBy: memberId }, { splitBetween: { $in: [memberId] } }],
//     });
// console.log(id);  
//     // Remove the member from the group's members array
//     await Group.findByIdAndUpdate(id, {
//       $pull: { members: memberId },
//     });
// console.log(memberId);
//     return NextResponse.json({
//       success: true,
//       message: "Member and related expenses deleted",
//     });
//   } catch (err) {
//     console.error("Delete member error:", err);
//     return NextResponse.json(
//       { error: "Failed to delete member" },
//       { status: 500 }
//     );
//   }
// }

import { connectDB } from "@/lib/db";
import Group from "@/models/Group";
import Expense from "@/models/Expense";

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id, memberId } =await context.params;

    // ✅ Step 1: Delete all expenses in this group involving this member
    await Expense.deleteMany({
      group: id,
      $or: [{ paidBy: memberId }, { splitBetween: memberId }],
    });

    // ✅ Step 2: Remove member from group members array
    const group = await Group.findById(id);
    if (!group) {
      return new Response(JSON.stringify({ error: "Group not found" }), {
        status: 404,
      });
    }

    // Remove member
    group.members = group.members.filter((m) => m._id.toString() !== memberId);

    // ✅ Important: Save group after modification
    await group.save();

    return new Response(
      JSON.stringify({ message: "Member deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Delete member error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
