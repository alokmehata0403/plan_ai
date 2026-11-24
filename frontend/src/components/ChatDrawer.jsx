import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  MessageSquare
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

const QUICK_PROMPTS = [
  "Can we add a day trip to Mount Fuji?",
  "Recommend authentic ramen near Shinjuku",
  "How can we save $300 on this trip?",
  "What is the best way to get from the airport?",
  "Suggest vegetarian dining options"
];

export default function ChatDrawer() {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    chatMessages, 
    handleSendMessage, 
    isChatLoading, 
    currentPlan,
    formData 
  } = useTravel();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const onSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const text = input;
    setInput('');
    handleSendMessage(text);
  };

  const handleQuickPromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-white border-l border-slate-200 shadow-xl flex flex-col h-full z-10"
          >
            {/* Header */}
            <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Travel Assistant</h3>
                  <p className="text-[11px] text-slate-500">
                    Trip: {currentPlan?.destination || formData.destination}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-600 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {chatMessages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isAssistant 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'bg-slate-900 text-white'
                    }`}>
                      {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isAssistant 
                        ? 'bg-slate-100/90 text-slate-800' 
                        : 'bg-blue-600 text-white font-normal'
                    }`}>
                      <div className="whitespace-pre-line">
                        {msg.text}
                      </div>
                      <span className={`text-[10px] mt-1 block ${isAssistant ? 'text-slate-400' : 'text-blue-200'} text-right`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.3s]" />
                    <span className="text-[11px] ml-1">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={onSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question or request changes..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={isChatLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
