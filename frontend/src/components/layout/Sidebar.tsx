import React from "react";
import { Users, Calendar, ClipboardList, Plus, LogOut, GraduationCap, Shield } from "lucide-react";
import { User } from "../../types";

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
  onNewRegistration: () => void;
  onAddAthlete: () => void;
}

/**
 * Sidebar Component for navigation and quick actions.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onNewRegistration,
  onAddAthlete
}) => {
  const isAdminOrTeacher = user.role === "admin" || user.role === "teacher";
  const userIdentifier = user.fullName || user.email || user.phone || "User";

  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r border-[#141414] p-8 flex flex-col gap-12 bg-[#E4E3E0] z-20">
      <div className="flex items-center gap-3">
        <img src="/logo.webp" alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm shrink-0" />
        <div className="flex flex-col">
          <h1 className="font-serif italic text-xl font-bold tracking-tight leading-none text-slate-900">Athlete System</h1>
          <span className="text-[8px] uppercase tracking-[0.2em] opacity-40 font-bold mt-1">Production Grade v2.0</span>
        </div>
      </div>

      <nav className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-widest opacity-30 font-bold mb-1 border-b border-[#141414]/10 pb-1">Main</div>
        <button
          onClick={() => setActiveTab("athletes")}
          className={`flex items-center gap-3 text-sm uppercase tracking-wider transition-all ${activeTab === "athletes" ? "opacity-100 font-bold" : "opacity-40 hover:opacity-70"}`}
        >
          <Users size={18} /> Athletes
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center gap-3 text-sm uppercase tracking-wider transition-all ${activeTab === "events" ? "opacity-100 font-bold" : "opacity-40 hover:opacity-70"}`}
        >
          <Calendar size={18} /> Events
        </button>
        <button
          onClick={() => setActiveTab("registrations")}
          className={`flex items-center gap-3 text-sm uppercase tracking-wider transition-all ${activeTab === "registrations" ? "opacity-100 font-bold" : "opacity-40 hover:opacity-70"}`}
        >
          <ClipboardList size={18} /> Registrations
        </button>

        {isAdminOrTeacher && (
          <>
            <div className="text-[10px] uppercase tracking-widest opacity-30 font-bold mt-4 mb-1 border-b border-[#141414]/10 pb-1">College</div>
            <button
              onClick={() => setActiveTab("college")}
              className={`flex items-center gap-3 text-sm uppercase tracking-wider transition-all ${activeTab === "college" ? "opacity-100 font-bold" : "opacity-40 hover:opacity-70"}`}
            >
              <GraduationCap size={18} /> Management
            </button>
          </>
        )}
      </nav>

      <div className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-widest opacity-30 font-bold">Quick Actions</div>
        {isAdminOrTeacher && (
          <>
            <button
              onClick={onNewRegistration}
              className="text-[11px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 flex items-center gap-2 group transition-all"
            >
              <div className="w-6 h-6 rounded-full border border-[#141414]/20 flex items-center justify-center group-hover:bg-[#141414] group-hover:text-[#E4E3E0] transition-all">
                <Plus size={12} />
              </div>
              New Registration
            </button>
            <button
              onClick={onAddAthlete}
              className="text-[11px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 flex items-center gap-2 group transition-all"
            >
              <div className="w-6 h-6 rounded-full border border-[#141414]/20 flex items-center justify-center group-hover:bg-[#141414] group-hover:text-[#E4E3E0] transition-all">
                <Plus size={12} />
              </div>
              Add Athlete
            </button>
          </>
        )}
      </div>

      <div className="mt-auto pt-8 border-t border-[#141414]/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#141414] text-[#E4E3E0] flex items-center justify-center text-[10px] font-bold">
            {userIdentifier[0].toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden max-w-[140px]">
            <span className="text-[10px] font-bold truncate">{userIdentifier}</span>
            <span className="text-[9px] uppercase tracking-widest opacity-50 font-bold text-indigo-600">{user.role}</span>
            <button onClick={onLogout} className="text-[9px] uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-1 mt-1">
              <LogOut size={10} /> Logout
            </button>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest opacity-30">System Status</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono">Operational</span>
        </div>
      </div>
    </div>
  );
};
