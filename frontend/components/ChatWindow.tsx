"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/lib/api";
import { Send, Bot, User, Loader2, BarChart3, LayoutDashboard, Settings, FileText } from "lucide-react";
import clsx from "clsx";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Greetings. I am the Aadhaar Decision Support System. \n\nI am connected to live Enrolment, Migration, and Biometric databases. How can I assist with your district planning today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    const data = await sendMessage(userMsg);

    setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar - Acts as the "App Navigation" */}
      {/* <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" alt="Logo" className="w-8 h-8 bg-white rounded p-0.5" />
            Sahayak <span className="text-blue-400 text-xs uppercase bg-blue-900/50 px-2 py-0.5 rounded">Beta</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer shadow-lg shadow-blue-900/20">
            <LayoutDashboard size={18} />
            <span className="font-medium">Live Analysis</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            <BarChart3 size={18} />
            <span>Enrolment Reports</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            <FileText size={18} />
            <span>Policy Drafts</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Settings size={16} />
            <span>System Configuration</span>
          </div>
        </div>
      </div> */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-700">
            <Bot className="text-blue-600" />
            <span className="font-semibold">AI Assistant Active</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></span>
          </div>
          <div className="text-sm text-slate-400">
            Connected to: <span className="font-mono text-slate-600">NeonDB (v15.2)</span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={clsx("flex gap-4 max-w-4xl mx-auto", msg.role === "user" ? "justify-end" : "justify-start")}>
              
              {/* Bot Icon */}
              {msg.role === "bot" && (
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" className="w-6 h-6" alt="Bot" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={clsx(
                "p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed max-w-[80%]",
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
              )}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* User Icon */}
              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="text-slate-500" size={20} />
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm text-sm text-slate-500 flex items-center gap-2">
                Processing Query...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Floating Bar */}
        <div className="p-6 bg-transparent shrink-0">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <input
              type="text"
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-base"
              placeholder="Ask a complex policy question (e.g., 'Compare migration vs schools in Pune')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="text-center mt-2 text-xs text-slate-400">
            AI-generated responses may require verification against official records.
          </div>
        </div>

      </div>
    </div>
  );
}