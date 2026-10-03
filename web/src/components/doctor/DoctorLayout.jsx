import { Outlet } from "react-router-dom";
import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSidebar";

export default function DoctorLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DoctorHeader />

      <div className="flex">
        <DoctorSidebar />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}