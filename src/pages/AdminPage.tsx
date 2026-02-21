import AppLayout from "@/components/layout/AppLayout";
import { Users, Settings, Shield, Database, ChevronRight } from "lucide-react";


const adminSections = [
  {
    icon: Users,
    title: "User Management",
    description: "Manage users, roles, and permissions",
    items: [
      { label: "Active Users", value: "24" },
      { label: "Pending Invites", value: "3" },
      { label: "Roles Configured", value: "5" },
    ],
  },
  {
    icon: Settings,
    title: "System Configuration",
    description: "Configure application settings and preferences",
    items: [
      { label: "Note Types", value: "12" },
      { label: "Facilities", value: "8" },
      { label: "Templates", value: "15" },
    ],
  },
  {
    icon: Shield,
    title: "Security & Audit",
    description: "View audit logs and manage security settings",
    items: [
      { label: "Login Attempts (Today)", value: "142" },
      { label: "Failed Logins", value: "3" },
      { label: "Active Sessions", value: "18" },
    ],
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Manage data exports, imports, and backups",
    items: [
      { label: "Total Documents", value: "1,247" },
      { label: "Last Backup", value: "2h ago" },
      { label: "Storage Used", value: "45 GB" },
    ],
  },
];

const AdminPage = () => {
  return (
    <AppLayout>
      <div className="p-6 h-full overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        <div className="grid grid-cols-2 gap-4">
          {adminSections.map((section) => (
            <div
              key={section.title}
              className="section-card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{section.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="bg-section-bg rounded p-2.5 text-center"
                  >
                    <div className="text-lg font-bold text-primary">
                      {item.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminPage;
