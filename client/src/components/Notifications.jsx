
//client/src/components/Notifications.jsx

import React from "react";
import { useNotificationStore } from "../store/notificationStore";
import { X } from "lucide-react";

export default function Notifications() {
  const notifications = useNotificationStore((s) => s.notifications);
  const remove = useNotificationStore((s) => s.remove);

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 p-3 rounded-lg shadow-lg max-w-sm transition ${
            n.type === "error"
              ? "bg-red-50 border border-red-200 text-red-900"
              : "bg-white border text-gray-800"
          }`}
        >
          <div className="flex-1">
            <div className="text-sm font-bold">{n.type.toUpperCase()}</div>
            <div className="text-sm mt-1">{n.msg}</div>
          </div>

          <button onClick={() => remove(n.id)} className="p-1">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
