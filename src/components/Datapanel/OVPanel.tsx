import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import {
  ChevronDown,
  Trash2,
  Plus,
  Minus,
  CalendarDays,
  Save,
  RotateCcw,
  Clock,
  FileText,
  ClipboardList,
  CheckCircle,
  MapPin,
  Briefcase,
  MessageSquare,
  NotebookTabs,
  Scale,
} from "lucide-react";

// --- Type Definitions ---
interface PageBoxProps {
  value: number;
  setValue: (value: number | ((prev: number) => number)) => void;
  id?: string;
}

interface HeaderProps {
  title: string;
  
  icon?: React.ElementType;
  hideIcon?: boolean;
}

interface BlockProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  
 
  
  icon?: React.ElementType;
  minHeight?: number;
  hideIcon?: boolean;
}

interface MedicationRow {
  db: string;
  dose: string;
  freq: string;
  cmt: string;
}

type Status = "pending" | "completed" | "in progress" |"Clarification";

// --- Components ---
const PageBox: React.FC<PageBoxProps> = ({ value, setValue, id }) => (
  <div className="flex bg-[#b6d3dc] rounded overflow-hidden w-[90px] h-[30px] border border-[#a6c3cc] shadow-sm">
    <input
      id={id}
      type="number"
      min="0"
      value={value}
      onChange={(e) => setValue(Number(e.target.value) || 0)}
      className="w-full text-center bg-transparent outline-none text-sm px-1 text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-1 focus:ring-blue-400"
      aria-label="Page number"
    />
   
  </div>
);

const Header: React.FC<HeaderProps> = ({ title,  icon: Icon, hideIcon }) => (
  <div className="flex justify-between items-center mb-1">
    <span className="font-semibold text-[15px] text-gray-800 flex items-center gap-1">
      {Icon && !hideIcon && <Icon size={16} className="text-gray-600" strokeWidth={2} />} {title}
    </span>
   
  </div>
);

const Block: React.FC<BlockProps> = ({ title, value, onChange,  icon: Icon, minHeight = 95, hideIcon }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(minHeight, textareaRef.current.scrollHeight)}px`;
    }
  }, [minHeight]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const titleToIconMap: Record<string, React.ElementType> = {
    "CC/HOPI": Clock,
    "Past Medical History": FileText,
    "Past Surgical History": FileText,
    "Previous Hospitalization records": FileText,
    "Previous Lab/Reports": FileText,
    "Review of System": ClipboardList,
    "Physical Examination/ Scores": ClipboardList,
    "Assessment": CheckCircle,
    "Plan/Recommendation": MapPin,
    "Work Status": Briefcase,
    "Special Comments": MessageSquare,
  };

  const CurrentIcon = Icon || titleToIconMap[title];
  const shouldHideIcon = hideIcon !== undefined ? hideIcon : true;

  return (
    <div className="border border-blue-400 rounded-lg p-3 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2">
        <Header title={title}  icon={CurrentIcon} hideIcon={shouldHideIcon} />
        
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg bg-[#f3f5f6] p-2 resize-none outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 custom-scroll text-sm text-gray-700 transition-colors duration-200"
        placeholder={`Enter ${title.toLowerCase()}...`}
        aria-label={`Text input for ${title}`}
        rows={1}
        style={{ minHeight: `${minHeight}px`, overflowY: 'hidden' }}
      />
    </div>
  );
};

// --- Main UI Component ---
export default function MedicalUI() {
  /* STATUS BUTTONS */
  const [status, setStatus] = useState<Status>("pending");
  
  /* PAGE NUMBERS for sections */
  /* VITALS - Add two independent page number states for original row */
const [pageVitals1, setPageVitals1] = useState<number>(0); // First page no (after Weight)
const [pageVitals2, setPageVitals2] = useState<number>(0); // Second page no (after Pulse)
/* PAGE NUMBERS for sections */
const [pageTop, setPageTop] = useState<number>(0); // Add this line
const [pageVitals, setPageVitals] = useState<number>(0);
  

  /* TOP PANEL FIELDS */
  const [notesType, setNotesType] = useState<string>("select");
  const [dos, setDos] = useState<string>("");
  const [doi, setDoi] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [facility, setFacility] = useState<string>("select");

  /* VITALS */
  const [height, setHeight] = useState<string>("");
  const [heightUnit, setHeightUnit] = useState<string>("CM");
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("KG");
  const [bmi, setBmi] = useState<string>("");
  const [dia, setDia] = useState<string>("");
  const [sys, setSys] = useState<string>("");
  const [pulse, setPulse] = useState<string>("");

  /* TEXT SECTIONS - Main blocks */
  const fields: string[] = [
    "CC/HOPI",
    "Past Medical History",
    "Past Surgical History",
    "Previous Hospitalization records",
    "Previous Lab/Reports",
    "Review of System",
    "Physical Examination/ Scores",
    "Assessment",
  ];
  
  const [data, setData] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f, ""]))
  );
  const [blockPageNumbers, setBlockPageNumbers] = useState<Record<string, number>>(
    Object.fromEntries(fields.map((f) => [f, 0]))
  );

  /* PLAN, WORK STATUS, SPECIAL COMMENTS */
  const [planRecommendation, setPlanRecommendation] = useState<string>("");
  
  const [workStatus, setWorkStatus] = useState<string>("");
  
  const [specialComments, setSpecialComments] = useState<string>("");
 

  const setBlockPage = (title: string, value: number) => {
    setBlockPageNumbers((prev) => ({ ...prev, [title]: value }));
  };

  /* MEDICATION */
  const [rows, setRows] = useState<MedicationRow[]>([]);
  
  const addRow = () => {
    setRows([...rows, { db: "", dose: "", freq: "", cmt: "" }]);
  };
  
  const removeRow = (i: number) => {
    if (window.confirm("Are you sure you want to remove this medication entry?")) {
      setRows(rows.filter((_, idx) => idx !== i));
    }
  };
  
  const updateRow = (i: number, k: keyof MedicationRow, v: string) => {
    const copy = [...rows];
    copy[i][k] = v;
    setRows(copy);
  };

  /* ACTIONS */
  const deleteAll = () => {
    if (window.confirm("Delete ALL data? This action cannot be undone.")) {
      setNotesType("select");
      setDos("");
      setDoi("");
      setProvider("");
      setFacility("select");
      setHeight("");
      setHeightUnit("CM");
      setWeight("");
      setWeightUnit("KG");
      setBmi("");
      setDia("");
      setSys("");
      setPulse("");
      setRows([]);
      setData(Object.fromEntries(fields.map((f) => [f, ""])));
      setBlockPageNumbers(Object.fromEntries(fields.map((f) => [f, 0])));
      setPlanRecommendation("");
      setWorkStatus("");
      
      setSpecialComments("");
      setStatus("pending");
    }
  };

  const resetAll = () => {
    if (window.confirm("Reset all form fields to their initial empty state?")) {
      setNotesType("select");
      setDos("");
      setDoi("");
      setProvider("");
      setFacility("select");
      setHeight("");
      setHeightUnit("CM");
      setWeight("");
      setWeightUnit("KG");
      setBmi("");
      setDia("");
      setSys("");
      setPulse("");
      setRows([]);
      setData(Object.fromEntries(fields.map((f) => [f, ""])));
      setBlockPageNumbers(Object.fromEntries(fields.map((f) => [f, 0])));
      setPlanRecommendation("");
      setWorkStatus("");
      setSpecialComments("");
      
      setStatus("pending");
    }
  };

  const saveData = () => {
    const allData = {
      status,
      
      notesType,
      dos,
      doi,
      provider,
      facility,
      pageVitals1,
      pageVitals2,
      vitals: { height, heightUnit, weight, weightUnit, bmi, dia, sys, pulse },
      notes: {
        ...data,
        "Plan/Recommendation": planRecommendation,
        "Work Status": workStatus,
        "Special Comments": specialComments,
      },
      
      medication: rows,
    };
    console.log("Saved data:", allData);
    alert("Data saved successfully!");
  };

  /* Header action handlers (placeholders) */
  const handleUpload = (section: string) => console.log(`Upload functionality for "${section}"`);
  const handleSort = (section: string) => console.log(`Sort functionality for "${section}"`);
  
  const handleBlockDelete = (title: string) => {
    if (window.confirm(`Are you sure you want to clear the content of "${title}"?`)) {
      switch (title) {
        case "Plan/Recommendation":
          setPlanRecommendation("");
         
          break;
        case "Work Status":
          setWorkStatus("");
          
          break;
        case "Special Comments":
          setSpecialComments("");
          
          break;
        default:
          setData({ ...data, [title]: "" });
          setBlockPage(title, 0);
          break;
      }
    }
  };

 

  /* ADDITIONAL VITALS ROWS */
  interface VitalsRow {
    height: string;
    heightUnit: string;
    weight: string;
    weightUnit: string;
    bmi: string;
    dia: string;
    sys: string;
    pulse: string;
    pageNo1: number; // First page no (after Weight)
    pageNo2: number; // Second page no (after Pulse)

  }

  const [vitalsRows, setVitalsRows] = useState<VitalsRow[]>([]);

  const addVitalsRow = () => {
    setVitalsRows([...vitalsRows, { 
      height: "", 
      heightUnit: "CM", 
      weight: "", 
      weightUnit: "KG", 
      bmi: "", 
      dia: "", 
      sys: "", 
      pulse: "" ,
      pageNo1: 0,
      pageNo2: 0,
    }]);
  };

  const updateVitalsRow = (index: number, key: keyof VitalsRow, value: string | number) => {
    const copy = [...vitalsRows];
    copy[index] = { ...copy[index], [key]: value };
    setVitalsRows(copy);
  };

  const removeVitalsRow = (index: number) => {
    if (window.confirm("Are you sure you want to remove this vitals entry?")) {
      setVitalsRows(vitalsRows.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="w-full gap-3">
      <div className="w-full flex flex-wrap items-center gap-3 mb-6 pb-4 pt-3 border-b border-gray-200 px-4">
        <span className="text-sm font-semibold text-gray-700 mr-2">Status</span>
  
  {/* Native Select styled as button */}
  <div className="relative">
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value as Status)}
      className={`
        appearance-none px-6 py-2 rounded-lg font-medium text-sm 
        transition-all duration-200 shadow-sm border 
        pr-10 cursor-pointer
        ${
          status === "pending" ? "bg-yellow-500 text-white border-yellow-600" :
          status === "in progress" ? "bg-blue-500 text-white border-blue-600" :
          status === "Clarification" ? "bg-purple-500 text-white border-purple-600" :
          "bg-green-600 text-white border-green-700"
          
        }
        hover:opacity-90
      `}
      style={{
        backgroundImage: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none'
      }}
    >
      <option value="pending" className="bg-white text-yellow-700">Pending</option>
      <option value="in progress" className="bg-white text-blue-700">In Progress</option>
      <option value="completed" className="bg-white text-green-700">Completed</option>
      <option value="Clarification" className="bg-white text-purple-700">Clarification</option>
    </select>
    <ChevronDown 
      size={16} 
      strokeWidth={2} 
      className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-current"
    />
  </div>

  {/* Action Buttons - Positioned to the right */}
  <div className="flex gap-2 ml-auto">
    <button
      type="button"
      onClick={deleteAll}
      className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
      aria-label="Delete all data"
    >
      <Trash2 size={16} strokeWidth={2} /> Delete
    </button>
    <button
      type="button"
      onClick={resetAll}
      className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
      aria-label="Reset all fields"
    >
      <RotateCcw size={16} strokeWidth={2} /> Reset
    </button>
    <button
      type="button"
      onClick={saveData}
      className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
      aria-label="Save current record"
    >
      <Save size={16} strokeWidth={2} /> Save 
    </button>
  </div>
</div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-6 custom-scroll pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {/* Top Panel */}
          <div className="border border-blue-400 rounded-lg p-4 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Notes Type */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                    <NotebookTabs size={16} className="text-gray-600" /> Notes Type
                  </span>
                  
                </div>
                <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                  <select
                    value={notesType}
                    onChange={(e) => setNotesType(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm appearance-none pr-6 cursor-pointer text-gray-800 px-3"
                  >
                    <option value="select" disabled>select</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Procedure">Procedure</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 pointer-events-none text-gray-600" />
                </div>
                
              </div>

              {/* DOS */}
              <div className="space-y-1">
                <span className="font-semibold text-sm text-gray-800 block">Date of Service</span>
                <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                  <input
                    type="date"
                    value={dos}
                    onChange={(e) => setDos(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm px-2 text-gray-800"
                  />
                </div>
              </div>

              {/* DOI */}
              <div className="space-y-1">
                <span className="font-semibold text-sm text-gray-800 block">Date of Injury</span>
                <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                  <input
                    type="date"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm px-2 text-gray-800"
                  />
                </div>
              </div>

              {/* Provider */}
              <div className="space-y-1">
                <span className="font-semibold text-sm text-gray-800 block">Provider</span>
                <input
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full h-[30px] bg-[#b6d3dc] rounded px-3 text-sm outline-none text-gray-800 border border-[#a6c3cc]"
                  placeholder="Provider name"
                />
              </div>

              {/* Facility */}
              <div className="space-y-1">
                <span className="font-semibold text-sm text-gray-800 block">Facility</span>
                <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                  <select
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm appearance-none pr-6 cursor-pointer text-gray-800 px-3"
                  >
                    <option value="select" disabled>select</option>
                    <option value="Clinic A">Clinic A</option>
                    <option value="Hospital B">Hospital B</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 pointer-events-none text-gray-600" />
                </div>
              </div>
             <div className="items-center gap-1 h-[30px]">
            <label className="text-sm font-medium text-gray-700">Page no</label>
              <div className="[&>div]:!w-[280px] [&>div]:!h-[30px] flex items-center gap-1">
              <PageBox value={pageTop} setValue={setPageTop} />
            </div>
          </div>
            </div>
          </div>

{/* Vitals */}
<div className="border border-blue-400 rounded-lg p-3 sm:p-4 bg-white shadow-sm">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
    <div className="flex items-center gap-2 mb-2 sm:mb-0">
      <Scale size={18} className="text-gray-600 flex-shrink-0" />
      <span className="font-semibold text-sm sm:text-[20px] text-gray-800">Vitals</span>
    </div>
    <div className="flex items-center w-full sm:w-auto">
      <button
        type="button"
        onClick={addVitalsRow}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium flex items-center gap-1 h-[30px] w-full sm:w-auto justify-center"
      >
        <Plus size={14} /> Add vitals
      </button>
    </div>
  </div>
  
  {/* Original Vitals Row - WITH TWO INDEPENDENT PAGE NO FIELDS */}
  <div className="flex flex-wrap items-end gap-2 sm:gap-3 md:gap-4 mb-2 pb-2 relative group   rounded-lg">
    {/* Height */}
    <div className="space-y-1">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700">Height</label>
      <div className="flex items-center gap-1">
        <input
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-[50px] xs:w-[55px] sm:w-[60px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        />
        <select
          value={heightUnit}
          onChange={(e) => setHeightUnit(e.target.value)}
          className="w-[45px] xs:w-[48px] sm:w-[50px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        >
          <option>CM</option>
          <option>INCH</option>
          <option>FT</option>
        </select>
      </div>
    </div>

    {/* Weight */}
    <div className="space-y-1">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700">Weight</label>
      <div className="flex items-center gap-1">
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-[50px] xs:w-[55px] sm:w-[60px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        />
        <select
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value)}
          className="w-[45px] xs:w-[48px] sm:w-[50px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        >
          <option>KG</option>
          <option>LBS</option>
        </select>
      </div>
    </div>
    
    {/* FIRST PAGE NO - AFTER WEIGHT (independent) */}
    <div className="space-y-1 ">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700">Page no</label>
      <PageBox value={pageVitals1} setValue={setPageVitals1} />
    </div>
    
    {/* BMI */}
    <div className="space-y-0.5 ">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700">BMI</label>
      <div className="[&>div]:!w-[80px] [&>div]:!h-[30px]"></div>
      <input
        value={bmi}
        onChange={(e) => setBmi(e.target.value)}
        className="w-[60px] xs:w-[65px] sm:w-[70px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
      />
    </div>

    {/* BP */}
    <div className="space-y-1 ">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700">Blood Pressure / BP</label>
      <div className="flex items-center gap-1">
        <input
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          placeholder="Dia"
          className="w-[55px] xs:w-[60px] sm:w-[65px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        />
        <input
          value={sys}
          onChange={(e) => setSys(e.target.value)}
          placeholder="Sys"
          className="w-[55px] xs:w-[60px] sm:w-[65px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        />
      </div>
    </div>

    {/* Pulse */}
    <div className="space-y-1 ">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700">Pulse</label>
      <div className="[&>div]:!w-[80px] [&>div]:!h-[30px]"></div>
      <input
        value={pulse}
        onChange={(e) => setPulse(e.target.value)}
        className="w-[60px] xs:w-[65px] sm:w-[70px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
      />
    </div>

    {/* SECOND PAGE NO - AFTER PULSE (independent) */}
    <div className="space-y-1">
      <label className="text-[10px] sm:text-xs font-medium text-gray-700">Page no</label>
      <PageBox value={pageVitals2} setValue={setPageVitals2} />
      
    </div>
  </div>

  {/* Additional Vitals Rows - WITH TWO INDEPENDENT PAGE NO FIELDS PER ROW */}
  {vitalsRows.map((row, index) => (
    <div key={index} className="flex flex-wrap items-end gap-2 sm:gap-3 md:gap-4 mb-2 pb-2 relative group   rounded-lg">
      {/* Height */}
      <div className="space-y-1 ">
        <label className="text-[10px] sm:text-xs font-medium text-gray-700">Height</label>
        <div className="flex items-center gap-1">
          <input
            value={row.height}
            onChange={(e) => updateVitalsRow(index, "height", e.target.value)}
            className="w-[50px] xs:w-[55px] sm:w-[60px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
          />
          <select
            value={row.heightUnit}
            onChange={(e) => updateVitalsRow(index, "heightUnit", e.target.value)}
            className="w-[45px] xs:w-[48px] sm:w-[50px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
          >
            <option>CM</option>
            <option>INCH</option>
            <option>FT</option>
          </select>
        </div>
      </div>

      {/* Weight */}
      <div className="space-y-1">
        <label className="text-[10px] sm:text-xs font-medium text-gray-700">Weight</label>
        <div className="flex items-center gap-1">
          <input
            value={row.weight}
            onChange={(e) => updateVitalsRow(index, "weight", e.target.value)}
            className="w-[50px] xs:w-[55px] sm:w-[60px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
          />
          <select
            value={row.weightUnit}
            onChange={(e) => updateVitalsRow(index, "weightUnit", e.target.value)}
            className="w-[45px] xs:w-[48px] sm:w-[50px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
          >
            <option>KG</option>
            <option>LB</option>
          </select>
        </div>
      </div>
      
      {/* FIRST PAGE NO - AFTER WEIGHT (independent for this row) */}
      <div className="space-y-1 ">
        <label className="text-[10px] sm:text-xs font-medium text-gray-700">Page no</label>
        <PageBox 
          value={row.pageNo1} 
          setValue={(val) => {
            const newValue = typeof val === 'function' ? val(row.pageNo1) : val;
            updateVitalsRow(index, "pageNo1", newValue);
          }} 
        />
      </div>

      {/* BMI */}
      <div className="space-y-1">
        <label className="text-[10px] sm:text-xs font-medium text-gray-700">BMI</label>
        <div className="[&>div]:!w-[80px] [&>div]:!h-[30px]"></div>
        <input
          value={row.bmi}
          onChange={(e) => updateVitalsRow(index, "bmi", e.target.value)}
          className="w-[60px] xs:w-[65px] sm:w-[70px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        />
      </div>

      {/* BP */}
      <div className="space-y-1 ">
        <label className="text-[10px] sm:text-xs font-medium text-gray-700">Blood Pressure / BP</label>
        <div className="flex items-center gap-1">
          <input
            value={row.dia}
            onChange={(e) => updateVitalsRow(index, "dia", e.target.value)}
            placeholder="Dia"
            className="w-[55px] xs:w-[60px] sm:w-[65px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
          />
          <input
            value={row.sys}
            onChange={(e) => updateVitalsRow(index, "sys", e.target.value)}
            placeholder="Sys"
            className="w-[55px] xs:w-[60px] sm:w-[65px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
          />
        </div>
      </div>

      {/* Pulse */}
      <div className="space-y-1 ">
        <label className="text-[10px] sm:text-xs font-medium text-gray-700">Pulse</label>
        <div className="[&>div]:!w-[80px] [&>div]:!h-[30px]"></div>
        <input
          value={row.pulse}
          onChange={(e) => updateVitalsRow(index, "pulse", e.target.value)}
          className="w-[60px] xs:w-[65px] sm:w-[70px] h-[28px] sm:h-[30px] bg-[#b6d3dc] rounded px-1 sm:px-2 text-xs sm:text-sm outline-none border border-[#a6c3cc]"
        />
      </div>

      {/* SECOND PAGE NO - AFTER PULSE (independent for this row) */}
      <div className="space-y-1 ">
        <label className="text-[10px] sm:text-xs font-medium text-gray-700">Page no</label>
        
        <PageBox 
          value={row.pageNo2} 
          setValue={(val) => {
            const newValue = typeof val === 'function' ? val(row.pageNo2) : val;
            updateVitalsRow(index, "pageNo2", newValue);
          }} 
        />
      </div>

      {/* Delete Row Button */}
      <button
        type="button"
        onClick={() => removeVitalsRow(index)}
        className="pr-6 px-5 hover:bg-red-200 text-red-600 rounded transition-colors w-fit absolute right-0 top-10 duration-200  "
       
      >
        <Trash2 size={20} />
      </button>
    </div>
  ))}
</div>
          {/* Text Blocks */}
          {fields.map((title) => (
            <Block
              key={title}
              title={title}
              value={data[title] || ""}
              onChange={(v: string) => setData({ ...data, [title]: v })}
              
            
              minHeight={95}
              hideIcon={true}
            />
          ))}

          {/* Medication */}
          <div className="border border-blue-400 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 ">
              <span className="font-semibold text-[15px] text-gray-800">Medication</span>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <div className="flex items-center gap-1">
                </div>
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1 h-[30px] "
                >
                  <Plus size={16} /> Add Medication
                </button>
              </div>
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm italic">No medications added</div>
            ) : (
              <div className="space-y-3">
                {rows.map((row, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-40 items-center">
                    <input
                      value={row.db}
                      onChange={(e) => updateRow(i, "db", e.target.value)}
                      className="bg-[#f3f5f6] px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-[180px]"
                      placeholder="Drug/Brand"
                    />
                    <input
                      value={row.dose}
                      onChange={(e) => updateRow(i, "dose", e.target.value)}
                      className="bg-[#f3f5f6] px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-[180px]"
                      placeholder="Dose"
                    />
                    <input
                      value={row.freq}
                      onChange={(e) => updateRow(i, "freq", e.target.value)}
                      className="bg-[#f3f5f6] px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-[180px]"
                      placeholder="Frequency"
                    />
                    <input
                      value={row.cmt}
                      onChange={(e) => updateRow(i, "cmt", e.target.value)}
                      className="bg-[#f3f5f6] px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-[180px] "
                      placeholder="Comments"
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="px-2 h-[34px] bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors   "
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Plan/Recommendation and Work Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Block
              title="Plan/Recommendation"
              value={planRecommendation}
              onChange={setPlanRecommendation}
              
              
              minHeight={95}
              hideIcon={true}
            />
            <Block
              title="Work Status"
              value={workStatus}
              onChange={setWorkStatus}
            
              
              minHeight={95}
              hideIcon={true}
            />
          </div>

          {/* Special Comments */}
          <Block
            title="Special Comments"
            value={specialComments}
            onChange={setSpecialComments}
           
            minHeight={95}
            hideIcon={true}
          />
        </div>
      </div>
   
  );
}