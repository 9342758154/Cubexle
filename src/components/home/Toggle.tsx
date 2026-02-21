// components/home/CenterToggle.tsx
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  position?: 'left' | 'right';
}

const Toggle = ({ isOpen, onToggle, position = 'left' }: ToggleProps) => {
  return (
    <div 
      className={`flex items-center justify-center w-6 bg-muted border-x border-border cursor-pointer hover:bg-accent transition-colors h-full`}
      onClick={onToggle}
    >
      {position === 'left' ? (
        isOpen ? <ChevronLeft className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
      ) : (
        isOpen ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
};

export default Toggle;