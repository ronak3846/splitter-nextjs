// app/api/groups/[id]/delete-group/route.js

import { connectDB } from "@/lib/db";
import Group from "@/models/Group";

import Expense from "@/models/Expense";

export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;

  try {
    // Delete all related members and expenses first
    
    await Expense.deleteMany({ groupId: id });

    // Delete the group itself
    await Group.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: "Group deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting group:", error);
    return new Response(JSON.stringify({ error: "Failed to delete group" }), {
      status: 500,
    });
  }
}
