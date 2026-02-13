import AppLayout from "@/components/layout/AppLayout";
import { Search, Filter, ChevronDown, Calendar, FileText } from "lucide-react";

const mockResults = [
  { id: "DOC-001", name: "John Smith - Progress Note", date: "01/15/2026", status: "Completed", provider: "Dr. Williams" },
  { id: "DOC-002", name: "Jane Doe - Initial Evaluation", date: "01/14/2026", status: "Pending", provider: "Dr. Johnson" },
  { id: "DOC-003", name: "Robert Brown - Follow Up", date: "01/13/2026", status: "In Review", provider: "Dr. Davis" },
  { id: "DOC-004", name: "Maria Garcia - Discharge Summary", date: "01/12/2026", status: "Completed", provider: "Dr. Williams" },
  { id: "DOC-005", name: "James Wilson - Lab Report", date: "01/11/2026", status: "Completed", provider: "Dr. Miller" },
  { id: "DOC-006", name: "Sarah Lee - Consultation Note", date: "01/10/2026", status: "Pending", provider: "Dr. Johnson" },
];

const SearchPage = () => {
  return (
    <AppLayout>
      <div className="p-6 h-full overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Search Documents</h1>

        {/* Search filters */}
        <div className="section-card mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Document Name / No</label>
              <div className="relative">
                <input type="text" placeholder="Search..." className="form-input-clinical w-full pr-8" />
                <Search className="w-4 h-4 absolute right-2 top-2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
              <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                <span className="text-xs text-muted-foreground">mm/dd/yyyy - mm/dd/yyyy</span>
                <Calendar className="w-3 h-3" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                <span className="text-xs text-muted-foreground">All</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Provider</label>
              <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                <span className="text-xs text-muted-foreground">All Providers</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="nav-button-primary text-xs flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" /> Search
            </button>
            <button className="nav-button-outline text-xs flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Advanced Filters
            </button>
          </div>
        </div>

        {/* Results table */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Results ({mockResults.length})</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-muted-foreground">Doc ID</th>
                <th className="pb-2 font-medium text-muted-foreground">Document Name</th>
                <th className="pb-2 font-medium text-muted-foreground">Date</th>
                <th className="pb-2 font-medium text-muted-foreground">Provider</th>
                <th className="pb-2 font-medium text-muted-foreground">Status</th>
                <th className="pb-2 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockResults.map((doc) => (
                <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 text-primary font-medium">{doc.id}</td>
                  <td className="py-2.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {doc.name}
                  </td>
                  <td className="py-2.5">{doc.date}</td>
                  <td className="py-2.5">{doc.provider}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      doc.status === "Completed" ? "bg-success/10 text-success" :
                      doc.status === "Pending" ? "bg-warning/10 text-warning" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <button className="text-xs text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default SearchPage;
