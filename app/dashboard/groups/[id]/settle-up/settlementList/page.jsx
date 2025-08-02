// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function SettlementList() {
//   const { id: groupId } = useParams();
//   const [members, setMembers] = useState([]);
//   const [settlements, setSettlements] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       try {
//         // Fetch group members
//         const groupRes = await fetch(`/api/groups/${groupId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const groupData = await groupRes.json();
//         setMembers(groupData.group.members || []);

//         console.log("Members loaded:", groupData.group.members);

//         // Fetch settlements
//         const settlementsRes = await fetch(
//           `/api/groups/${groupId}/settlements`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const settlementsData = await settlementsRes.json();
//         console.log("Settlement API response:", settlementsData);
//         setSettlements(Array.isArray(settlementsData) ? settlementsData : []);
        
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [groupId]);

//   const getMemberName = (id) => {
//     const member = members.find((m) => m._id == id); // Use loose == comparison
//     if (!member) {
//       console.warn(`No member found for ID: ${id}`);
//     }
//     return member ? member.name : "(unknown)";
//   };

  



//   if (loading) {
//     return <div className="text-center mt-10 text-gray-500">Loading...</div>;
//   }

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Settle Up</h1>

//       <h2 className="text-lg font-semibold mt-10">Past Settlements</h2>

//       {settlements.length === 0 ? (
//         <div className="text-gray-500 mt-2">No settlements yet.</div>
//       ) : (
//         settlements.map((s) => (
//           <div key={s._id} className="bg-gray-100 p-2 rounded mb-2">
//             <strong>{getMemberName(s.from)}</strong> paid{" "}
//             <strong>{getMemberName(s.to)}</strong> ₹{s.amount}
//             {s.note && (
//               <div className="text-sm text-gray-600">Note: {s.note}</div>
//             )}
//             {s.proofUrl && (
//               <div className="text-sm text-blue-600">
//                 <a href={s.proofUrl} target="_blank" rel="noopener noreferrer">
//                   View Proof
//                 </a>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SettlementList() {
  const { id: groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        // Fetch group members
        const groupRes = await fetch(`/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const groupData = await groupRes.json();
        setMembers(groupData.group.members || []);

        // Fetch settlements
        const settlementsRes = await fetch(
          `/api/groups/${groupId}/settlements`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const settlementsData = await settlementsRes.json();
        setSettlements(Array.isArray(settlementsData) ? settlementsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const getMemberName = (id) => {
    const member = members.find((m) => m._id == id);
    if (!member) {
      console.warn(`No member found for ID: ${id}`);
    }
    return member ? member.name : "(unknown)";
  };

  const totalSettled = settlements.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );

  const getTotalPaidPerMember = () => {
    const totals = {};
    settlements.forEach((s) => {
      if (!totals[s.from]) totals[s.from] = 0;
      totals[s.from] += s.amount;
    });
    return totals;
  };

  const getTotalReceivedPerMember = () => {
    const totals = {};
    settlements.forEach((s) => {
      if (!totals[s.to]) totals[s.to] = 0;
      totals[s.to] += s.amount;
    });
    return totals;
  };

  const totalPerMember = getTotalPaidPerMember();
  const totalReceivedPerMember = getTotalReceivedPerMember();

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settle Up</h1>

      {/* ✅ Total Settled */}
      <div className="bg-green-100 border border-green-300 rounded p-4 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-green-800">Total Settled</h2>
        <p className="text-xl font-bold text-green-900">₹{totalSettled}</p>
      </div>

      {/* ✅ Total Paid By Each Member */}
      {Object.keys(totalPerMember).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Total Paid by Each Member
          </h2>
          <ul className="space-y-1">
            {Object.entries(totalPerMember).map(([memberId, total]) => (
              <li key={memberId} className="text-blue-900">
                <strong>{getMemberName(memberId)}</strong> paid ₹{total}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Total Received By Each Member */}
      {Object.keys(totalReceivedPerMember).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Total Received by Each Member
          </h2>
          <ul className="space-y-1">
            {Object.entries(totalReceivedPerMember).map(([memberId, total]) => (
              <li key={memberId} className="text-yellow-900">
                <strong>{getMemberName(memberId)}</strong> received ₹{total}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Past Settlements */}
      <h2 className="text-lg font-semibold mt-10">Past Settlements</h2>
      {settlements.length === 0 ? (
        <div className="text-gray-500 mt-2">No settlements yet.</div>
      ) : (
        settlements.map((s) => (
          <div key={s._id} className="bg-gray-100 p-2 rounded mb-2">
            <strong>{getMemberName(s.from)}</strong> paid{" "}
            <strong>{getMemberName(s.to)}</strong> ₹{s.amount}
            {s.note && (
              <div className="text-sm text-gray-600">Note: {s.note}</div>
            )}
            {s.proofUrl && (
              <div className="text-sm text-blue-600">
                <a href={s.proofUrl} target="_blank" rel="noopener noreferrer">
                  View Proof
                </a>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

