// src/pages/Index.tsx
import { useState } from 'react';
import AppLayout from "@/components/layout/AppLayout"; // Change this
import PdfViewerPanel from "@/components/home/PdfViewerPanel";
import OVPanel from "@/components/Datapanel/OVPanel";
import DiagnosticsPanel from "@/components/Datapanel/DiagnosticsPanel";
import LabsPanel from "@/components/Datapanel/LabsPanel";
import EKGPanel from "@/components/Datapanel/EKGPanel";
import Toggle from "@/components/home/Toggle";
import SideMenu from "@/components/home/SideMenu";

// Define the panel types
type PanelType = 'ov' | 'diagnostics' | 'labs' | 'ekg';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSide, setMenuSide] = useState<'left' | 'right'>('right');
  const [activePanel, setActivePanel] = useState<PanelType>('ov');

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to render the appropriate panel based on activePanel
  const renderRightPanel = () => {
    switch(activePanel) {
      case 'ov':
        return <OVPanel />;
      case 'diagnostics':
        return <DiagnosticsPanel />;
      case 'labs':
        return <LabsPanel />;
      case 'ekg':
        return <EKGPanel />;
      default:
        return <OVPanel />;
    }
  };

  // This function will be passed to the navbar to update the panel
  const handlePanelChange = (panel: PanelType) => {
    setActivePanel(panel);
  };

  return (
    <AppLayout 
      onPanelChange={handlePanelChange}
      activePanel={activePanel}
    >
      <div className="flex h-full">
        {/* Left - PDF Viewer */}
        <div className={`${isMenuOpen && menuSide === 'left' ? 'w-1/3' : 'w-1/2'} h-full transition-all duration-300`}>
          <PdfViewerPanel />
        </div>

        {/* Menu on Left Side (if selected) */}
        {menuSide === 'left' && <SideMenu isOpen={isMenuOpen} side="left" />}

        {/* Toggle Button */}
        <Toggle 
          isOpen={isMenuOpen} 
          onToggle={handleToggle} 
          position={menuSide === 'left' ? 'right' : 'left'} 
        />

        {/* Menu on Right Side (if selected) */}
        {menuSide === 'right' && <SideMenu isOpen={isMenuOpen} side="right" />}

        {/* Right - Dynamic Data Entry Panel */}
        <div className={`${isMenuOpen && menuSide === 'right' ? 'flex-1' : 'flex-1'} h-full flex gap-1 transition-all duration-300 px-3 overflow-y-auto`}>
          <div className="flex-1">
            {renderRightPanel()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;