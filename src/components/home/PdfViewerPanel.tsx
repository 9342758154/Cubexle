import {
  Maximize2,
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  BarChart3,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

const PdfViewerPanel = () => {
  return (
    <div className="flex flex-col h-full border-r border-border">
      {/* Document search bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-card">
        <input
          type="text"
          placeholder="Document Name or No"
          className="form-input-clinical flex-1"
        />
        <div className="flex items-center gap-1 border border-border rounded px-3 h-8 bg-card text-sm">
          <span>Status</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* PDF Toolbar */}
      <div className="flex items-center gap-1 p-1.5 border-b border-border bg-toolbar-bg">
        <button className="toolbar-button">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="toolbar-button">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button className="toolbar-button">
          <Minus className="w-4 h-4" />
        </button>
        <button className="toolbar-button">
          <Plus className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 ml-4">
          <button className="toolbar-button">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm px-2">1 - 100</span>
          <button className="toolbar-button">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <input
            type="text"
            className="w-12 h-7 text-center text-sm border border-border rounded bg-card"
          />
          <span className="text-sm text-muted-foreground">of 3</span>
        </div>
        <button className="toolbar-button ml-auto">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left icon sidebar */}
        <div className="flex flex-col gap-2 p-2 border-r border-border bg-section-bg w-16 items-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Filter</span>
            <button className="toolbar-button">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <button className="toolbar-button w-10 h-10">
              <BarChart3 className="w-5 h-5" />
            </button>
            <button className="toolbar-button w-10 h-10 mt-1">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4">
            <button className="toolbar-button w-10 h-10">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button className="toolbar-button w-10 h-10 mt-1">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-auto mb-2">
            <button className="toolbar-button">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer area */}
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 flex items-start justify-center p-6">
            <div className="w-full max-w-xl bg-card border border-border rounded shadow-sm">
              <div className="h-48 flex items-center justify-center border-b border-border bg-muted/50">
                <span className="text-xl text-muted-foreground font-medium">
                  PDF Viewer
                </span>
              </div>
              {/* Placeholder lines */}
              <div className="p-6 space-y-3">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-muted rounded"
                    style={{ width: `${60 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right thumbnail sidebar */}
        <div className="w-28 border-l border-border bg-section-bg p-2 flex flex-col gap-2 overflow-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-muted rounded border border-border"
            />
          ))}
        </div>

        {/* Scroll bar label */}
        <div className="w-6 bg-muted flex items-center justify-center border-l border-border">
          <span className="text-xs text-muted-foreground writing-mode-vertical rotate-180 [writing-mode:vertical-rl]">
            Scroll bar
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerPanel;
