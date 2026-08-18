import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  BookOpen, 
  RefreshCw,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { SCHOOL_INFO, schoolLogo } from '../data/schoolData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `សូមជម្រាបសួរ! ខ្ញុំជាជំនួយការ AI របស់សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់។ 

តើខ្ញុំអាចជួយលោកអ្នក ឬប្អូនៗសិស្សានុសិស្សអំពីអ្វីដែរថ្ងៃនេះ?
លោកអ្នកអាចសួរអំពី៖
- ការចុះឈ្មោះចូលរៀន និងឯកសារតម្រូវ
- ឯកសណ្ឋានសិស្ស (អាវកីឡាពណ៌ក្រហម/ស)
- កាលវិភាគសិក្សា និងវិន័យសាលា
- ការពន្យល់លំហាត់ ឬកិច្ចការផ្ទះកម្រិតបឋមសិក្សា`,
      timestamp: 'ឥឡូវនេះ',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "តើចុះឈ្មោះចូលរៀនត្រូវត្រៀមអ្វីខ្លះ?",
    "តើឯកសណ្ឋានសិស្សមានពណ៌អ្វីខ្លះ?",
    "ម៉ោងសិក្សាពេលព្រឹកចាប់ផ្តើមពីម៉ោងប៉ុន្មាន?",
    "ជួយពន្យល់វិធីគុណលេខពីរខ្ទង់ឱ្យកូនរៀនថ្នាក់ទី៣",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/school/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || data.fallbackReply || 'សូមអភ័យទោស ខ្ញុំមិនអាចទាញយកចម្លើយបានទេ។',
        timestamp: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'សូមអភ័យទោស មានបញ្ហាក្នុងការតភ្ជាប់បណ្តាញ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងមកកាន់លេខសាលាផ្ទាល់៖ 012 849 203',
        timestamp: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[85vh] max-h-[680px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-blue-900 border-b-2 border-yellow-400 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-white p-0.5 border-2 border-yellow-400 shadow-xs">
              <img
                src={schoolLogo}
                alt="School Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-moul text-sm sm:text-base text-yellow-300">
                  ជំនួយការ AI សាលារៀន
                </h3>
                <span className="px-1.5 py-0.5 bg-yellow-400 text-blue-950 text-[10px] font-bold rounded-sm border border-yellow-500">
                  Thinking Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-kantumruy">
                {SCHOOL_INFO.nameKh} &bull; ឆ្លើយតបរហ័ស ២៤/៧
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-yellow-300 flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs border border-blue-950">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-lg p-4 text-xs sm:text-sm font-kantumruy leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 border-l-4 border-l-yellow-400 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.role === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-yellow-300 flex items-center justify-center flex-shrink-0 text-xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg rounded-tl-none p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500 font-kantumruy border-l-4 border-l-yellow-400">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-900 animate-bounce"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-900 animate-bounce delay-150"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-900 animate-bounce delay-300"></span>
                <span className="ml-1">ជំនួយការ AI កំពុងពិចារណា និងស្វែងរកចម្លើយ...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="px-4 py-2 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[11px] text-slate-400 font-medium flex-shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            សំណួរគំរូ:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="វាយសំណួររបស់អ្នកនៅទីនេះ (ជាភាសាខ្មែរ)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-900 focus:bg-white transition-all font-kantumruy"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-blue-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-yellow-500"
            >
              <Send className="w-4 h-4 text-blue-950" />
              <span className="hidden sm:inline">ផ្ញើ</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
