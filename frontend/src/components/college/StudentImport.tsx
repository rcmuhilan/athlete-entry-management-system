import React, { useState, useRef } from "react";
import { apiService } from "../../services/api.service";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const StudentImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls")) {
        setFile(selectedFile);
        setImportStatus(null);
      } else {
        showToast("error", "Please select a valid Excel file (.xlsx or .xls)");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls")) {
        setFile(droppedFile);
        setImportStatus(null);
      } else {
        showToast("error", "Please drop a valid Excel file");
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await apiService.importStudents(file);
      if (response.success) {
        setImportStatus({ success: true, message: response.message });
        showToast("success", "Students imported and assigned to houses successfully!");
        setFile(null);
      } else {
        setImportStatus({ success: false, message: response.message });
        showToast("error", response.message || "Failed to import students");
      }
    } catch (error: any) {
      setImportStatus({ success: false, message: "A network error occurred." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await apiService.downloadStudentTemplate();
      showToast("success", "Template downloaded successfully");
    } catch (error: any) {
      showToast("error", "Failed to download template");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            Bulk Student Import
          </h2>
          <p className="text-sm text-slate-500 mt-1">Upload your college Excel sheet to automatically assign students to houses</p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Download Template
        </button>
      </div>

      <div className="p-6">
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
            file ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
          />
          
          <div className={`p-4 rounded-full mb-4 ${file ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
            <FileText className="w-8 h-8" />
          </div>

          {file ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 mb-1">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB • Ready to import</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-3 text-red-500 text-sm hover:underline flex items-center gap-1 mx-auto"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 mb-1">Click to upload or drag & drop</p>
              <p className="text-sm text-slate-500">Only .xlsx and .xls files allowed</p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Expected Columns</h3>
            <div className="flex flex-wrap gap-2">
              {["Name", "Register Number", "Roll Number", "Phone", "Class", "Degree", "Department", "Year", "Address"].map(col => (
                <span key={col} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] rounded font-medium">
                  {col}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Students will be sorted by Roll Number and assigned to the 8 houses in order.
            </p>
          </div>

          <button
            onClick={handleImport}
            disabled={!file || isUploading}
            className={`w-full py-3 rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
              !file || isUploading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Start Bulk Import
              </>
            )}
          </button>

          {importStatus && (
            <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 ${
              importStatus.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
            }`}>
              {importStatus.success ? (
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
              <div>
                <p className={`text-sm font-bold ${importStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importStatus.success ? 'Import Complete' : 'Import Failed'}
                </p>
                <p className={`text-sm ${importStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                  {importStatus.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentImport;
