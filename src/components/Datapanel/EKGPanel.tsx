import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Calendar,
  Clock,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Activity,
  X,
  FileText,
  Heart,
} from "lucide-react";

// --- Types ---
type Status = "pending" | "in progress" | "completed" | "clarification";

interface TimingComment {
  id: string;
  timing: string;
  comment: string;
}

// --- Auto-resizing Textarea Component ---
const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className}`}
      rows={1}
    />
  );
};

// --- Main EKG Panel Component ---
export default function EKGPanel() {
  /* STATUS */
  const [status, setStatus] = useState<Status>("pending");

  /* PROVIDER / FACILITY - TOP SECTION */
  const [providerName, setProviderName] = useState("Full Name");
  const [facility, setFacility] = useState("");
  const [pageNo, setPageNo] = useState("");
  const [dos, setDos] = useState("");

  /* TIMING & COMMENTS - BOTTOM SECTION (Multiple entries) */
  const [timingComments, setTimingComments] = useState<TimingComment[]>([
    { id: "1", timing: "", comment: "" }
  ]);

  /* ADDITIONAL NOTES */
  const [additionalNotes, setAdditionalNotes] = useState("");

  /* REFS for Date Pickers */
  const dosRef = useRef<HTMLInputElement>(null);

  /* HANDLERS */
  const triggerDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) ref.current.showPicker();
  };

  // Add new timing/comment pair
  const handleAddTimingComment = () => {
    const newEntry: TimingComment = {
      id: Date.now().toString(),
      timing: "",
      comment: ""
    };
    setTimingComments([...timingComments, newEntry]);
  };

  // Update timing or comment
  const handleUpdateTimingComment = (id: string, field: 'timing' | 'comment', value: string) => {
    setTimingComments(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  // Delete timing/comment pair
  const handleDeleteTimingComment = (id: string) => {
    if (timingComments.length > 1) {
      setTimingComments(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setProviderName("Full Name");
      setFacility("");
      setPageNo("");
      setDos("");
      setTimingComments([{ id: "1", timing: "", comment: "" }]);
      setAdditionalNotes("");
      setStatus("pending");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete EKG record?")) {
      handleReset();
    }
  };

  const handleSave = () => {
    console.log({
      status,
      provider: { providerName, facility, pageNo, dos },
      timingComments,
      additionalNotes
    });
    alert("EKG Report Saved Successfully!");
  };

  // --- Styles ---
  const inputClass = "w-full h-10 bg-[#e6f3f7] rounded-md px-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 border border-gray-200 placeholder-gray-400 transition-all";
  const labelClass = "block text-xs font-semibold text-black mb-1";

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* 1. Top Status Bar */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-3 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-semibold text-gray-700">Status</span>
            <div className="relative flex-1 sm:flex-none sm:min-w-[140px]">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="appearance-none w-full px-4 py-2 rounded-lg font-medium text-sm border pr-10 cursor-pointer outline-none bg-blue-500 text-white border-blue-600"
              >
                <option value="pending" className="bg-white text-yellow-700">Pending</option>
                <option value="in progress" className="bg-white text-blue-700">In Progress</option>
                <option value="completed" className="bg-white text-green-700">Completed</option>
                <option value="clarification" className="bg-white text-purple-700">Clarification</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button onClick={handleDelete} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              <Trash2 size={14} /> Delete
            </button>
            <button onClick={handleReset} className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={handleSave} className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              <Save size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="px-3 sm:px-4 py-6 max-w-5xl mx-auto">
        
        {/* Title Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Activity size={18} className="text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-black">EKG Report</h1>
        </div>
        
        {/* 3. TOP SECTION: Provider, Facility, DOS, Page No */}
        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-black mb-4">Provider Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Provider Name - Pre-filled */}
            <div>
              <label className={labelClass}>Provider name</label>
              <input 
                type="text" 
                value={providerName} 
                onChange={(e) => setProviderName(e.target.value)} 
                className={inputClass}
              />
            </div>

            {/* Facility */}
            <div>
              <label className={labelClass}>Facility</label>
              <input 
                type="text" 
                value={facility} 
                onChange={(e) => setFacility(e.target.value)} 
                placeholder="Enter facility" 
                className={inputClass}
              />
            </div>

            {/* DOS */}
            <div>
              <label className={labelClass}>DOS</label>
              <div className="relative">
                <input 
                  ref={dosRef} 
                  type="date" 
                  value={dos} 
                  onChange={(e) => setDos(e.target.value)} 
                  onClick={() => triggerDatePicker(dosRef)}
                  className={`${inputClass} pr-3 cursor-pointer`} 
                />
              </div>
            </div>

            {/* Page No */}
            <div>
              <label className={labelClass}>Page No</label>
              <input 
                type="text" 
                value={pageNo} 
                onChange={(e) => setPageNo(e.target.value)} 
                placeholder="Page number" 
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 4. EKG READINGS SECTION */}
        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">EKG Readings</h2>
            <button
              onClick={handleAddTimingComment}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add Reading
            </button>
          </div>

          {/* Dynamic Timing/Comment Entries */}
          <div className="relative">
            {timingComments.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  
                  {timingComments.length > 1 && (
                    <button
                      onClick={() => handleDeleteTimingComment(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col- md:flex-row gap-4 items-start">
                  {/* Timing - Left side */}
                  <div className="w-full md:w-40 ">
                    <label className="block text-xs font-medium text-gray-600 mb-1 ">Timing</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={item.timing}
                        onChange={(e) => handleUpdateTimingComment(item.id, 'timing', e.target.value)}
                        className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-sm outline-none focus:border-blue-400"
                      />
                      
                    </div>
                  </div>

                  {/* Comment - Right side (takes remaining space) */}
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Comment</label>
                    <AutoResizeTextarea
                      value={item.comment}
                      onChange={(e) => handleUpdateTimingComment(item.id, 'comment', e.target.value)}
                      placeholder="Enter observation"
                      className="w-full min-h-[40px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Additional Notes Section - Auto-resizing */}
        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-black mb-3">Additional Notes</h2>
          <AutoResizeTextarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter any additional EKG observations, clinical findings, or recommendations..."
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-sm text-gray-700 outline-none focus:border-blue-400 min-h-[150px]"
          />
          <div className="text-xs text-gray-400 mt-2">
            {additionalNotes.length} characters
          </div>
        </div>
        
        {/* 6. Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <X size={14} /> Cancel
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <FileText size={14} /> Export PDF
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Heart size={14} /> Submit Report
          </button>
        </div>

      </div>
    </div>
  );
}