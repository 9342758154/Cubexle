// src/pages/Index.tsx (Flexible version - menu slides from either side)
import { useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import PdfViewerPanel from "@/components/home/PdfViewerPanel";
import DataEntryPanel from "@/components/home/DataEntryPanel";
import Toggle from "@/components/home/Toggle";
import SideMenu from "@/components/home/SideMenu";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSide, setMenuSide] = useState<'left' | 'right'>('right'); // Change this to switch sides

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <AppLayout>
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

        {/* Right - Data Entry */}
        <div className={`${isMenuOpen && menuSide === 'right' ? 'flex-1' : 'flex-1'} h-full flex gap-1 transition-all duration-300 px-3`}>
          <div className="flex-1">
            <DataEntryPanel />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;