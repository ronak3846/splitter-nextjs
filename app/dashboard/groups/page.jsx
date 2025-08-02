// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";

// export default function GroupsPage() {
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchGroups = async () => {
//       const token = localStorage.getItem("token");

//       const res = await fetch("/api/groups", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         router.push("/login");
//         return;
//       }

//       setGroups(data.groups || []);
//       setLoading(false);
//     };

//     fetchGroups();
//   }, [router]);

//   const handleDeleteGroup = async (groupId) => {
//     const confirmed = confirm("Are you sure you want to delete this group?");
//     if (!confirmed) return;

//     try {
//       const res = await fetch(`/api/groups/${groupId}/delete-group`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data?.error || "Failed to delete group.");
//         return;
//       }

//       alert(data?.message || "Group deleted.");
//       setGroups((prev) => prev.filter((g) => g._id !== groupId));
//     } catch (err) {
//       console.error("Delete group error:", err);
//       alert("Something went wrong.");
//     }
//   };

//   if (loading)
//     return (
//       <p className="text-center mt-16 text-lg text-muted-foreground">
//         Loading groups...
//       </p>
//     );

//   return (
//     <div className="max-w-4xl mx-auto px-4 mt-20 space-y-6">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <h2 className="text-3xl font-bold tracking-tight">Your Groups</h2>
//         <Button onClick={() => router.push("/dashboard/create-group")}>
//           + Create New Group
//         </Button>
//       </div>

//       {groups.length === 0 && (
//         <p className="text-muted-foreground mt-6">
//           You are not part of any group yet.
//         </p>
//       )}

//       <div className="grid gap-5 sm:grid-cols-2">
//         {groups.map((group, i) => (
//           <motion.div
//             key={group._id}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <Card className="hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
//               <CardContent className="p-5 flex flex-col justify-between h-full">
//                 <div
//                   className="cursor-pointer"
//                   onClick={() => router.push(`/dashboard/groups/${group._id}`)}
//                 >
//                   <h3 className="text-xl font-semibold mb-1">{group.name}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Members: {group.members.map((m) => m.name).join(", ")}
//                   </p>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDeleteGroup(group._id)}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";

const groupEmojis = ["👥", "🎉", "💼", "🍕", "🎮", "🌍", "🏝️", "🏠"];

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        router.push("/login");
        return;
      }

      setGroups(data.groups || []);
      setLoading(false);
    };

    fetchGroups();
  }, [router]);

  const handleDeleteGroup = async (groupId) => {
    const confirmed = confirm("Are you sure you want to delete this group?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/delete-group`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to delete group.");
        return;
      }

      alert(data?.message || "Group deleted.");
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      console.error("Delete group error:", err);
      alert("Something went wrong.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-muted-foreground animate-pulse">
        Loading groups...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 mt-16 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-primary">
            Your Groups
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and explore your group expenses.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/create-group")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12">
          <p className="text-xl">You haven’t created any groups yet.</p>
          <p className="text-sm mt-2">Tap the button above to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <AnimatePresence>
            {groups.map((group, i) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="group cursor-pointer bg-gradient-to-br from-muted/30 to-background border border-muted rounded-2xl hover:shadow-md transition-all">
                  <CardContent
                    className="p-5 h-full flex flex-col justify-between"
                    onClick={() =>
                      router.push(`/dashboard/groups/${group._id}`)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">
                        {groupEmojis[i % groupEmojis.length]}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group._id);
                        }}
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        Members:{" "}
                        {group.members.map((m) => m.name).join(", ") || "—"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

