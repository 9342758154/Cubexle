import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  Calendar,
  Check,
  X,
  Download,
  Send,
  User,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Save,
  FileText,
} from "lucide-react";

// --- Types ---
type Status = "pending" | "in progress" | "completed" | "Clarification";

interface LabResultRow {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  flag: "High" | "Normal" | "Low" | "No Ref Range" | "";
  referenceRange: string;
}

// --- Predefined Data for Panels ---
const PANELS_DATA: Record<string, string[]> = {
  "Lipid Panel": [
    "Total Cholesterol (TC)",
    "HDL Cholesterol",
    "LDL Cholesterol",
    "Triglycerides (TG)",
    "TC/HDL Ratio",
  ],
  "Basic Metabolic Panel": [
    "Glucose",
    "Calcium",
    "Sodium",
    "Potassium",
    "CO2",
    "Chloride",
    "BUN",
    "Creatinine",
  ],
  "Complete Blood Count": [
    "WBC",
    "RBC",
    "Hemoglobin",
    "Hematocrit",
    "Platelets",
  ],
};

// --- Auto-Resizing Textarea Component ---
const AutoResizeTextarea = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full resize-none overflow-hidden outline-none transition-all ${className}`}
    />
  );
};

// --- Main Component ---
export default function LaboratoryReport() {
  /* STATUS */
  const [status, setStatus] = useState<Status>("pending");

  /* PATIENT INFORMATION */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  /* PROVIDER / FACILITY */
  const [providerName, setProviderName] = useState("");
  const [facility, setFacility] = useState("");
  const [dos, setDos] = useState("");
  const [pageNo, setPageNo] = useState("");

  /* PANEL & PARAMETERS */
  const [panelName, setPanelName] = useState("Lipid Panel");
  const [availableParams, setAvailableParams] = useState<string[]>(
    PANELS_DATA["Lipid Panel"]
  );

  /* LAB RESULTS STATE */
  const [results, setResults] = useState<LabResultRow[]>([]);

  /* COMMENTS */
  const [comments, setComments] = useState("");

  /* REFS for Date Pickers */
  const dobRef = useRef<HTMLInputElement>(null);
  const dosRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    setAvailableParams(PANELS_DATA[panelName] || []);
    // Clear results when panel changes to avoid mismatched parameters
    setResults([]);
  }, [panelName]);

  /* HANDLERS */
  const triggerDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) ref.current.showPicker();
  };

  const handleParameterToggle = (param: string) => {
    setResults((prev) => {
      const exists = prev.find((r) => r.parameter === param);
      if (exists) {
        return prev.filter((r) => r.parameter !== param);
      } else {
        const newRow: LabResultRow = {
          id: param,
          parameter: param,
          value: "",
          unit: "",
          flag: "",
          referenceRange: "",
        };
        const newResults = [...prev, newRow];
        return newResults.sort(
          (a, b) =>
            availableParams.indexOf(a.parameter) -
            availableParams.indexOf(b.parameter)
        );
      }
    });
  };

  const handleSelectAll = () => {
    const allSelected = availableParams.every(param => 
      results.some(r => r.parameter === param)
    );

    if (allSelected) {
      // Deselect all
      setResults([]);
    } else {
      // Select all parameters that aren't already selected
      const newResults = [...results];
      availableParams.forEach(param => {
        const exists = results.some(r => r.parameter === param);
        if (!exists) {
          newResults.push({
            id: param,
            parameter: param,
            value: "",
            unit: "",
            flag: "",
            referenceRange: "",
          });
        }
      });
      // Sort to maintain panel order
      newResults.sort((a, b) => 
        availableParams.indexOf(a.parameter) - availableParams.indexOf(b.parameter)
      );
      setResults(newResults);
    }
  };

  const updateResultRow = (
    id: string,
    field: keyof LabResultRow,
    value: string
  ) => {
    setResults((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setFirstName("");
      setLastName("");
      setDob("");
      setGender("");
      setProviderName("");
      setFacility("");
      setDos("");
      setPageNo("");
      setResults([]);
      setComments("");
      setStatus("pending");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete record?")) {
      handleReset();
    }
  };

  const handleSave = () => {
    console.log({
      status,
      patient: { firstName, lastName, dob, gender },
      provider: { providerName, facility, dos, pageNo },
      results,
      comments,
    });
    alert("Report Saved Successfully!");
  };

  // Check if all parameters are selected
  const allParametersSelected = availableParams.length > 0 && 
    availableParams.every(param => results.some(r => r.parameter === param));

  // --- Styles ---
  const inputClass =
    "w-full h-8 bg-[#CFE8F2] rounded px-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-400 transition-all";
  const labelClass = "block text-xs font-bold text-[#000000] mb-1.5";

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-gray-800">
      
      {/* 1. Top Status & Action Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-semibold text-gray-700">Status</span>
          <div className="relative flex-1 sm:flex-none">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className={`
                appearance-none px-6 py-2 rounded-lg font-medium text-sm 
                transition-all duration-200 shadow-sm border 
                pr-10 cursor-pointer outline-none w-full sm:w-auto
                ${
                  status === "pending"
                    ? "bg-yellow-500 text-white border-yellow-600"
                    : status === "in progress"
                    ? "bg-blue-500 text-white border-blue-600"
                    : status === "Clarification"
                    ? "bg-purple-500 text-white border-purple-600"
                    : "bg-green-600 text-white border-green-700"
                }
              `}
            >
              <option value="pending" className="bg-white text-yellow-700">Pending</option>
              <option value="in progress" className="bg-white text-blue-700">In Progress</option>
              <option value="completed" className="bg-white text-green-700">Completed</option>
              <option value="Clarification" className="bg-white text-purple-700">Clarification</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
          </div>
        </div>

        <div className="flex gap-3 sm:ml-auto w-full sm:w-auto justify-end">
          <button onClick={handleDelete} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm">
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={handleReset} className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm">
            <RotateCcw size={14} /> Reset
          </button>
          
          <button onClick={handleSave} className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm">
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="px-2 sm:px-2 py-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* 2. Title Header */}
        <div className="border border-gray-300 rounded-lg p-1 bg-white flex items-center gap-2 shadow-sm">
          <h1 className="text-lg font-bold text-black pl-4">Laboratory Report</h1>
        </div>
        
        {/* 3. Patient Information */}
        <div className="bg-white border border-blue-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-[#000000]">Patient information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className={inputClass} />
            </div>
            <div className="relative">
              <label className={labelClass}>DOB</label>
              <div className="relative cursor-pointer" onClick={() => triggerDatePicker(dobRef)}>
                <input ref={dobRef} type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`${inputClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`} />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="relative">
              <label className={labelClass}>Gender</label>
              <div className="relative">
                <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Provider & Facility */}
        <div className="bg-white border border-blue-300 rounded-xl p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Provider name</label>
              <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Provider name" className={inputClass} />
            </div>
            <div className="relative">
              <label className={labelClass}>Facility</label>
              <input type="text" value={facility} onChange={(e) => setFacility(e.target.value)} placeholder="Enter Facility" className={inputClass} />
            </div>
            <div className="relative">
              <label className={labelClass}>(DOS)Date of service</label>
              <div className="relative cursor-pointer" onClick={() => triggerDatePicker(dosRef)}>
                <input ref={dosRef} type="date" value={dos} onChange={(e) => setDos(e.target.value)} className={`${inputClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`} />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Page No</label>
              <input type="number" value={pageNo} onChange={(e) => setPageNo(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* 5. Panel Selection & Parameters with Select All Button */}
        <div className="bg-white border border-blue-300 rounded-xl p-6 shadow-sm mb-2">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Panel Select */}
            <div className="flex-1 mb-2">
              <label className={labelClass}>Panel Name</label>
              <div className="relative py-1.5">
                <select 
                  value={panelName}
                  onChange={(e) => setPanelName(e.target.value)}
                  className="w-full h-10 bg-[#CFE8F2] rounded-lg px-4 text-sm text-gray-700 appearance-none outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                >
                  {Object.keys(PANELS_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Parameters List with Select All */}
            <div className="flex-[1.5]">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#030303]">Select Parameters</label>
                <button
                  onClick={handleSelectAll}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                    allParametersSelected 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                  }`}
                >
                  {allParametersSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="bg-[#bae6fd] bg-opacity-40 rounded-lg p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableParams.map((param) => {
                    const isChecked = results.some(r => r.parameter === param);
                    return (
                      <div key={param} className="flex items-center gap-2 cursor-pointer" onClick={() => handleParameterToggle(param)}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-blue-300'}`}>
                          {isChecked && <Check size={12} strokeWidth={4} />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 select-none">{param}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Selection Summary */}
                {availableParams.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600 border-t border-blue-200 pt-2">
                    {results.length} of {availableParams.length} parameters selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Lab Results Table */}
        <div className="bg-white border border-blue-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#020202]">Lab Results</h2>
            <div className="flex gap-4 text-xs font-medium text-gray-500">
              <span className="text-red-600">High</span>
              <span className="text-green-600">Normal</span>
              <span className="text-blue-600">Low</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 w-[30%]">Parameter</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 w-[15%]">Value</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 w-[10%]">Unit</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 w-[15%]">Flag</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 w-[20%]">Reference Range</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 w-[5%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 text-sm italic">
                      No parameters selected. Please select parameters above.
                    </td>
                  </tr>
                ) : (
                  results.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 text-sm font-medium text-gray-700">{row.parameter}</td>
                      <td className="py-2 px-4">
                        <input
                          value={row.value}
                          onChange={(e) => updateResultRow(row.id, "value", e.target.value)}
                          className="w-full h-8 bg-white border border-gray-300 rounded px-2 text-center text-sm outline-none focus:border-blue-400"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          value={row.unit}
                          onChange={(e) => updateResultRow(row.id, "unit", e.target.value)}
                          className="w-full h-8 bg-white border border-gray-300 rounded px-2 text-center text-sm outline-none focus:border-blue-400"
                          placeholder="mg/dL"
                        />
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="relative inline-block w-full">
                           <select
                              value={row.flag}
                              onChange={(e) => updateResultRow(row.id, "flag", e.target.value as any)}
                              className={`
                                w-full h-8 px-2 text-xs font-bold rounded border outline-none appearance-none cursor-pointer
                                ${row.flag === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 
                                  row.flag === 'Low' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                  row.flag === 'Normal' ? 'bg-green-50 text-green-600 border-green-200' : 
                                  row.flag === 'No Ref Range' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                  'bg-white text-gray-600 border-gray-300'}
                              `}
                            >
                              <option value="">Select</option>
                              <option value="Normal">Normal</option>
                              <option value="High">High</option>
                              <option value="Low">Low</option>
                              <option value="No Ref Range">No Ref Range</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                {row.flag === 'High' && <ArrowUp size={12} className="text-red-600" />}
                                {row.flag === 'Low' && <ArrowDown size={12} className="text-blue-600" />}
                                {row.flag === 'Normal' && <CheckCircle2 size={12} className="text-green-600" />}
                            </div>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <input
                          value={row.referenceRange}
                          onChange={(e) => updateResultRow(row.id, "referenceRange", e.target.value)}
                          className="w-full h-8 bg-white border border-gray-300 rounded px-2 text-center text-sm outline-none focus:border-blue-400"
                        />
                      </td>
                      <td className="py-2 px-4 text-center">
                         <button 
                            onClick={() => handleParameterToggle(row.parameter)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove parameter"
                         >
                            <Trash2 size={16} />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Results Summary */}
            {results.length > 0 && (
              <div className="mt-4 text-xs text-gray-500 text-right border-t border-gray-200 pt-2">
                Showing {results.length} of {availableParams.length} parameters
              </div>
            )}
          </div>
        </div>

        {/* 7. Doctor's Comments & Footer Section */}
        <div className="bg-white border border-blue-300 rounded-xl p-6 shadow-sm mb-10">
          <h2 className="text-sm font-bold text-[#000000] mb-2">Doctor's Comments & Observations</h2>
          
          <div className="bg-[#fcfdfd] border border-gray-300 rounded-lg p-0 mb-4 overflow-hidden">
            <AutoResizeTextarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter clinical observations, interpretations, and recommendations..."
              className="w-full min-h-[150px] bg-transparent p-4 text-sm text-gray-700"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-gray-400">Last updated: Never</span>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button 
                onClick={() => setComments('')}
                className="text-sm text-gray-600 hover:text-red-600 font-medium px-2"
              >
                Clear
              </button>
              <button 
                className="bg-[#0284c7] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save Comments
              </button>
            </div>
          </div>
        </div>
        
        {/* 8. Integrated Footer Action Buttons */}
        <div className="flex justify-end gap-3 mt-4 mb-8">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <X size={14} /> Cancel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <FileText size={14} /> Export PDF
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[#0284c7] hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <Send size={14} /> Submit Report
            </button>
        </div>

      </div>
    </div>
  );
}