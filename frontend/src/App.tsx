import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Filter, X } from "lucide-react";

// Types
import { Athlete, Event, Registration, User } from "./types";

// Services
import { apiService } from "./services/api.service";

// Components
import { AuthForm } from "./components/auth/AuthForm";
import { Sidebar } from "./components/layout/Sidebar";
import { StatsOverview } from "./components/dashboard/StatsOverview";
import { AthleteList } from "./components/athletes/AthleteList";
import { EventList } from "./components/events/EventList";
import { RegistrationList } from "./components/registrations/RegistrationList";
import { AthleteModal } from "./components/modals/AthleteModal";
import { EventModal } from "./components/modals/EventModal";
import { RegistrationModal } from "./components/modals/RegistrationModal";
import HouseManagement from "./components/college/HouseManagement";
import StudentImport from "./components/college/StudentImport";
import { useToast } from "./context/ToastContext.tsx";
import { LoggerInstance } from "./common/logging/logger";

const Logger = new LoggerInstance({ serviceName: "App", filePath: "frontend/src/App.tsx" });

/**
 * Main Application Container.
 * Manages global state, routing, and coordinates data flow between components.
 */
const App = () => {
  // Authentication & Navigation State
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [activeTab, setActiveTab] = useState<"athletes" | "events" | "registrations" | "college">("athletes");
  const [isViewerMode, setIsViewerMode] = useState(false);
  
  // Data State
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter & Search State
  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Modal Visibility & Editing State
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddReg, setShowAddReg] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { showToast } = useToast();

  // --- Initial Setup ---

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user || isViewerMode) {
      fetchData();
    }
  }, [user, isViewerMode, activeTab, searchName, filterCategory, startDate, endDate]);

  /**
   * Universal data fetcher based on current active tab and filters.
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      let result;
      if (activeTab === "athletes") {
        result = await apiService.getAthletes();
        if (result.success) setAthletes(result.data);
      } else if (activeTab === "events") {
        result = await apiService.getEvents({ name: searchName, category: filterCategory, startDate, endDate });
        if (result.success) setEvents(result.data);
      } else if (activeTab === "registrations") {
        result = await apiService.getRegistrations({ startDate, endDate });
        if (result.success) setRegistrations(result.data);
      }
      
      if (result && !result.success) {
        showToast(result.message, "error");
      }
    } catch (error: any) {
      Logger.error("Failed to fetch data", error);
      showToast("Data loading failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Auth Handlers ---

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const result = await (authMode === "login" ? apiService.login(data) : apiService.signup(data));
      
      if (!result.success) {
        showToast(result.message, "error");
        return;
      }
      
      if (authMode === "login") {
        const { user: loggedInUser, token } = result.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        showToast("Logged in successfully!", "success");
      } else {
        showToast("Signup successful! Please log in.", "success");
        setAuthMode("login");
      }
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleLogout = async () => {
    const result = await apiService.logout();
    if (result.success) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      showToast("Logged out successfully", "success");
    } else {
      showToast(result.message, "error");
    }
  };

  // --- Action Handlers ---

  const handleAddAthlete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    let result;
    if (editingAthlete) {
      result = await apiService.updateAthlete(editingAthlete.id, data);
    } else {
      result = await apiService.addAthlete(data);
    }
    
    if (result.success) {
      showToast(result.message, "success");
      setShowAddAthlete(false);
      setEditingAthlete(null);
      fetchData();
    } else {
      showToast(result.message, "error");
    }
  };

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    data.maxParticipants = Number(data.maxParticipants);

    let result;
    if (editingEvent) {
      result = await apiService.updateEvent(editingEvent.id, data);
    } else {
      result = await apiService.addEvent(data);
    }
    
    if (result.success) {
      showToast(result.message, "success");
      setShowAddEvent(false);
      setEditingEvent(null);
      fetchData();
    } else {
      showToast(result.message, "error");
    }
  };

  const handleAddReg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      athlete_id: Number(formData.get("athlete_id")),
      event_id: Number(formData.get("event_id"))
    };
    const result = await apiService.addRegistration(data);
    if (result.success) {
      showToast(result.message, "success");
      setShowAddReg(false);
      fetchData();
    } else {
      showToast(result.message, "error");
    }
  };

  const handleDeleteAthlete = async (id: number) => {
    if (confirm("Delete athlete?")) {
      const result = await apiService.deleteAthlete(id);
      if (result.success) {
        showToast(result.message, "success");
        fetchData();
      } else {
        showToast(result.message, "error");
      }
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (confirm("Delete event?")) {
      const result = await apiService.deleteEvent(id);
      if (result.success) {
        showToast(result.message, "success");
        fetchData();
      } else {
        showToast(result.message, "error");
      }
    }
  };

  const handleCancelReg = async (id: number) => {
    if (confirm("Cancel registration?")) {
      const result = await apiService.deleteRegistration(id);
      if (result.success) {
        showToast(result.message, "success");
        fetchData();
      } else {
        showToast(result.message, "error");
      }
    }
  };

  // --- Render Logic ---

  if (!user && !isViewerMode) {
    return (
      <>
        <AuthForm authMode={authMode} setAuthMode={setAuthMode} onSubmit={handleAuth} />
        <button 
          onClick={() => setIsViewerMode(true)}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity"
        >
          Continue as Viewer (No Login)
        </button>
      </>
    );
  }

  const currentUser: User = user || { id: "viewer", role: "viewer" };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans">
      <Sidebar 
        user={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        onNewRegistration={() => { setActiveTab("registrations"); setShowAddReg(true); }}
        onAddAthlete={() => { setActiveTab("athletes"); setShowAddAthlete(true); }}
      />

      <main className="ml-64 p-12 max-w-6xl">
        {!user && (
          <button 
            onClick={() => setIsViewerMode(false)}
            className="mb-8 text-[10px] uppercase tracking-widest font-bold bg-[#141414] text-[#E4E3E0] px-4 py-2 rounded-full hover:scale-105 transition-transform"
          >
            ← Back to Login
          </button>
        )}
        <StatsOverview 
          athleteCount={athletes.length} 
          eventCount={events.length} 
          registrationCount={registrations.length} 
        />

        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="font-serif italic text-sm opacity-50 mb-1">Current View</div>
            <h2 className="text-4xl font-bold uppercase tracking-tighter">{activeTab}</h2>
          </div>
          
          <div className="flex gap-4 items-center">
            {activeTab === "events" && (
              <div className="flex items-center gap-2 bg-white/50 border border-[#141414] rounded-full px-4 py-2">
                <Search size={14} className="opacity-50" />
                <input 
                  placeholder="Search events..." 
                  className="bg-transparent text-xs focus:outline-none w-32"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            )}
            
            {activeTab === "registrations" && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/50 border border-[#141414] rounded-full px-4 py-2">
                  <span className="text-[10px] uppercase font-bold opacity-50">From</span>
                  <input type="date" className="bg-transparent text-xs focus:outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 bg-white/50 border border-[#141414] rounded-full px-4 py-2">
                  <span className="text-[10px] uppercase font-bold opacity-50">To</span>
                  <input type="date" className="bg-transparent text-xs focus:outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            )}

            {((activeTab === "athletes" && (currentUser.role === "admin" || currentUser.role === "teacher")) ||
              (activeTab === "events" && currentUser.role === "admin") ||
              (activeTab === "registrations" && (currentUser.role === "admin" || currentUser.role === "teacher"))) && (
              <button 
                onClick={() => {
                  if (activeTab === "athletes") setShowAddAthlete(true);
                  if (activeTab === "events") setShowAddEvent(true);
                  if (activeTab === "registrations") setShowAddReg(true);
                }}
                className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform shadow-lg"
              >
                <Plus size={16} /> Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        </header>

        {activeTab === "events" && (
          <div className="flex gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/50 border border-[#141414] rounded-lg px-3 py-1.5 shadow-sm">
              <Filter size={12} className="opacity-50" />
              <select 
                className="bg-transparent text-[10px] uppercase tracking-widest font-bold focus:outline-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Track">Track</option>
                <option value="Field">Field</option>
                <option value="Swimming">Swimming</option>
              </select>
            </div>
            {(searchName || filterCategory || startDate || endDate) && (
              <button onClick={() => { setSearchName(""); setFilterCategory(""); setStartDate(""); setEndDate(""); }} className="text-[10px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 flex items-center gap-1">
                <X size={12} /> Clear Filters
              </button>
            )}
          </div>
        )}

        {activeTab === "athletes" && <AthleteList athletes={athletes} loading={loading} user={currentUser} onEdit={(a) => { setEditingAthlete(a); setShowAddAthlete(true); }} onDelete={handleDeleteAthlete} />}
        {activeTab === "events" && <EventList events={events} loading={loading} user={currentUser} onEdit={(ev) => { setEditingEvent(ev); setShowAddEvent(true); }} onDelete={handleDeleteEvent} onSelect={setSelectedEvent} />}
        {activeTab === "registrations" && <RegistrationList registrations={registrations} loading={loading} user={currentUser} onCancel={handleCancelReg} />}
        
        {activeTab === "college" && currentUser.role === "admin" && (
          <div className="grid grid-cols-1 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <HouseManagement />
            <StudentImport />
          </div>
        )}
      </main>

      <AnimatePresence>
        {showAddAthlete && (
          <AthleteModal 
            editingAthlete={editingAthlete} 
            onSubmit={handleAddAthlete} 
            onClose={() => { setShowAddAthlete(false); setEditingAthlete(null); }} 
          />
        )}
        {showAddEvent && (
          <EventModal 
            editingEvent={editingEvent} 
            onSubmit={handleAddEvent} 
            onClose={() => { setShowAddEvent(false); setEditingEvent(null); }} 
          />
        )}
        {showAddReg && (
          <RegistrationModal 
            athletes={athletes} 
            events={events} 
            onSubmit={handleAddReg} 
            onClose={() => setShowAddReg(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

