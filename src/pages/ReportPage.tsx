import AppLayout from "@/components/layout/AppLayout";
import { FileText, Download, Printer, Calendar, ChevronDown, BarChart3, PieChart, TrendingUp } from "lucide-react";

const recentReports = [
  { name: "Monthly Summary - January 2026", date: "02/01/2026", type: "Summary", status: "Generated" },
  { name: "Provider Productivity Report", date: "01/28/2026", type: "Productivity", status: "Generated" },
  { name: "Document Completion Report", date: "01/25/2026", type: "Compliance", status: "Generated" },
  { name: "Audit Trail Report", date: "01/20/2026", type: "Audit", status: "Generated" },
];

const ReportPage = () => {
  return (
    <AppLayout>
      <div className="p-6 h-full overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="flex gap-2">
            <button className="nav-button-primary text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Generate Report
            </button>
            <button className="nav-button-outline text-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="section-card flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-xs text-muted-foreground">Total Documents</div>
            </div>
          </div>
          <div className="section-card flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <PieChart className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">94.2%</div>
              <div className="text-xs text-muted-foreground">Completion Rate</div>
            </div>
          </div>
          <div className="section-card flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">+12%</div>
              <div className="text-xs text-muted-foreground">vs Last Month</div>
            </div>
          </div>
        </div>

        {/* Report filters */}
        <div className="section-card mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Report Type</label>
              <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                <span className="text-xs text-muted-foreground">All Types</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
              <div className="form-input-clinical w-full flex items-center justify-between cursor-pointer">
                <span className="text-xs text-muted-foreground">Last 30 days</span>
                <Calendar className="w-3 h-3" />
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
        </div>

        {/* Recent reports */}
        <div className="section-card">
          <h2 className="text-sm font-semibold mb-4">Recent Reports</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-muted-foreground">Report Name</th>
                <th className="pb-2 font-medium text-muted-foreground">Date</th>
                <th className="pb-2 font-medium text-muted-foreground">Type</th>
                <th className="pb-2 font-medium text-muted-foreground">Status</th>
                <th className="pb-2 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    {report.name}
                  </td>
                  <td className="py-2.5">{report.date}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-accent text-accent-foreground">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-success/10 text-success">
                      {report.status}
                    </span>
                  </td>
                  <td className="py-2.5 flex gap-2">
                    <button className="toolbar-button w-7 h-7">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button className="toolbar-button w-7 h-7">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
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

export default ReportPage;
