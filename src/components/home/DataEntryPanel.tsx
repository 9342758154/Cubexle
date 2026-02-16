import React, { useState, useCallback } from "react";
import {
  ChevronDown,
  Upload,
  ArrowUpDown,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

// PAGE INPUT COMPONENT
interface PageBoxProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}
const PageBox: React.FC<PageBoxProps> = ({ value, setValue }) => {
  const increment = useCallback(() => setValue(prev => prev + 1), [setValue]);
  const decrement = useCallback(() => setValue(prev => Math.max(0, prev - 1)), [setValue]);

  return (
    <div className="flex bg-[#b6d3dc] rounded overflow-hidden w-[90px] h-[30px]">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
        className="w-full text-center bg-transparent outline-none text-sm px-1"
      />
      <div className="flex flex-col border-l border-[#a6c3cc]">
        <button type="button" className="px-1 py-0.5 hover:bg-[#a6c3cc] flex items-center justify-center" onClick={increment}>
          <Plus size={12} />
        </button>
        <button type="button" className="px-1 py-0.5 hover:bg-[#a6c3cc] flex items-center justify-center" onClick={decrement}>
          <Minus size={12} />
        </button>
      </div>
    </div>
  );
};

// SECTION HEADER COMPONENT
interface HeaderProps {
  title: string;
  onUpload?: () => void;
  onSort?: () => void;
  onDelete?: () => void;
}
const Header: React.FC<HeaderProps> = ({ title, onUpload, onSort, onDelete }) => (
  <div className="flex justify-between items-center mb-1">
    <span className="font-semibold text-[15px] text-gray-800">{title}</span>
    <div className="flex gap-1">
      {onUpload && <Upload size={16} className="text-green-600 cursor-pointer hover:opacity-80" onClick={onUpload} />}
      {onSort && <ArrowUpDown size={16} className="text-blue-600 cursor-pointer hover:opacity-80" onClick={onSort} />}
      {onDelete && <Trash2 size={16} className="text-red-500 cursor-pointer hover:opacity-80" onClick={onDelete} />}
    </div>
  </div>
);

// TEXT BLOCK COMPONENT
interface BlockProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onUpload?: () => void;
  onSort?: () => void;
  onDelete?: () => void;
}
const Block: React.FC<BlockProps> = ({ title, value, onChange, onUpload, onSort, onDelete }) => (
  <div className="border-2 border-blue-400 rounded-lg p-4 bg-white">
    <Header title={title} onUpload={onUpload} onSort={onSort} onDelete={onDelete} />
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[95px] border border-gray-300 rounded-lg bg-[#f3f5f6] p-3 resize-none outline-none focus:border-blue-400 custom-scroll text-sm"
      placeholder={`Enter ${title.toLowerCase()}...`}
    />
  </div>
);

const DataEntryPanel: React.FC = () => {
  // PAGE NUMBERS
  const [pageTop, setPageTop] = useState<number>(0);
  const [pageVitals, setPageVitals] = useState<number>(0);

  // TOP PANEL FIELDS
  const [notesType, setNotesType] = useState<string>("select");
  const [dos, setDos] = useState<string>("");
  const [doi, setDoi] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [facility, setFacility] = useState<string>("select");

  // VITALS
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<string>("");
  const [dia, setDia] = useState<string>("");
  const [sys, setSys] = useState<string>("");
  const [pulse, setPulse] = useState<string>("");

  // TEXT SECTIONS
  const fields = [
    "CC/HOPI",
    "Past Medical History",
    "Past Surgical History",
    "Previous Hospitalization records",
    "Previous Lab/Reports",
    "Review of System",
    "Physical Examination/ Scores",
    "Assessment",
    "Plan/Recommendation",
    "Work Status",
    "Special Comments",
  ] as const;

  type FieldKey = typeof fields[number];
  const [data, setData] = useState<Record<FieldKey, string>>(
    Object.fromEntries(fields.map((f) => [f, ""])) as Record<FieldKey, string>
  );

  // MEDICATION
  interface MedicationRow {
    db: string;
    dose: string;
    freq: string;
    cmt: string;
  }
  const [rows, setRows] = useState<MedicationRow[]>([]);

  const addRow = useCallback(() => {
    setRows(prev => [...prev, { db: "", dose: "", freq: "", cmt: "" }]);
  }, []);

  const removeRow = useCallback((i: number) => {
    setRows(prev => prev.filter((_, idx) => idx !== i));
  }, []);

  const updateRow = useCallback((
    i: number, 
    key: keyof MedicationRow, 
    value: string
  ) => {
    setRows(prev => {
      const copy = [...prev];
      copy[i][key] = value;
      return copy;
    });
  }, []);

  // ACTIONS
  const deleteAll = useCallback(() => {
    if (window.confirm("Delete all data? This cannot be undone.")) {
      setNotesType("select");
      setDos(""); setDoi(""); setProvider("");
      setFacility("select");
      setHeight(""); setWeight(""); setBmi("");
      setDia(""); setSys(""); setPulse("");
      setRows([]);
      setData(Object.fromEntries(fields.map((f) => [f, ""])) as Record<FieldKey, string>);
      setPageTop(0);
      setPageVitals(0);
    }
  }, [fields]);

  const resetAll = useCallback(() => {
    if (window.confirm("Reset all data?")) {
      setPageTop(0);
      setPageVitals(0);
      deleteAll();
    }
  }, [deleteAll]);

  const saveData = useCallback(() => {
    const allData = {
      pageTop, notesType, dos, doi, provider, facility, pageVitals,
      vitals: { height, weight, bmi, dia, sys, pulse },
      notes: data,
      medication: rows,
    };
    console.log("✅ SAVED DATA:", allData);
    alert("✅ Data saved successfully!");
  }, [pageTop, notesType, dos, doi, provider, facility, pageVitals, height, weight, bmi, dia, sys, pulse, data, rows]);

  // EVENT HANDLERS
  const handleUpload = useCallback(() => alert("📁 Upload file"), []);
  const handleSort = useCallback(() => alert("🔄 Sort data"), []);
  const handleBlockDelete = useCallback((title: FieldKey) => {
    if (window.confirm(`🗑️ Delete ${title}?`)) {
      setData(prev => ({ ...prev, [title]: "" }));
    }
  }, []);

  return (
    <div className="h-screen bg-[#e6e7e8] flex flex-col font-sans min-h-screen">
      {/* 🆕 NEW HEADER WITH BUTTONS - TOP OF PAGE */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg border-b-4 border-blue-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">📋 Medical Data Entry</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={deleteAll}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Trash2 size={18} /> Delete
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              🔄 Reset
            </button>
            <button
              type="button"
              onClick={saveData}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              💾 Save Record
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SCROLL CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll scrollbar-thin scrollbar-thumb-[#c1c7cd] scrollbar-track-[#f1f5f9]">
        
        {/* 🟦 TOP PANEL - 3x2 GRID */}
        <div className="border-2 border-blue-400 rounded-lg p-4 bg-white grid grid-cols-3 gap-4 shadow-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 block">Notes Type</label>
            <div className="flex items-center bg-[#b6d3dc] rounded px-3 h-[30px]">
              <span className="flex-1 text-sm truncate">{notesType}</span>
              <ChevronDown size={14} className="ml-1 text-gray-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 block">(DOS) Date of service</label>
            <input 
              type="date" 
              value={dos}
              onChange={(e) => setDos(e.target.value)}
              className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 focus:ring-2 focus:ring-blue-200 transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 block">DOI (Date of injury)</label>
            <input 
              type="date" 
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 focus:ring-2 focus:ring-blue-200 transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 block">Provider Name</label>
            <input 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 focus:ring-2 focus:ring-blue-200 transition-all" 
              placeholder="Enter provider name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 block">Facility</label>
            <div className="flex items-center bg-[#b6d3dc] rounded px-3 h-[30px]">
              <span className="flex-1 text-sm truncate">{facility}</span>
              <ChevronDown size={14} className="ml-1 text-gray-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 block">Page no</label>
            <PageBox value={pageTop} setValue={setPageTop} />
          </div>
        </div>

        {/* 🟦 VITALS PANEL */}
        <div className="border-2 border-blue-400 rounded-lg p-4 bg-white shadow-sm">
          <Header title="VITALS" onUpload={handleUpload} onSort={handleSort} />
          <div className="grid grid-cols-6 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">Height</label>
              <input value={height} onChange={(e) => setHeight(e.target.value)} className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 focus:ring-2 focus:ring-blue-200 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">Weight</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 focus:ring-2 focus:ring-blue-200 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">BMI</label>
              <input value={bmi} onChange={(e) => setBmi(e.target.value)} className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 focus:ring-2 focus:ring-blue-200 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">Blood Pressure (BP)</label>
              <div className="flex gap-1">
                <input value={dia} onChange={(e) => setDia(e.target.value)} placeholder="Dia" className="flex-1 h-[30px] w-[20px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 transition-all" />
                <input value={sys} onChange={(e) => setSys(e.target.value)} placeholder="Sys" className="flex-1 h-[30px] w-[20px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">HR/Pulse</label>
              <input value={pulse} onChange={(e) => setPulse(e.target.value)} className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none focus:border-blue-400 focus:border-2 focus:ring-2 focus:ring-blue-200 transition-all" />
            </div>
            <div className="space-y-1 pt-0">
              <label className="text-xs font-medium text-gray-700 block">Page no</label>
              <PageBox value={pageVitals} setValue={setPageVitals} />
            </div>
          </div>
        </div>

        {/* 🟦 TEXT BLOCKS */}
        {fields.map((title) => (
          <Block
            key={title}
            title={title}
            value={data[title]}
            onChange={(v) => setData(prev => ({ ...prev, [title]: v }))}
            onUpload={handleUpload}
            onSort={handleSort}
            onDelete={() => handleBlockDelete(title)}
          />
        ))}

        {/* 🟦 MEDICATION TABLE */}
        <div className="border-2 border-blue-400 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-800">Medication</span>
            <button 
              type="button"
              onClick={addRow} 
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              + Add Medication
            </button>
          </div>

          {rows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">💊</div>
              <p className="text-lg font-medium">No medications added</p>
              <p className="text-sm">Click "Add Medication" to get started</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 font-semibold text-sm mb-4 text-gray-700 border-b-2 border-gray-200 pb-3 uppercase tracking-wide">
                <span>Database</span>
                <span>Dosage</span>
                <span>Frequency</span>
                <span>Comment</span>
              </div>
              {rows.map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 items-end mb-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    value={row.db}
                    onChange={(e) => updateRow(i, "db", e.target.value)}
                    className="bg-[#f3f5f6] px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
                    placeholder="Medication name"
                  />
                  <input
                    value={row.dose}
                    onChange={(e) => updateRow(i, "dose", e.target.value)}
                    className="bg-[#f3f5f6] px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
                    placeholder="e.g. 500mg"
                  />
                  <input
                    value={row.freq}
                    onChange={(e) => updateRow(i, "freq", e.target.value)}
                    className="bg-[#f3f5f6] px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
                    placeholder="e.g. BID"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      value={row.cmt}
                      onChange={(e) => updateRow(i, "cmt", e.target.value)}
                      className="flex-1 bg-[#f3f5f6] px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
                      placeholder="Notes"
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="p-2.5 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center hover:scale-105"
                      title="Remove row"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 🎨 BOTTOM FOOTER (KEEP AS BACKUP) */}
      <div className="bg-white border-t-4 border-blue-200 px-10 py-6 flex justify-between items-center shadow-2xl">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={deleteAll}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 active:scale-95 min-w-[120px]"
          >
            🗑️ Delete
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 active:scale-95 min-w-[120px]"
          >
            🔄 Reset
          </button>
        </div>
        <button
          type="button"
          onClick={saveData}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-14 py-4 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 active:scale-95 min-w-[150px]"
        >
          💾 Save Record
        </button>
      </div>

      {/* 🎨 CUSTOM SCROLLBAR */}
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #c1c7cd #f1f5f9;
        }
        .custom-scroll::-webkit-scrollbar,
        .custom-scroll::-webkit-scrollbar-track {
          width: 8px;
          height: 8px;
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #c1c7cd, #9ca3af);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #9ca3af, #6b7280);
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        textarea.custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: #c1c7cd #f8fafc;
        }
        html {
          scrollbar-width: thin;
        }
      `}</style>
    </div>
  );
};

export default DataEntryPanel;
