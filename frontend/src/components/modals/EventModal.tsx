import React from "react";
import { motion } from "motion/react";
import { Event } from "../../types";

interface EventModalProps {
  editingEvent: Event | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

/**
 * Modal for Adding or Editing an Event.
 */
export const EventModal: React.FC<EventModalProps> = ({ 
  editingEvent, 
  onSubmit, 
  onClose 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#E4E3E0] border border-[#141414] p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h3 className="text-2xl font-bold uppercase tracking-tighter mb-6">
          {editingEvent ? "Edit" : "Add New"} Event
        </h3>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Event Name</label>
            <input name="name" defaultValue={editingEvent?.name} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Category</label>
            <select name="category" defaultValue={editingEvent?.category || "Track"} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500">
              <option value="Track">Track</option>
              <option value="Field">Field</option>
              <option value="Swimming">Swimming</option>
              <option value="Relay">Relay</option>
              <option value="Hurdles">Hurdles</option>
              <option value="Jumps">Jumps</option>
              <option value="Throws">Throws</option>
              <option value="Multi-Events">Multi-Events</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Date</label>
            <input name="date" type="date" defaultValue={editingEvent?.date} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Max Participants</label>
            <input name="maxParticipants" type="number" defaultValue={editingEvent?.maxParticipants} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Time</label>
            <input name="time" placeholder="e.g. 10:00 AM" defaultValue={editingEvent?.time} className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Location</label>
            <input name="location" placeholder="e.g. Main Stadium" defaultValue={editingEvent?.location} className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-xs uppercase tracking-widest font-bold border border-[#141414] rounded-full hover:bg-[#141414]/5 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 text-xs uppercase tracking-widest font-bold bg-[#141414] text-[#E4E3E0] rounded-full hover:scale-105 transition-transform">{editingEvent ? "Update" : "Create"} Event</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
