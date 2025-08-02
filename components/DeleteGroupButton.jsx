"use client";

import { useRouter, useParams } from "next/navigation";

function DeleteGroupButton() {
  const router = useRouter();
  const { id: groupId } = useParams();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this group?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/delete-group`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Delete failed");

      alert("Group deleted successfully");
      router.push("/dashboard/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded mt-4"
    >
      Delete Group
    </button>
  );
}

export default DeleteGroupButton;
