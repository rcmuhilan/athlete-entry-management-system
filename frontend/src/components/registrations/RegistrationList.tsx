import React from "react";
import { X } from "lucide-react";
import { Registration, User } from "../../types";

interface RegistrationListProps {
  registrations: Registration[];
  loading: boolean;
  user: User;
  onCancel: (id: number) => void;
}

/**
 * Registration List Component.
 * Displays athlete-event pairings and their status.
 */
export const RegistrationList: React.FC<RegistrationListProps> = ({ 
  registrations, 
  loading, 
  user, 
  onCancel 
}) => {
  return (
    <div className="bg-white/50 border border-[#141414] rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-5 p-4 border-bottom border-[#141414] bg-[#141414] text-[#E4E3E0] text-[10px] uppercase tracking-widest font-bold">
        <div>Athlete</div>
        <div>Event</div>
        <div>Date</div>
        <div>Status</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#141414]/10">
        {loading ? (
          <div className="p-12 text-center font-serif italic opacity-50">Loading registrations...</div>
        ) : (
          <>
            {registrations.map(r => (
              <div key={r.id} className="grid grid-cols-5 p-4 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-default group">
                <div className="font-medium">{r.athlete?.name}</div>
                <div className="opacity-70 group-hover:opacity-100">{r.event?.name}</div>
                <div className="font-mono text-[11px]">{new Date(r.registration_date).toLocaleDateString()}</div>
                <div>
                  <span className="px-2 py-0.5 rounded-full border border-current text-[9px] uppercase tracking-widest">
                    {r.status}
                  </span>
                </div>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  {(user.role === "admin" || user.role === "coordinator") && (
                    <button 
                      onClick={() => onCancel(r.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {registrations.length === 0 && (
              <div className="p-12 text-center font-serif italic opacity-50">No registrations found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
