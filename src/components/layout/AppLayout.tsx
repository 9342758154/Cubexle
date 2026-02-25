// src/components/layout/AppLayout.tsx
import React from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

// Define the panel type
type PanelType = 'ov' | 'diagnostics' | 'labs' | 'ekg';

// Update the interface to include all props
interface AppLayoutProps {
  children: React.ReactNode;
  onPanelChange?: (panel: PanelType) => void;  // Add this
  activePanel?: PanelType;                       // Add this
  showNavbar?: boolean;
}

const AppLayout = ({ 
  children, 
  onPanelChange, 
  activePanel, 
  showNavbar = true 
}: AppLayoutProps) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showNavbar && (
        <TopNavbar 
          onPanelChange={onPanelChange}
          activePanel={activePanel}
        />
      )}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;