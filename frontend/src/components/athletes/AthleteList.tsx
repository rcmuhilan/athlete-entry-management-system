import React from "react";
import { Edit, X } from "lucide-react";
import { Athlete, User } from "../../types";

interface AthleteListProps {
  athletes: Athlete[];
  loading: boolean;
  user: User;
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: number) => void;
}

/**
 * Athlete List Component.
 * Displays a table of athletes with administrative actions.
 */
export const AthleteList: React.FC<AthleteListProps> = ({ 
  athletes, 
  loading, 
  user, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-white/50 border border-[#141414] rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-5 p-4 border-bottom border-[#141414] bg-[#141414] text-[#E4E3E0] text-[10px] uppercase tracking-widest font-bold">
        <div>Name</div>
        <div>College</div>
        <div>Email</div>
        <div>Phone</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#141414]/10">
        {loading ? (
          <div className="p-12 text-center font-serif italic opacity-50">Loading athletes...</div>
        ) : (
          <>
            {athletes.map(a => (
              <div key={a.id} className="grid grid-cols-5 p-4 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-default group">
                <div className="font-medium">{a.name}</div>
                <div className="opacity-70 group-hover:opacity-100">{a.college}</div>
                <div className="font-mono text-[11px]">{a.email}</div>
                <div className="font-mono text-[11px]">{a.phone}</div>
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(user.role === "admin" || user.role === "coordinator") && (
                    <button 
                      onClick={() => onEdit(a)}
                      className="text-emerald-500 hover:text-emerald-700 p-1"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                  {user.role === "admin" && (
                    <button 
                      onClick={() => onDelete(a.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {athletes.length === 0 && (
              <div className="p-12 text-center font-serif italic opacity-50">No athletes found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
