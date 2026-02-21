import { Bell, LogOut, Settings, Home, Search, FileText, User, ChevronDown, Menu, X, Activity, Microscope, HeartPulse, Stethoscope, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Search", path: "/search", icon: Search },
  { label: "Admin", path: "/admin", icon: Settings },
  { label: "Report", path: "/report", icon: FileText },
];

const medicalNavItems = [
  { label: "OV", path: "/ov", icon: Stethoscope, color: "text-blue-400" },
  { label: "Diagnostics", path: "/diagnostics", icon: Activity, color: "text-green-400" },
  { label: "Labs", path: "/labs", icon: Microscope, color: "text-purple-400" },
  { label: "EKG", path: "/ekg", icon: HeartPulse, color: "text-red-400" },
];

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName] = useState("User Name");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${dayStr}`);
    setShowCalendar(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800'
    }`}>
      {/* Main Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-sm font-bold text-white">Logo</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-tight">Cubexle</span>
          </div>
        </div>

        {/* Desktop Navigation - Main Menu */}
        <div className="hidden lg:flex items-center gap-24">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* User Name - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-white">User Name</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Medical Navigation - Moved to Right Side */}
      <div className="border-t border-white/10">
        <div className="flex justify-between items-center px-8 sm:px-8 lg:px-32 py-1">
          {/* Empty div for spacing */}
          <div className="w-0"></div>
          
          {/* Medical Nav Items - Now on Right Side */}
          <div className="flex items-center gap-4 sm:gap-16 ml-auto">
            {medicalNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Document Search Bar - Resized and Moved Left */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="px-2 sm:px-6 lg:px-3 py-1">
          <div className="flex items-center gap-2">
            {/* Document Name/No - 350px Fixed Width */}
            <div className="w-[350px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Document Name or No"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* DOB Input with Calendar */}
            <div className="relative w-32" ref={calendarRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="DOB"
                  value={selectedDate}
                  onClick={() => setShowCalendar(!showCalendar)}
                  readOnly
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm cursor-pointer"
                />
                <Calendar 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 cursor-pointer"
                  onClick={() => setShowCalendar(!showCalendar)}
                />
              </div>

              {/* Calendar Popup */}
              {showCalendar && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>

                  {/* Week Days */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isSelected = selectedDate === dateStr;
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          className={`h-8 w-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Today Button */}
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        setSelectedDate(`${year}-${month}-${day}`);
                        setShowCalendar(false);
                      }}
                      className="w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gender Select */}
            <div className="relative w-28">
              <select className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm">
                <option value="" className="bg-slate-800 text-white">Gender</option>
                <option value="male" className="bg-slate-800 text-white">Male</option>
                <option value="female" className="bg-slate-800 text-white">Female</option>
                <option value="other" className="bg-slate-800 text-white">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Page Number */}
            <div className="w-20">
              <input
                type="text"
                placeholder="Pg No"
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative w-28">
              <select className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm">
                <option value="" className="bg-slate-800 text-white">Status</option>
                <option value="active" className="bg-slate-800 text-white">Active</option>
                <option value="pending" className="bg-slate-800 text-white">Pending</option>
                <option value="completed" className="bg-slate-800 text-white">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Search Button */}
            <button className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm shadow-lg flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl border-t border-gray-200 dark:border-gray-700 animate-slideDown max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">User Name</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">User</div>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-400 uppercase px-3">Main Menu</div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                  </button>
                );
              })}
            </div>

            {/* Medical Navigation */}
            <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-semibold text-gray-400 uppercase px-3">Medical</div>
              {medicalNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-gray-800' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 px-3 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;