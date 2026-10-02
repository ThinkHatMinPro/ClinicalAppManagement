import { Outlet } from "react-router-dom";
import StaffHeader from "./StaffHeader";
import StaffSidebar from "./StaffSidebar";

export default function StaffLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col md:flex-row">
        <StaffSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <StaffHeader />

          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}