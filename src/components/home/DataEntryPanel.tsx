import {
  RotateCcw,
  Save,
  ChevronDown,
  Calendar,
  FileText,
  Clock,
  Scissors,
  Building2,
  FlaskConical,
  Stethoscope,
  Dumbbell,
  ClipboardList,
  ChevronsUpDown,
  FileUp,
  Trash2,
} from "lucide-react";

const SectionHeader = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium text-foreground">{label}</span>
  </div>
);

const DataEntryPanel = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Action bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-card">
        <button className="nav-button-primary flex items-center gap-1.5 text-xs">
          View Report
        </button>
        <button className="nav-button-outline flex items-center gap-1.5 text-xs">
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-success text-success-foreground hover:opacity-90 transition-colors">
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
        <div className="ml-auto flex items-center gap-1 border border-border rounded px-3 py-1 text-sm bg-card">
          <ChevronDown className="w-4 h-4" />
          <span>Status</span>
        </div>
      </div>

      {/* Menu for Date */}
      <div className="px-3 py-2 border-b border-border bg-section-bg">
        <span className="text-sm font-medium">Menu For Date</span>
      </div>

      {/* Scrollable form content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {/* Notes Type / DOS / DOI row */}
          <div className="section-card">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Notes Type
                </label>
                <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-muted-foreground">Select</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  (DOS)Date of service
                </label>
                <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-muted-foreground">
                    mm/dd/yyyy
                  </span>
                  <Calendar className="w-3 h-3" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  DOI
                </label>
                <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-muted-foreground">
                    mm/dd/yyyy
                  </span>
                  <Calendar className="w-3 h-3" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Provider Name
                </label>
                <input
                  type="text"
                  className="form-input-clinical w-full"
                  placeholder=""
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Facility
                </label>
                <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-muted-foreground">Select</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  page no
                </label>
                <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-muted-foreground"></span>
                  <ChevronsUpDown className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* VITALS */}
          <div className="section-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">VITALS</span>
              <div className="flex gap-1">
                <button className="toolbar-button w-7 h-7">
                  <FileUp className="w-3.5 h-3.5 text-success" />
                </button>
                <button className="toolbar-button w-7 h-7">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Height
                </label>
                <div className="flex gap-1">
                  <input className="form-input-clinical w-full" />
                  <div className="form-input-clinical flex items-center gap-0.5 text-xs px-1 whitespace-nowrap">
                    CM
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Weight
                </label>
                <div className="flex gap-1">
                  <input className="form-input-clinical w-full" />
                  <div className="form-input-clinical flex items-center gap-0.5 text-xs px-1 whitespace-nowrap">
                    KG
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  BMI
                </label>
                <input className="form-input-clinical w-full" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Blood Pressure(BP)
                </label>
                <div className="flex gap-1">
                  <input
                    className="form-input-clinical w-full"
                    placeholder="Dia"
                  />
                  <input
                    className="form-input-clinical w-full"
                    placeholder="Sys"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  HR/Pulse
                </label>
                <input className="form-input-clinical w-full" />
              </div>
            </div>
          </div>

          {/* CC/HOPI */}
          <div>
            <SectionHeader icon={FileText} label="CC/HOPI" />
            <div className="section-card min-h-[60px]">
              <div className="flex items-center justify-center h-12 text-muted-foreground text-sm">
                Data Page
              </div>
            </div>
          </div>

          {/* Past Medical History */}
          <div>
            <SectionHeader icon={Clock} label="Past Medical History" />
            <div className="section-card min-h-[50px]" />
          </div>

          {/* Past Surgical History */}
          <div>
            <SectionHeader icon={Scissors} label="Past Surgical History" />
            <div className="section-card min-h-[50px]" />
          </div>

          {/* Previous Hospitalization records */}
          <div>
            <SectionHeader
              icon={Building2}
              label="Previous Hospitalization records"
            />
            <div className="section-card min-h-[50px]" />
          </div>

          {/* Previous Lab/Reports */}
          <div>
            <SectionHeader icon={FlaskConical} label="Previous Lab/Reports" />
            <div className="section-card min-h-[50px]" />
          </div>

          {/* Review of System */}
          <div>
            <SectionHeader icon={Stethoscope} label="Review of System" />
            <div className="section-card min-h-[50px]" />
          </div>

          {/* Physical Examination / Scores */}
          <div>
            <SectionHeader
              icon={Dumbbell}
              label="Physical Examination/ Scores"
            />
            <div className="section-card min-h-[50px]" />
          </div>
        </div>
      </div>

      {/* Right scroll bar label */}
    </div>
  );
};

export default DataEntryPanel;
