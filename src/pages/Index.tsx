import AppLayout from "@/components/layout/AppLayout";
import PdfViewerPanel from "@/components/home/PdfViewerPanel";
import DataEntryPanel from "@/components/home/DataEntryPanel";
import { ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Left - PDF Viewer */}
        <div className="w-1/2 h-full">
          <PdfViewerPanel />
        </div>

        {/* Center toggle */}
        <div className="flex items-center justify-center w-6 bg-muted border-x border-border cursor-pointer hover:bg-accent transition-colors">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Right - Data Entry */}
        <div className="flex-1 h-full flex">
          <div className="flex-1">
            <DataEntryPanel />
          </div>
          {/* Right scroll bar label */}
          <div className="w-6 bg-muted flex items-center justify-center border-l border-border">
            <span className="text-xs text-muted-foreground [writing-mode:vertical-rl] rotate-180">
              Scroll bar
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
