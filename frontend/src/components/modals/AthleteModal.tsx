import React from "react";
import { motion } from "motion/react";
import { Athlete } from "../../types";

interface AthleteModalProps {
  editingAthlete: Athlete | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

/**
 * Modal for Adding or Editing an Athlete.
 */
export const AthleteModal: React.FC<AthleteModalProps> = ({ 
  editingAthlete, 
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
          {editingAthlete ? "Edit" : "Add New"} Athlete
        </h3>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Full Name</label>
            <input name="name" defaultValue={editingAthlete?.name} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">College</label>
            <input name="college" defaultValue={editingAthlete?.college} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
            <input name="email" type="email" defaultValue={editingAthlete?.email} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Phone</label>
            <input name="phone" defaultValue={editingAthlete?.phone} required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-xs uppercase tracking-widest font-bold border border-[#141414] rounded-full hover:bg-[#141414]/5 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 text-xs uppercase tracking-widest font-bold bg-[#141414] text-[#E4E3E0] rounded-full hover:scale-105 transition-transform">{editingAthlete ? "Update" : "Save"} Record</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
