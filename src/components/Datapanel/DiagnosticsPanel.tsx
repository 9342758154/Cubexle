import React, { useState, useRef, useLayoutEffect } from "react";
import {
  ChevronDown,
  RotateCcw,
  ChevronLeft,
  Trash2,
  User,
  Calendar,
  Plus,
  Activity,
  FolderOpen,
  MessageCircle,
  GitCompare,
  Search,
  FileCheck,
  Save,
} from "lucide-react";

// --- Types ---
type Status = "pending" | "in progress" | "completed" | "Clarification";

interface VitalsRow {
  id: number;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  bmi: string;
  dia: string;
  sys: string;
  pulse: string;
  pageNo1: number;
  pageNo2: number;
}

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
      textareaRef.current.style.height = "inherit"; // Reset height
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        50
      )}px`; // Set to scrollHeight
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none overflow-hidden outline-none transition-all ${className}`}
    />
  );
};

// --- Main Component ---
export default function DiagnosticReport() {
  /* STATUS */
  const [status, setStatus] = useState<Status>("pending");

  /* PATIENT INFORMATION */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  /* PROVIDER / FACILITY / DOS */
  const [providerName, setProviderName] = useState("");
  const [facility, setFacility] = useState(""); // Manual Entry now
  const [dos, setDos] = useState(""); // Date of Service
  const [pageNoHeader, setPageNoHeader] = useState<number | string>("");

  /* Refs for Date Pickers */
  const dobRef = useRef<HTMLInputElement>(null);
  const dosRef = useRef<HTMLInputElement>(null);

  /* VITALS STATE (Main + Extra Rows) */
  const [vitalsRows, setVitalsRows] = useState<VitalsRow[]>([
    {
      id: 1,
      height: "",
      heightUnit: "CM",
      weight: "",
      weightUnit: "KG",
      bmi: "",
      dia: "",
      sys: "",
      pulse: "",
      pageNo1: 0,
      pageNo2: 0,
    },
  ]);

  /* DIAGNOSTIC REPORT FIELDS */
  const [radiologyReport, setRadiologyReport] = useState("");
  const [procedureName, setProcedureName] = useState("");
  const [indication, setIndication] = useState("");
  const [comparison, setComparison] = useState("");
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [specialComments, setSpecialComments] = useState("");

  /* ACTIONS */
  const addVitalsRow = () => {
    setVitalsRows([
      ...vitalsRows,
      {
        id: Date.now(),
        height: "",
        heightUnit: "CM",
        weight: "",
        weightUnit: "KG",
        bmi: "",
        dia: "",
        sys: "",
        pulse: "",
        pageNo1: 0,
        pageNo2: 0,
      },
    ]);
  };

  const removeVitalsRow = (id: number) => {
    if (vitalsRows.length > 1) {
      setVitalsRows(vitalsRows.filter((row) => row.id !== id));
    } else {
      const resetRow = {
        ...vitalsRows[0],
        height: "",
        weight: "",
        bmi: "",
        dia: "",
        sys: "",
        pulse: "",
      };
      setVitalsRows([resetRow]);
    }
  };

  const updateVitals = (
    id: number,
    field: keyof VitalsRow,
    val: string | number
  ) => {
    setVitalsRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setStatus("pending");
      setFirstName("");
      setLastName("");
      setDob("");
      setGender("");
      setProviderName("");
      setFacility("");
      setDos("");
      setPageNoHeader("");
      setRadiologyReport("");
      setProcedureName("");
      setIndication("");
      setComparison("");
      setFindings("");
      setImpression("");
      setRecommendation("");
      setSpecialComments("");
      setVitalsRows([
        {
          id: 1,
          height: "",
          heightUnit: "CM",
          weight: "",
          weightUnit: "KG",
          bmi: "",
          dia: "",
          sys: "",
          pulse: "",
          pageNo1: 0,
          pageNo2: 0,
        },
      ]);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete record?")) {
      handleReset();
    }
  };

  const handleSave = () => {
    alert("Data Saved Successfully!");
    console.log({
      firstName,
      lastName,
      dob,
      facility,
      dos,
      vitalsRows,
      findings,
      status,
    });
  };

  // --- Helper Styles ---
  const inputBaseClass =
    "w-full h-8 bg-[#CFE8F2] rounded px-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-400";
  const labelClass = "block text-xs font-bold  mb-1.5";

  // Function to trigger native date picker
  const triggerDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  return (
    <div className="w-full gap-3 bg-white min-h-screen pb-16">
      {/* 1. Header Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-4 pt-3 border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Status</span>
          <div className="relative">
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
                hover:opacity-90
              `}
              style={{
                backgroundImage: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
            >
              <option value="pending" className="bg-white text-yellow-700">
                Pending
              </option>
              <option value="in progress" className="bg-white text-blue-700">
                In Progress
              </option>
              <option value="completed" className="bg-white text-green-700">
                Completed
              </option>
              <option value="Clarification" className="bg-white text-purple-700">
                Clarification
              </option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 sm:ml-auto w-full sm:w-auto justify-end">
            <button
            
            onClick={handleDelete}
            className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
          >
            <Trash2 size={16} strokeWidth={2} /> Delete
          </button> 
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
          >
            <RotateCcw size={16} strokeWidth={2} /> Reset
          </button>
        
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
          >
           <Save size={16} strokeWidth={2} /> Save 
          </button>
        </div>
      </div>

      <div className="sm:px-2 space-y-2 max-w-[1400px] ">
        {/* 2. Diagnostic Report Title */}
        <div className="border border-gray-300 rounded-lg p-2 bg-white flex items-center gap-6 shadow-sm px-4">
          
          <h1 className="text-lg font-bold text-black">Diagnostic Report</h1>
        </div>

        {/* 3. Patient Information */}
        <div className="border border-blue-300 rounded-xl p-2 bg-white relative shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-[#000103] ">
              Patient information
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputBaseClass}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputBaseClass}
              />
            </div>
            {/* DOB Date Picker */}
            <div className="relative">
              <label className={labelClass}>DOB</label>
              <div
                className="relative cursor-pointer"
                onClick={() => triggerDatePicker(dobRef)}
              >
                <input
                  ref={dobRef}
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`${inputBaseClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`}
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />
              </div>
            </div>
            <div className="relative">
              <label className={labelClass}>Gender</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`${inputBaseClass} appearance-none cursor-pointer`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Provider / Facility Row */}
        <div className="border border-blue-300 rounded-xl p-2 bg-white shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols- gap-4 items-end">
            <div className="col-span-1">
              <label className={labelClass}>Provider name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Provider name"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
            {/* Facility - Manual Typing */}
            <div className="col-span-1">
              <label className={labelClass}>Facility</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Facility"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
            {/* DOS Date Picker */}
            <div className="col-span-1">
              <label className={labelClass}>(DOS)Date of service</label>
              <div
                className="relative cursor-pointer"
                onClick={() => triggerDatePicker(dosRef)}
              >
                <input
                  ref={dosRef}
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={dos}
                  onChange={(e) => setDos(e.target.value)}
                  className={`${inputBaseClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`}
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Page No</label>
              <input
                type="number"
                value={pageNoHeader}
                onChange={(e) => setPageNoHeader(e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>
        </div>

        {/* 5. VITALS Section */}
        <div className="border border-blue-300 rounded-xl p-2 mb-4 bg-white relative shadow-sm ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold  uppercase">
              VITALS
            </h2>
            <button
              onClick={addVitalsRow}
              className="bg-blue-500 hover:bg-blue-600 text-[#ffffff] px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> ADD VITALS
            </button>
          </div>

          <div className="space-y-6 md:space-y-4">
            {vitalsRows.map((row, index) => (
              <div
                key={row.id}
                className="flex flex-wrap md:flex-nowrap gap-x-2 gap-y-4 items-end pb-4 border-b border-gray-100 last:border-0 md:pb-0 md:border-none"
              >
                {/* Height */}
                <div className="w-[48%] md:w-[14%] shrink-0">
                  <label className={labelClass}>Height</label>
                  <div className="flex gap-1">
                    <input
                      value={row.height}
                      onChange={(e) =>
                        updateVitals(row.id, "height", e.target.value)
                      }
                      className={`${inputBaseClass} rounded-r-none`}
                    />
                    <div className="relative w-10 shrink-0">
                      <select
                        value={row.heightUnit}
                        onChange={(e) =>
                          updateVitals(row.id, "heightUnit", e.target.value)
                        }
                        className={`${inputBaseClass} rounded-l-none appearance-none px-1 justify-center pl-1 bg-[#CFE8F2]`}
                      >
                        <option>CM</option>
                        <option>INCH</option>
                        <option>FT</option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 "
                      />
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div className="w-[48%] md:w-[14%] shrink-0">
                  <label className={labelClass}>Weight</label>
                  <div className="flex gap-1">
                    <input
                      value={row.weight}
                      onChange={(e) =>
                        updateVitals(row.id, "weight", e.target.value)
                      }
                      className={`${inputBaseClass} rounded-r-none`}
                    />
                    <div className="relative w-10 shrink-0">
                      <select
                        value={row.weightUnit}
                        onChange={(e) =>
                          updateVitals(row.id, "weightUnit", e.target.value)
                        }
                        className={`${inputBaseClass} rounded-l-none appearance-none px-1 justify-center pl-1 bg-[#CFE8F2]`}
                      >
                        <option>KG</option>
                        <option>LBS</option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Page No 1 */}
                <div className="w-[30%] md:w-[8%] shrink-0">
                  <label className={labelClass}>Page No</label>
                  <input
                    type="number"
                    value={row.pageNo1 || ""}
                    onChange={(e) =>
                      updateVitals(row.id, "pageNo1", e.target.value)
                    }
                    className={inputBaseClass}
                  />
                </div>

                {/* Blood Pressure */}
                <div className="w-[66%] md:w-[20%] shrink-0">
                  <label className={labelClass}>Blood Pressure(BP)</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="Dia"
                      value={row.dia}
                      onChange={(e) =>
                        updateVitals(row.id, "dia", e.target.value)
                      }
                      className={`${inputBaseClass} text-center`}
                    />
                    <input
                      placeholder="Sys"
                      value={row.sys}
                      onChange={(e) =>
                        updateVitals(row.id, "sys", e.target.value)
                      }
                      className={`${inputBaseClass} text-center`}
                    />
                  </div>
                </div>

                {/* BMI */}
                <div className="w-[30%] md:w-[12%] shrink-0">
                  <label className={labelClass}>BMI</label>
                  <input
                    value={row.bmi}
                    onChange={(e) =>
                      updateVitals(row.id, "bmi", e.target.value)
                    }
                    className={inputBaseClass}
                  />
                </div>

                {/* Pulse */}
                <div className="w-[30%] md:w-[12%] shrink-0">
                  <label className={labelClass}>HR/Pulse</label>
                  <input
                    value={row.pulse}
                    onChange={(e) =>
                      updateVitals(row.id, "pulse", e.target.value)
                    }
                    className={inputBaseClass}
                  />
                </div>

                {/* Page No 2 */}
                <div className="w-[30%] md:w-[8%] shrink-0">
                  <label className={labelClass}>Page No</label>
                  <input
                    type="number"
                    value={row.pageNo2 || ""}
                    onChange={(e) =>
                      updateVitals(row.id, "pageNo2", e.target.value)
                    }
                    className={inputBaseClass}
                  />
                </div>

                {/* Delete Button */}
                {index > 0 && (
                  <div className="w-full md:w-auto flex justify-end pl-1 ">
                    <button
                      onClick={() => removeVitalsRow(row.id)}
                      className="bg-red-400 hover:bg-red-500 text-white p-2 rounded shadow-sm transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 6. Text Area Sections */}
        {[
          {
            icon: Activity,
            label: "Name of the Radiology report",
            state: radiologyReport,
            set: setRadiologyReport,
          },
          {
            icon: FolderOpen,
            label: "Name of the Procedure",
            state: procedureName,
            set: setProcedureName,
          },
          {
            icon: MessageCircle,
            label: "Indication",
            state: indication,
            set: setIndication,
          },
          {
            icon: GitCompare,
            label: "Comparison",
            state: comparison,
            set: setComparison,
          },
          {
            icon: Search,
            label: "Findings",
            state: findings,
            set: setFindings,
          },
          {
            icon: FileCheck,
            label: "Impression",
            state: impression,
            set: setImpression,
          },
        ].map((item, idx) => (
          <div key={idx} className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <item.icon size={18} className=" text-[#1e3a8a]" />
              <h3 className="text-sm font-bold ">{item.label}</h3>
            </div>
            <div className="w-full border border-blue-300 rounded-xl bg-white overflow-hidden p-1 shadow-sm">
              <AutoResizeTextarea
                value={item.state}
                onChange={(e) => item.set(e.target.value)}
                className="w-full min-h-[100px] p-3 text-sm text-gray-700 bg-white"
              />
            </div>
          </div>
        ))}

        {/* 7. Footer: Recommendation & Special Comments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-10">
          <div>
            <h3 className="text-sm font-bold mb-2">
              Recommendation
            </h3>
            <div className="border border-blue-300 rounded-xl bg-white p-1 shadow-sm">
              <AutoResizeTextarea
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full min-h-[120px] p-3 text-sm text-gray-700 bg-white"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2">
              Special Comments
            </h3>
            <div className="border border-blue-300 rounded-xl bg-white p-1 shadow-sm">
              <AutoResizeTextarea
                value={specialComments}
                onChange={(e) => setSpecialComments(e.target.value)}
                className="w-full min-h-[120px] p-3 text-sm text-gray-700 bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}