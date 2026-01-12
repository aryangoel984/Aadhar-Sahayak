"use client";

import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard">("dashboard");

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 transition-all duration-300">
        <div className="p-6 border-b border-slate-800">
           <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" alt="Logo" className="w-6 h-6" />
            </div>
            Sahayak
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={clsx(
              "flex items-center gap-3 px-3 py-3 w-full rounded-lg transition-all",
              activeTab === "dashboard" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "hover:bg-slate-800"
            )}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Live Dashboard</span>
          </button>

          <button 
             onClick={() => setActiveTab("chat")}
             className={clsx(
              "flex items-center gap-3 px-3 py-3 w-full rounded-lg transition-all",
              activeTab === "chat" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "hover:bg-slate-800"
            )}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Policy AI Chat</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">
            <Settings size={16} />
            <span>System Configuration</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shrink-0 shadow-sm z-10">
          <h2 className="font-semibold text-lg text-slate-800">
            {activeTab === "dashboard" ? "District Analytics Overview" : "AI Policy Assistant"}
          </h2>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            District: <span className="font-semibold text-slate-700">All Zones</span>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "dashboard" ? <AnalyticsDashboard /> : <ChatWindow />}
        </div>
      </div>

    </main>
  );
}