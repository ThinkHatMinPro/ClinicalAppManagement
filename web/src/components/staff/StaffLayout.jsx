import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import StaffHeader from "./StaffHeader";

export default function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <StaffSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <StaffHeader />

        <main className="min-w-0 flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}