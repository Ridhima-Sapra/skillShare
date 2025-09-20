// src/components/IncomingRequests.jsx
import React, { useEffect } from "react";
import { useConnections } from "../context/ConnectionsContext";

export default function IncomingRequests() {
  const { incomingRequests, fetchIncomingRequests, respondRequest } = useConnections();

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  if (!incomingRequests || incomingRequests.length === 0) return <div className="p-4">No incoming requests.</div>;

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-2">Incoming requests</h4>
      <ul className="space-y-2">
        {incomingRequests.map((r) => (
          <li key={r.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{r.from_user_username || "Unknown"}</div>
              <div className="text-sm text-gray-500">Sent: {new Date(r.created_at).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => respondRequest(r.id, "accept")} className="bg-green-500 text-white px-3 py-1 rounded">Accept</button>
              <button onClick={() => respondRequest(r.id, "reject")} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
