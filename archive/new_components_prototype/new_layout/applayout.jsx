import Sidebar from "./sidebar";
import Header from "./header";
import RightPanel from "./rightpanel";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0B0F1A] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <Header />

        <div className="flex flex-1 overflow-hidden">

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#0B0F1A] to-[#111827]">
            {children}
          </main>

          {/* Right Panel */}
          <RightPanel />

        </div>
      </div>
    </div>
  );
}