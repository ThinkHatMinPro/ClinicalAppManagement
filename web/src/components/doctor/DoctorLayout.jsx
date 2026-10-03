import { Outlet } from "react-router-dom";
import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSidebar";

export default function DoctorLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DoctorSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DoctorHeader />

        <main className="min-w-0 flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}