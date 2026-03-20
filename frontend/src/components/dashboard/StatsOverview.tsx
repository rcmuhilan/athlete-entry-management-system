import React from "react";
import { Users, Calendar, ClipboardList } from "lucide-react";
import { motion } from "motion/react";

interface StatsOverviewProps {
  athleteCount: number;
  eventCount: number;
  registrationCount: number;
}

/**
 * Dashboard Stats Component.
 * Displays quick summary cards for the system entities.
 */
export const StatsOverview: React.FC<StatsOverviewProps> = ({ 
  athleteCount, 
  eventCount, 
  registrationCount 
}) => {
  const stats = [
    { label: "Total Athletes", value: athleteCount, icon: Users, delay: 0 },
    { label: "Active Events", value: eventCount, icon: Calendar, delay: 0.1 },
    { label: "Registrations", value: registrationCount, icon: ClipboardList, delay: 0.2 },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-12">
      {stats.map((stat, i) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
          className="bg-white border border-[#141414] p-6 rounded-2xl flex flex-col gap-2 shadow-sm"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">{stat.label}</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tighter">{stat.value}</span>
            <stat.icon size={16} className="mb-2 opacity-30" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
