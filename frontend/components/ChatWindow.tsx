// "use client";

// import { useState, useRef, useEffect } from "react";
// import { sendMessage } from "@/lib/api";
// import { Send, Bot, User, Loader2, BarChart3, LayoutDashboard, Settings, FileText } from "lucide-react";
// import clsx from "clsx";

// type Message = {
//   role: "user" | "bot";
//   content: string;
// };

// export default function ChatWindow() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<Message[]>([
//     { role: "bot", content: "Greetings. I am the Aadhaar Decision Support System. \n\nI am connected to live Enrolment, Migration, and Biometric databases. How can I assist with your district planning today?" }
//   ]);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//   useEffect(scrollToBottom, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMsg = input;
//     setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
//     setInput("");
//     setLoading(true);

//     const data = await sendMessage(userMsg);

//     setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
//     setLoading(false);
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
//       {/* Sidebar - Acts as the "App Navigation" */}
//       {/* <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 hidden md:flex">
//         <div className="p-6 border-b border-slate-800">
//           <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
//             <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" alt="Logo" className="w-8 h-8 bg-white rounded p-0.5" />
//             Sahayak <span className="text-blue-400 text-xs uppercase bg-blue-900/50 px-2 py-0.5 rounded">Beta</span>
//           </h1>
//         </div>
        
//         <nav className="flex-1 p-4 space-y-2">
//           <div className="flex items-center gap-3 px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer shadow-lg shadow-blue-900/20">
//             <LayoutDashboard size={18} />
//             <span className="font-medium">Live Analysis</span>
//           </div>
//           <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
//             <BarChart3 size={18} />
//             <span>Enrolment Reports</span>
//           </div>
//           <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
//             <FileText size={18} />
//             <span>Policy Drafts</span>
//           </div>
//         </nav>

//         <div className="p-4 border-t border-slate-800">
//           <div className="flex items-center gap-3 text-sm text-slate-400">
//             <Settings size={16} />
//             <span>System Configuration</span>
//           </div>
//         </div>
//       </div> */}

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col h-full relative">
        
//         {/* Top Header */}
//         <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
//           <div className="flex items-center gap-2 text-slate-700">
//             <Bot className="text-blue-600" />
//             <span className="font-semibold">AI Assistant Active</span>
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></span>
//           </div>
//           <div className="text-sm text-slate-400">
//             Connected to: <span className="font-mono text-slate-600">NeonDB (v15.2)</span>
//           </div>
//         </header>

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
//           {messages.map((msg, idx) => (
//             <div key={idx} className={clsx("flex gap-4 max-w-4xl mx-auto", msg.role === "user" ? "justify-end" : "justify-start")}>
              
//               {/* Bot Icon */}
//               {msg.role === "bot" && (
//                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
//                   <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" className="w-6 h-6" alt="Bot" />
//                 </div>
//               )}

//               {/* Message Bubble */}
//               <div className={clsx(
//                 "p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed max-w-[80%]",
//                 msg.role === "user" 
//                   ? "bg-blue-600 text-white rounded-br-none" 
//                   : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
//               )}>
//                 <p className="whitespace-pre-wrap">{msg.content}</p>
//               </div>

//               {/* User Icon */}
//               {msg.role === "user" && (
//                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
//                   <User className="text-slate-500" size={20} />
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Loading State */}
//           {loading && (
//             <div className="flex gap-4 max-w-4xl mx-auto">
//               <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
//                 <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
//               </div>
//               <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm text-sm text-slate-500 flex items-center gap-2">
//                 Processing Query...
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area - Floating Bar */}
//         <div className="p-6 bg-transparent shrink-0">
//           <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
//             <input
//               type="text"
//               className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-base"
//               placeholder="Ask a complex policy question (e.g., 'Compare migration vs schools in Pune')..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               disabled={loading}
//             />
//             <button 
//               onClick={handleSend} 
//               disabled={loading || !input.trim()}
//               className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Send size={20} />
//             </button>
//           </div>
//           <div className="text-center mt-2 text-xs text-slate-400">
//             AI-generated responses may require verification against official records.
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Terminal, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Separate component for the AI Message to handle the logic split
const AiMessage = ({ content }: { content: string }) => {
  const [showLogs, setShowLogs] = useState(false);
  
  // Split the content: [0] = Answer, [1] = Reasoning Trace
  const parts = content.split("---");
  const mainAnswer = parts[0].trim();
  const reasoningTrace = parts.length > 1 ? parts[1].trim() : null;

  return (
    <div className="flex gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
        <Bot size={18} className="text-blue-600" />
      </div>
      <div className="flex-1 space-y-4">
        {/* Main Clean Answer */}
        <div className="prose prose-sm max-w-none text-slate-700">
          <ReactMarkdown>{mainAnswer}</ReactMarkdown>
        </div>

        {/* Collapsible Reasoning Trace */}
        {reasoningTrace && (
          <div className="mt-4 border rounded-lg border-slate-200 overflow-hidden">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-600 border-b border-slate-200"
            >
              <Terminal size={14} />
              {showLogs ? "Hide AI Reasoning Trace" : "View AI Reasoning Trace"}
              {showLogs ? <ChevronDown size={14} className="ml-auto"/> : <ChevronRight size={14} className="ml-auto"/>}
            </button>
            
            {showLogs && (
              <div className="bg-slate-900 text-slate-300 p-4 text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
                {reasoningTrace.replace("### 🧠 AI Reasoning Trace", "").trim()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatWindow() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!query.trim()) return;

    const newHistory = [...history, { role: "user" as const, content: query }];
    setHistory(newHistory);
    setLoading(true);
    setQuery("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", { text: query });
      setHistory([...newHistory, { role: "ai", content: res.data.answer }]);
    } catch (err) {
      setHistory([...newHistory, { role: "ai", content: "⚠️ Error connecting to the AI Agent." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
            <Bot size={64} className="mb-4" />
            <p className="text-lg font-medium">Ready to analyze Aadhaar data</p>
          </div>
        )}

        {history.map((msg, idx) => (
          msg.role === "user" ? (
            <div key={idx} className="flex gap-4 flex-row-reverse">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                <User size={18} className="text-white" />
              </div>
              <div className="bg-slate-800 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ) : (
            <AiMessage key={idx} content={msg.content} />
          )
        ))}
        
        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={18} className="text-blue-600" />
             </div>
             <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Thinking...
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            className="w-full bg-slate-100 text-slate-900 placeholder-slate-500 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-transparent focus:border-blue-500 transition-all shadow-inner"
            placeholder="Ask complex queries (e.g., 'Plan food distribution for Jaipur based on hunger load')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="absolute right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">
          Powered by Multi-Agent Llama-3.3 • Self-Healing SQL Architecture
        </p>
      </div>
    </div>
  );
}