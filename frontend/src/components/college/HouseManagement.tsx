import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api.service";
import { House } from "../../types";
import { Plus, Trash2, Edit2, Shield } from "lucide-react";

const HouseManagement: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newHouse, setNewHouse] = useState({ name: "", color: "#3b82f6" });

  const fetchHouses = async () => {
    setLoading(true);
    const response = await apiService.getHouses();
    if (response.success) {
      setHouses(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleAddHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse.name) return;
    
    const response = await apiService.addHouse(newHouse);
    if (response.success) {
      setNewHouse({ name: "", color: "#3b82f6" });
      setIsAdding(false);
      fetchHouses();
    }
  };

  const handleDeleteHouse = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this house? This might affect student assignments.")) {
      const response = await apiService.deleteHouse(id);
      if (response.success) {
        fetchHouses();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            House Management
          </h2>
          <p className="text-sm text-slate-500">Manage the 8 houses for the sports day</p>
        </div>
        {!isAdding && houses.length < 8 && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add House
          </button>
        )}
      </div>

      <div className="p-6">
        {isAdding && (
          <form onSubmit={handleAddHouse} className="mb-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-semibold text-indigo-900 mb-4 uppercase tracking-wider">New House Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">House Name</label>
                <input
                  type="text"
                  value={newHouse.name}
                  onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
                  placeholder="e.g. Red House"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newHouse.color}
                    onChange={(e) => setNewHouse({ ...newHouse, color: e.target.value })}
                    className="h-10 w-20 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newHouse.color}
                    onChange={(e) => setNewHouse({ ...newHouse, color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Create House
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : houses.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/30 rounded-xl border-2 border-dashed border-slate-200">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No houses created yet</h3>
            <p className="text-slate-500 mt-1 max-w-xs mx-auto">Create exactly 8 houses for the sports day to begin student assignment.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Add your first house →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {houses.map((house) => (
              <div 
                key={house.id} 
                className="group relative p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div 
                  className="absolute top-0 left-0 w-1 h-full" 
                  style={{ backgroundColor: house.color || "#cbd5e1" }}
                />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{house.name}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteHouse(house.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-800">{house.points || 0}</span>
                    <span className="text-[10px] ml-1 text-slate-400 uppercase tracking-widest font-bold">Points</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: `${house.color}20`, border: `1px solid ${house.color}40` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {houses.length > 0 && houses.length < 8 && (
          <p className="mt-6 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Only {houses.length} houses created. Please create exactly 8 houses for optimal distribution.
          </p>
        )}
      </div>
    </div>
  );
};

export default HouseManagement;
