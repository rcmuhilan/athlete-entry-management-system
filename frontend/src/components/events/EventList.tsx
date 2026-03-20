import React from "react";
import { Edit, X } from "lucide-react";
import { Event, User } from "../../types";

interface EventListProps {
  events: Event[];
  loading: boolean;
  user: User;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  onSelect: (event: Event) => void;
}

/**
 * Event List Component.
 * Displays a table of athletic events with search and filter integration.
 */
export const EventList: React.FC<EventListProps> = ({ 
  events, 
  loading, 
  user, 
  onEdit, 
  onDelete,
  onSelect
}) => {
  return (
    <div className="bg-white/50 border border-[#141414] rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-5 p-4 border-bottom border-[#141414] bg-[#141414] text-[#E4E3E0] text-[10px] uppercase tracking-widest font-bold">
        <div>Event Name</div>
        <div>Category</div>
        <div>Date</div>
        <div>Capacity</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#141414]/10">
        {loading ? (
          <div className="p-12 text-center font-serif italic opacity-50">Loading events...</div>
        ) : (
          <>
            {events.map(e => (
              <div 
                key={e.id} 
                onClick={() => onSelect(e)}
                className="grid grid-cols-5 p-4 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-pointer group"
              >
                <div className="font-medium">{e.name}</div>
                <div className="opacity-70 group-hover:opacity-100">{e.category}</div>
                <div className="font-mono text-[11px]">{e.date}</div>
                <div className="font-mono text-[11px]">{e.maxParticipants}</div>
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {user.role === "admin" && (
                    <>
                      <button 
                        onClick={(ev) => { ev.stopPropagation(); onEdit(e); }}
                        className="text-emerald-500 hover:text-emerald-700 p-1"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={(ev) => { ev.stopPropagation(); onDelete(e.id); }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="p-12 text-center font-serif italic opacity-50">No events found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
