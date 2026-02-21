// components/home/SideMenu.tsx
import { useState } from 'react';
import { Calendar, FileText, ChevronRight, Search } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  side?: 'left' | 'right';
  onItemSelect?: (item: { date: string; pageNo: string }) => void;
}

const SideMenu = ({ isOpen, side = 'left', onItemSelect }: SideMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const menuItems = [
    { date: 'dd-mm-yyyy', pageNo: '1' },
    { date: 'dd-mm-yyyy', pageNo: '2' },
    { date: 'dd-mm-yyyy', pageNo: '3' },
    { date: 'dd-mm-yyyy', pageNo: '4' },
    { date: 'dd-mm-yyyy', pageNo: '5' },
    { date: 'dd-mm-yyyy', pageNo: '6' },
    { date: 'dd-mm-yyyy', pageNo: '7' },
    { date: 'dd-mm-yyyy', pageNo: '8' },
  ];

  // Filter items based on search
  const filteredItems = menuItems.filter(item => 
    item.date.includes(searchTerm) || 
    item.pageNo.includes(searchTerm)
  );

  const handleItemClick = (item: { date: string; pageNo: string }, index: number) => {
    setSelectedIndex(index);
    onItemSelect?.(item);
    console.log('Selected:', item);
  };

  return (
    <div className={`w-50 h-full bg-gradient-to-b from-background to-muted/20 ${side === 'left' ? 'border-r' : 'border-l'} border-border overflow-y-auto shadow-xl`}>
      <div className="p-4">
        {/* Header with icon */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Date & Page Menu</h3>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by date or page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-muted rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-3 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
          <span>📋 {filteredItems.length} entries</span>
          <span>📄 Total pages: {filteredItems.reduce((acc, item) => acc + parseInt(item.pageNo), 0)}</span>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-2 gap-2 mb-2 pb-2 border-b-2 border-primary/20 bg-primary/5 p-2 rounded-t-lg">
          <div className="font-semibold text-xs text-primary flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Date
          </div>
          <div className="font-semibold text-xs text-primary flex items-center gap-1 justify-center">
            <FileText className="w-3 h-3" />
            Page No
          </div>
        </div>

        {/* Table Body */}
        <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto custom-scroll pr-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const originalIndex = menuItems.findIndex(
                mi => mi.date === item.date && mi.pageNo === item.pageNo
              );
              const isSelected = selectedIndex === originalIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item, originalIndex)}
                  className={`w-full grid grid-cols-2 gap-2 rounded-md px-3 py-2.5 
                    transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    group relative overflow-hidden
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-accent hover:shadow-sm'
                    }`}
                >
                  {/* Hover effect background */}
                  <div className={`absolute inset-0 ${isSelected ? 'bg-primary' : 'bg-gradient-to-r from-transparent to-transparent group-hover:from-primary/5 group-hover:to-transparent'} transition-all duration-300`} />
                  
                  {/* Date column - left aligned */}
                  <div className={`relative text-sm text-left font-medium flex items-center 
                    ${isSelected ? 'text-primary-foreground' : 'text-foreground group-hover:text-primary'}`}
                  >
                    <Calendar className={`w-3 h-3 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                    <span className="truncate">{item.date}</span>
                  </div>
                  
                  {/* Page No column - perfectly centered */}
                  <div className={`relative text-sm font-bold flex items-center justify-center
                    ${isSelected ? 'text-primary-foreground' : 'text-foreground group-hover:text-primary'}`}
                  >
                    <span className=" px-2 py-0.5 rounded-full group-hover:bg-primary/20 transition-colors">
                      {item.pageNo}
                    </span>
                  </div>

                  {/* Optional right arrow indicator on hover */}
                  <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 
                    opacity-0 group-hover:opacity-100 transition-opacity
                    ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No matching items</p>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Click to select
          </span>
          {selectedIndex !== null && (
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Selected: Page {menuItems[selectedIndex]?.pageNo}
            </span>
          )}
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default SideMenu;