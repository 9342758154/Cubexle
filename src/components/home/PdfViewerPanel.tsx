import React, { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  RotateCcw,
  FileSearch,
  PanelRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Printer,
  Settings,
  Sun,
  Moon,
  Star,
  X,
  Search,
  Clock,
  ArrowDown,
  ArrowUp,
  Grid,
  LayoutGrid,
  LayoutList,
  RotateCw,
  Ruler,
  ScanLine,
  Type,
} from "lucide-react";

// Page size options
type PageSize = 'A4' | 'A3' | 'A2' | 'A1' | 'A0' | 'Letter' | 'Legal' | 'Custom';

interface PageSizeDimensions {
  width: number;
  height: number;
  unit: 'px' | 'mm' | 'in';
}

interface EditableText {
  id: string;
  content: string;
  pageNum: number;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

interface OCRResult {
  pageNum: number;
  text: string;
  confidence: number;
}

const PAGE_SIZE_DIMENSIONS: Record<Exclude<PageSize, 'Custom'>, PageSizeDimensions> = {
  'A4': { width: 595, height: 842, unit: 'px' },
  'A3': { width: 842, height: 1191, unit: 'px' },
  'A2': { width: 1191, height: 1684, unit: 'px' },
  'A1': { width: 1684, height: 2384, unit: 'px' },
  'A0': { width: 2384, height: 3370, unit: 'px' },
  'Letter': { width: 612, height: 792, unit: 'px' },
  'Legal': { width: 612, height: 1008, unit: 'px' },
};

const PdfViewerPanel = () => {
  // Core states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(11);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'double' | 'continuous'>('single');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [filterOption, setFilterOption] = useState<'none' | 'lowToHigh' | 'highToLow'>('none');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [recentPages, setRecentPages] = useState<number[]>([]);
  const [starredPages, setStarredPages] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Manual page search states
  const [isPageSearchOpen, setIsPageSearchOpen] = useState(false);
  const pageSearchInputRef = useRef<HTMLInputElement>(null);
  
  // Search states
  const [pageSearchInput, setPageSearchInput] = useState('');
  const [pageSearchResults, setPageSearchResults] = useState<number[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // OCR states
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
  const [ocrText, setOcrText] = useState('');
  const [showOCRPanel, setShowOCRPanel] = useState(false);
  
  // Page size states
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [customWidth, setCustomWidth] = useState(595);
  const [customHeight, setCustomHeight] = useState(842);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  
  // Editable text states
  const [editableTexts, setEditableTexts] = useState<EditableText[]>([]);
  const [currentFontSize, setCurrentFontSize] = useState(14);
  const [currentFontWeight, setCurrentFontWeight] = useState<'normal' | 'bold'>('normal');
  const [currentFontStyle, setCurrentFontStyle] = useState<'normal' | 'italic'>('normal');
  const [currentTextAlign, setCurrentTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editAreaRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Page size handling functions - DEFINE THESE EARLY
  const getCurrentPageDimensions = () => {
    if (pageSize === 'Custom') {
      return { width: customWidth, height: customHeight };
    }
    return PAGE_SIZE_DIMENSIONS[pageSize];
  };

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size);
    if (size !== 'Custom') {
      const dims = PAGE_SIZE_DIMENSIONS[size];
      setCustomWidth(dims.width);
      setCustomHeight(dims.height);
    }
    setIsSizeDropdownOpen(false);
  };

  const handleCustomSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (dimension === 'width') {
      setCustomWidth(value);
      if (maintainAspectRatio) {
        const aspect = PAGE_SIZE_DIMENSIONS.A4.height / PAGE_SIZE_DIMENSIONS.A4.width;
        setCustomHeight(Math.round(value * aspect));
      }
    } else {
      setCustomHeight(value);
      if (maintainAspectRatio) {
        const aspect = PAGE_SIZE_DIMENSIONS.A4.width / PAGE_SIZE_DIMENSIONS.A4.height;
        setCustomWidth(Math.round(value * aspect));
      }
    }
  };

  // Get page dimensions for display - DEFINE THIS AFTER THE FUNCTIONS IT USES
  const pageDims = getCurrentPageDimensions();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setIsThumbnailOpen(false);
      } else if (window.innerWidth < 1024) {
        setIsSidebarOpen(true);
        setIsThumbnailOpen(false);
      } else {
        setIsSidebarOpen(true);
        setIsThumbnailOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (sizeRef.current && !sizeRef.current.contains(event.target as Node)) {
        setIsSizeDropdownOpen(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus page search input
  useEffect(() => {
    if (isPageSearchOpen && pageSearchInputRef.current) {
      pageSearchInputRef.current.focus();
    }
  }, [isPageSearchOpen]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Page navigation functions
  const handlePrevPage = () => {
    if (viewMode === 'double') {
      setCurrentPage(prev => Math.max(prev - 2, 1));
    } else {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
    updateRecentPages();
  };

  const handleNextPage = () => {
    if (viewMode === 'double') {
      setCurrentPage(prev => Math.min(prev + 2, totalPages - 1));
    } else {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }
    updateRecentPages();
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= totalPages) {
      setCurrentPage(value);
      updateRecentPages();
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));

  // Rotate page
  const handleRotate = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setRotationAngle(prev => prev - 90);
    } else {
      setRotationAngle(prev => prev + 90);
    }
  };

  // Update recent pages
  const updateRecentPages = () => {
    setRecentPages(prev => {
      const newRecent = [currentPage, ...prev.filter(p => p !== currentPage)].slice(0, 5);
      return newRecent;
    });
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      setStarredPages(prev => [...prev, currentPage]);
    } else {
      setStarredPages(prev => prev.filter(p => p !== currentPage));
    }
  };

  // Page search functionality
  const handlePageSearch = () => {
    if (!pageSearchInput.trim()) {
      setPageSearchResults([]);
      return;
    }

    setIsSearching(true);
    const searchTerm = pageSearchInput.toLowerCase();
    
    // Simulate searching page content
    const results = Array.from({ length: totalPages }, (_, i) => i + 1).filter(pageNum => {
      const pageContent = `Page ${pageNum} content with sample text for searching`;
      return pageContent.toLowerCase().includes(searchTerm);
    });
    
    setPageSearchResults(results);
    setIsSearching(false);
    
    if (results.length > 0) {
      setCurrentPage(results[0]);
      setSelectedPage(results[0]);
    }
  };

  const clearSearch = () => {
    setPageSearchInput('');
    setPageSearchResults([]);
  };

  const goToSearchResult = (pageNum: number) => {
    setCurrentPage(pageNum);
    setSelectedPage(pageNum);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: (pageNum - 1) * 500,
        behavior: 'smooth'
      });
    }
  };

  // Manual page search function
  const handleManualPageSearch = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setSelectedPage(pageNum);
      setIsPageSearchOpen(false);
      updateRecentPages();
    }
  };

  // OCR Functions
  const performOCR = async () => {
    setIsOCRProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      // Mock OCR result for the current page
      const mockOCRText = `This is simulated OCR text for page ${currentPage}.\n\n` +
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n` +
        `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n` +
        `Page ${currentPage} contains important information about the document.`;
      
      const newOCRResult: OCRResult = {
        pageNum: currentPage,
        text: mockOCRText,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
      };
      
      setOcrResults(prev => {
        // Replace if exists for this page, otherwise add
        const filtered = prev.filter(r => r.pageNum !== currentPage);
        return [...filtered, newOCRResult];
      });
      
      setOcrText(mockOCRText);
      setIsOCRProcessing(false);
      setShowOCRPanel(true);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate OCR on uploaded file
      setIsOCRProcessing(true);
      setTimeout(() => {
        const mockOCRText = `OCR results from uploaded file: ${file.name}\n\n` +
          `This is simulated text extracted from the uploaded document.\n` +
          `The OCR process has completed successfully with high accuracy.`;
        
        setOcrText(mockOCRText);
        setIsOCRProcessing(false);
        setShowOCRPanel(true);
      }, 1500);
    }
  };

  const copyOCRText = () => {
    navigator.clipboard.writeText(ocrText);
    alert('OCR text copied to clipboard!');
  };

  const updateEditableText = (id: string, updates: Partial<EditableText>) => {
    setEditableTexts(prev => prev.map(text => 
      text.id === id ? { ...text, ...updates } : text
    ));
  };

  const handleTextDrag = (id: string, e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const text = editableTexts.find(t => t.id === id);
    if (!text) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      updateEditableText(id, {
        x: Math.max(0, text.x + dx),
        y: Math.max(0, text.y + dy),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PDF Document',
        text: 'Sharing PDF document',
      }).catch(console.error);
    } else {
      alert('Sharing not supported');
    }
  };

  const handleSave = () => {
    const data = {
      currentPage,
      zoomLevel,
      pageSize,
      rotationAngle,
      editableTexts,
      ocrResults,
    };
    localStorage.setItem('pdfViewerState', JSON.stringify(data));
    alert('State saved successfully!');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('pdfViewerState');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentPage(data.currentPage);
        setZoomLevel(data.zoomLevel);
        setPageSize(data.pageSize);
        setRotationAngle(data.rotationAngle);
        setEditableTexts(data.editableTexts);
        setOcrResults(data.ocrResults || []);
        alert('State loaded successfully!');
      } catch (error) {
        alert('Error loading saved state');
      }
    } else {
      alert('No saved state found');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings? This cannot be undone.')) {
      setZoomLevel(100);
      setRotationAngle(0);
      setPageSize('A4');
      setFilterOption('none');
      setEditableTexts([]);
      setOcrResults([]);
      setOcrText('');
      setCurrentPage(1);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault();
        setIsEditMode(!isEditMode);
      } else if (e.key === '+' && e.ctrlKey) {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' && e.ctrlKey) {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0' && e.ctrlKey) {
        e.preventDefault();
        setZoomLevel(100);
      } else if (e.key === 'o' && e.ctrlKey) {
        e.preventDefault();
        setShowOCRPanel(!showOCRPanel);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEditMode, showOCRPanel]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Get filtered pages
  const getFilteredPages = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    if (filterOption === 'lowToHigh') {
      return [...pages].sort((a, b) => a - b);
    } else if (filterOption === 'highToLow') {
      return [...pages].sort((a, b) => b - a);
    }
    return pages;
  };

  // Page Content Component
  const PageContent = ({ pageNum }: { pageNum: number }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden transition-all ${
        selectedPage === pageNum ? 'ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-700'
      } ${pageSearchResults.includes(pageNum) ? 'ring-2 ring-yellow-500' : ''}`}
      style={{ 
        width: '100%',
        minHeight: pageDims.height,
        transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`, 
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-4 py-2 border-b flex justify-between items-center">
        <span className="font-medium">Page {pageNum}</span>
        <div className="flex items-center gap-2">
          {starredPages.includes(pageNum) && (
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          )}
          {pageSearchResults.includes(pageNum) && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 px-2 py-0.5 rounded-full">
              Match
            </span>
          )}
          
        </div>
      </div>

      {/* Page Content */}
      <div className="relative p-6 min-h-[600px]" ref={editAreaRef}>
        {/* Static Content */}
        <div className="space-y-3 mb-8">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-4/5"></div>
          
          {/* OCR Text Overlay */}
          {ocrResults.filter(r => r.pageNum === pageNum).map((result, idx) => (
            <div key={idx} className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  OCR Confidence: {result.confidence}%
                </span>
                <button
                  onClick={() => {
                    setOcrText(result.text);
                    setShowOCRPanel(true);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View Full Text
                </button>
              </div>
              <p className="text-sm line-clamp-3">{result.text.substring(0, 150)}...</p>
            </div>
          ))}
        </div>

        {/* Search Highlight */}
        {pageSearchResults.includes(pageNum) && pageSearchInput && (
          <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Found: "{pageSearchInput}"
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-white text-gray-800'
    }`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Menu</h3>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Recent
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Starred
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Shared
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Toolbar */}
      <div className={`flex flex-wrap items-center gap-1 p-2 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/60'
      }`}>
        {/* View Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsThumbnailOpen(!isThumbnailOpen)}
            className={`p-2 rounded-lg hidden lg:block ${
              isThumbnailOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle thumbnails"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border-l border-r border-gray-200 dark:border-gray-700 px-2">
          <button 
            onClick={() => setViewMode('single')}
            className={`p-2 rounded-lg ${viewMode === 'single' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Single page"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('double')}
            className={`p-2 rounded-lg hidden sm:block ${viewMode === 'double' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Double page"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('continuous')}
            className={`p-2 rounded-lg hidden md:block ${viewMode === 'continuous' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Continuous scroll"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* OCR Button */}
        <button
          onClick={performOCR}
          disabled={isOCRProcessing}
          className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
          title="Perform OCR on current page"
        >
          <ScanLine className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">
            {isOCRProcessing ? 'Processing...' : 'OCR'}
          </span>
        </button>

        {/* Hidden file input for OCR upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,.pdf"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          title="Upload for OCR"
        >
          <Type className="w-4 h-4" />
        </button>

        {/* Page Size Selector */}
        <div className="relative" ref={sizeRef}>
          <button
            onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Ruler className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">{pageSize}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isSizeDropdownOpen && (
            <div className={`absolute left-0 top-full mt-1 w-64 rounded-lg shadow-lg border py-2 z-50 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                Page Size
              </div>
              {(['A4', 'A3', 'Letter', 'Legal'] as PageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeChange(size)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between ${
                    pageSize === size ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <span>{size}</span>
                </button>
              ))}
              <div className="border-t my-1"></div>
              <button
                onClick={() => handlePageSizeChange('Custom')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  pageSize === 'Custom' ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                Custom
              </button>

              {pageSize === 'Custom' && (
                <div className="px-4 py-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs w-12">Width:</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => handleCustomSizeChange('width', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-xs border rounded"
                      min="100"
                      max="5000"
                    />
                    <span className="text-xs">px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs w-12">Height:</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => handleCustomSizeChange('height', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-xs border rounded"
                      min="100"
                      max="5000"
                    />
                    <span className="text-xs">px</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="rounded"
                    />
                    Maintain aspect ratio
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium min-w-[60px] text-center">{zoomLevel}%</span>
          <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Rotate Controls */}
        <div className="flex items-center gap-1">
          <button onClick={() => handleRotate('left')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => handleRotate('right')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Page Navigation with Manual Search */}
        <div className="flex items-center gap-1 ml-auto">
          <button 
            onClick={handlePrevPage} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={currentPage}
              onChange={handlePageChange}
              className={`w-12 h-8 text-center text-sm border rounded-lg font-medium ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}
            />
            <span className="text-sm text-gray-500">/ {totalPages}</span>
          </div>
          
          <button 
            onClick={handleNextPage} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" 
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Manual Page Search */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsPageSearchOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Search page"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {/* Search Popup */}
            {isPageSearchOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 z-50">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    ref={pageSearchInputRef}
                    min="1"
                    max={totalPages}
                    placeholder={`Enter page (1-${totalPages})`}
                    className={`flex-1 px-3 py-1.5 text-sm border rounded-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const pageNum = parseInt(e.currentTarget.value);
                        handleManualPageSearch(pageNum);
                      }
                    }}
                  />
                  <button
                    onClick={() => setIsPageSearchOpen(false)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Press Enter to go to page
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings and Fullscreen */}
        <div className="flex items-center gap-1">
          <div className="relative" ref={settingsRef}>
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Settings className="w-4 h-4" />
            </button>
            
            {isSettingsOpen && (
              <div className={`absolute right-0 top-full mt-1 w-56 rounded-lg shadow-lg border py-2 z-50 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <button onClick={() => { setIsDarkMode(!isDarkMode); setIsSettingsOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button onClick={() => { setShowOCRPanel(!showOCRPanel); setIsSettingsOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                  <ScanLine className="w-4 h-4" />
                  {showOCRPanel ? 'Hide OCR' : 'Show OCR'}
                </button>
              </div>
            )}
          </div>

          <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* OCR Panel */}
      {showOCRPanel && (
        <div className={`border-b p-4 ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <ScanLine className="w-4 h-4" />
              OCR Text - Page {currentPage}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={copyOCRText}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy Text
              </button>
              <button
                onClick={() => setShowOCRPanel(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className={`p-3 rounded-lg max-h-40 overflow-y-auto text-sm ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            {isOCRProcessing ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                <span>Processing OCR...</span>
              </div>
            ) : (
              ocrText || 'No OCR text available. Click OCR button to analyze current page.'
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div className={`w-16 md:w-20 flex flex-col items-center py-4 border-r ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="space-y-1">
            {/* Filter Button */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg group ${
                  filterOption !== 'none' ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Filter
                </span>
              </button>
              
              {isFilterOpen && (
                <div className={`absolute left-12 top-0 w-48 rounded-lg shadow-lg border py-2 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                    Sort by Page
                  </div>
                  <button onClick={() => { setFilterOption('lowToHigh'); setIsFilterOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${
                      filterOption === 'lowToHigh' ? 'bg-blue-50 text-blue-600' : ''
                    }`}>
                    <ArrowUp className="w-4 h-4" /> Low to High
                  </button>
                  <button onClick={() => { setFilterOption('highToLow'); setIsFilterOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${
                      filterOption === 'highToLow' ? 'bg-blue-50 text-blue-600' : ''
                    }`}>
                    <ArrowDown className="w-4 h-4" /> High to Low
                  </button>
                  {filterOption !== 'none' && (
                    <>
                      <div className="border-t my-1"></div>
                      <button onClick={() => { setFilterOption('none'); setIsFilterOpen(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                        Clear Filter
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Star Button */}
            <button onClick={toggleBookmark}
              className={`w-10 h-10 flex items-center justify-center rounded-lg group ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-blue-100 dark:hover:bg-gray-700'
              }`}>
              <Star className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-500' : ''}`} />
              <span className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100">
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </span>
            </button>

            {/* Recent Button */}
            <button className="w-10 h-10 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg group relative">
              <Clock className="w-5 h-5" />
              <span className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Recent
              </span>
              {recentPages.length > 0 && (
                <div className="absolute left-14 top-0 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 min-w-[120px]">
                  {recentPages.map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded">
                      Page {page}
                    </button>
                  ))}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div 
          ref={scrollContainerRef}
          className={`flex-1 overflow-auto transition-all ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
          }`}
          onScroll={() => {
            setIsScrolling(true);
            setTimeout(() => setIsScrolling(false), 150);
          }}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto" style={{ maxWidth: viewMode === 'double' ? `${pageDims.width * 2.5}px` : `${pageDims.width}px` }}>
              {/* PDF Pages */}
              {viewMode === 'double' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {currentPage <= totalPages && (
                    <PageContent key={`left-${currentPage}`} pageNum={currentPage} />
                  )}
                  {currentPage + 1 <= totalPages && (
                    <PageContent key={`right-${currentPage + 1}`} pageNum={currentPage + 1} />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredPages()
                    .filter(pageNum => viewMode === 'single' ? pageNum === currentPage : true)
                    .map((pageNum) => (
                      <PageContent key={pageNum} pageNum={pageNum} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Thumbnail Sidebar */}
        {isThumbnailOpen && !isMobile && (
          <div className={`w-28 lg:w-32 border-l overflow-auto p-2 ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="text-xs font-medium text-gray-500 mb-3 px-2">PAGES</div>
            <div className="space-y-2">
              {getFilteredPages().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    setSelectedPage(pageNum);
                  }}
                  className={`w-full group relative rounded-lg border-2 transition-all overflow-hidden ${
                    currentPage === pageNum ? 'border-blue-500 shadow-md' : 
                    pageSearchResults.includes(pageNum) ? 'border-yellow-500' : 'border-transparent hover:border-blue-300'
                  }`}
                >
                  <div className="h-16 sm:h-20 bg-gradient-to-b from-gray-100 to-gray-200 p-2">
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-white/80 rounded"></div>
                      <div className="h-1 w-3/4 bg-white/80 rounded"></div>
                      <div className="h-1 w-1/2 bg-white/80 rounded"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    {pageNum}
                  </div>
                  {starredPages.includes(pageNum) && (
                    <Star className="absolute top-1 left-1 w-3 h-3 text-yellow-500 fill-yellow-500" />
                  )}
                  {ocrResults.some(r => r.pageNum === pageNum) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className={`flex flex-wrap items-center justify-between px-4 py-2 border-t text-xs ${
        isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-500'
      }`}>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <span>📄 {totalPages} pages</span>
          <span className="hidden xs:inline">📏 {zoomLevel}%</span>
          <span className="hidden sm:inline">📐 {pageSize}</span>
          <span className="hidden sm:inline">💾 2.4 MB</span>
          {filterOption !== 'none' && (
            <span className="text-blue-500 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {filterOption === 'lowToHigh' ? '↑' : '↓'}
            </span>
          )}
          {pageSearchResults.length > 0 && (
            <span className="text-yellow-500 flex items-center gap-1">
              <FileSearch className="w-3 h-3" />
              {pageSearchResults.length} matches
            </span>
          )}
          
          {isEditMode && (
            <span className="text-green-500 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              Edit Mode
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isScrolling && <span className="text-blue-500 animate-pulse">Scrolling...</span>}
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="hidden xs:inline">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerPanel;