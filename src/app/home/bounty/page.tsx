"use client";

import { useState, useEffect } from "react";
import type { BountyListItem } from "@/types/bounty";
import { getBountyList } from "@/api/bounties";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import AppendBountyButton from "@/components/bounty/AppendBountyButton";
import SubmitSeedButton from "@/components/bounty/SubmitSeedButton";

export default function BountyPage() {
  const [bounties, setBounties] = useState<BountyListItem[]>([]);

  useEffect(() => {
    getBountyList().then(setBounties);
  }, []);
  
  return (
    <div>
      <Navbar name="资源悬赏">
        <Toaster />
        <h1 className="text-2xl font-bold mb-6">资源悬赏</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow border rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">名称</th>
                <th className="p-4">赏金</th>
                <th className="p-4">发布人</th>
                <th className="p-4">悬赏状态</th>
                <th className="p-4">描述</th>
                <th className="p-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {bounties.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.total_amount}</td>
                  <td className="p-4">{item.publisher}</td>
                  <td className="p-4">{item.status}</td>
                  <td className="p-4">{item.description}</td>
                  <td className="p-4 space-y-1 flex flex-col">
                    {item.status === "进行中" && (
                      <div className="flex gap-2">
                        <SubmitSeedButton
                          bountyId={item.id}
                          onSuccess={() => getBountyList().then(setBounties)}
                        />
                        <AppendBountyButton
                          bountyId={item.id}
                          onSuccess={() => getBountyList().then(setBounties)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Navbar>
    </div>
  );
}
