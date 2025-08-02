"use client"
import { useParams } from "next/navigation";
import SettlementList from "./settlementList/page";
import SettleUpForm from "./settlementForm/page";

export default function SettleUpPage() {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Settle Up</h1>
      <SettleUpForm groupId={id} />
      <div className="mt-10">
        <SettlementList groupId={id} />
      </div>
    </div>
  );
}
