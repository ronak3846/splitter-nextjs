"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserAndGroups = async () => {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setUser(data.user);

      const groupRes = await fetch("/api/groups", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const groupData = await groupRes.json();
      if (groupRes.ok) {
        setGroups(groupData.groups || []);
      }
    };

    fetchUserAndGroups();
  }, [router]);

  

  

  const totalMembers = new Set(
    groups.flatMap((g) => g.members.map((m) => m._id))
  ).size;

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  const cardColors = [
    "bg-rose-100 dark:bg-rose-900",
    "bg-indigo-100 dark:bg-indigo-900",
    "bg-green-100 dark:bg-green-900",
    "bg-yellow-100 dark:bg-yellow-900",
    "bg-blue-100 dark:bg-blue-900",
  ];


  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      {/* Hero Card */}
      <Card className="rounded-2xl p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name} 👋</h1>
        <p className="text-sm mt-1">Email: {user.email}</p>
      </Card>

      {/* Summary Bar */}
      <Card className="mb-8">
        <CardContent className="flex justify-between flex-wrap gap-4 text-sm p-4">
          <span>📌 Total Groups: {groups.length}</span>
          <span>👥 Total Unique Members: {totalMembers}</span>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <Link href="/dashboard/create-group">
          <Button size="lg">+ Create New Group</Button>
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
      {groups.length === 0 ? (
        <p className="text-muted-foreground">
          No groups found. Start by creating one.
        </p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {groups.map((group, index) => {
            const bgColor = cardColors[index % cardColors.length];
            const groupTotal =
              group.expenses?.reduce(
                (sum, e) => sum + Number(e.amount || 0),
                0
              ) || 0;

            return (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`rounded-2xl shadow-md ${bgColor}`}>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <p className="text-sm">👥 {group.members.length} Members</p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link href={`/dashboard/groups/${group._id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/groups/${group._id}/add-expense`}>
                        <Button size="sm">Add</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.push(`/dashboard/groups/${group._id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
