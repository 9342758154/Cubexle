import { ReactNode } from "react";
import TopNavbar from "./TopNavbar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopNavbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default AppLayout;
