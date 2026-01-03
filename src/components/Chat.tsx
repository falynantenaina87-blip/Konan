import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { User, Message, TranslationData } from '../../types';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatProps {
  currentUser: User;
}

const Chat: React.FC<ChatProps> = ({ currentUser }) => {
  const messages = useQuery(api.main.listMessages) || [];
  const sendMessage = useMutation(api.main.sendMessage);
  const translateAction = useAction(api.actions.translateText);
  
  const [newMessage, setNewMessage] = useState('');
  const [translations, setTranslations] = useState<Record<string, TranslationData | "loading">>(
    {}
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage({
      user_id: currentUser._id,
      content: newMessage,
    });
    setNewMessage('');
  };

  const handleTranslate = async (msgId: string, content: string) => {
    if (translations[msgId]) return;

    setTranslations(prev => ({ ...prev, [msgId]: "loading" }));

    try {
      const result = await translateAction({ text: content });
      setTranslations(prev => ({ ...prev, [msgId]: result }));
    } catch (error) {
      console.error("Translation failed", error);
      setTranslations(prev => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden animate-glitch">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.user_id === currentUser._id;
          const translation = translations[msg._id];
          const isLoading = translation === "loading";

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                onClick={() => handleTranslate(msg._id, msg.content)}
                className={`
                  relative max-w-[85%] p-4 cursor-pointer transition-all duration-200 active:scale-95 group
                  ${isMe 
                    ? 'bg-slate-800 text-slate-100 rounded-tr-3xl rounded-bl-3xl rounded-tl-lg rounded-br-none border-r-2 border-[#FF3131]' 
                    : 'bg-slate-900 text-slate-100 rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-none border-l-2 border-cyan-500'}
                  hover:shadow-[0_0_15px_rgba(2,6,23,0.8)]
                `}
              >
                {!isMe && (
                  <div className="text-xs text-cyan-400 font-mono mb-1 opacity-70">
                    {msg.senderName} <span className="text-[10px] text-slate-500">[{msg.senderRole.toUpperCase()}]</span>
                  </div>
                )}
                
                <p className="font-sans font-light text-lg leading-relaxed">{msg.content}</p>

                {isLoading && (
                  <div className="mt-2 flex items-center gap-2 text-[#FF3131] text-xs font-mono animate-pulse">
                    <Loader2 size={12} className="animate-spin" />
                    DECODING...
                  </div>
                )}

                {translation && translation !== "loading" && (
                  <div className="mt-3 pt-2 border-t border-white/10 animate-glitch">
                    <div className="flex items-center gap-2 mb-1">
                       <Sparkles size={12} className="text-yellow-400" />
                       <span className="text-yellow-400 text-xl font-serif">{translation.hanzi}</span>
                    </div>
                    <div className="text-cyan-300 text-sm font-mono mb-3">{translation.pinyin}</div>
                    
                    <div className="space-y-1">
                      <div className="flex gap-2 text-xs font-light">
                        <span className="font-bold text-blue-400 font-mono">FR:</span>
                        <span className="text-slate-300 italic">{translation.translation_fr}</span>
                      </div>
                      <div className="flex gap-2 text-xs font-light">
                        <span className="font-bold text-green-500 font-mono">MG:</span>
                        <span className="text-slate-300 italic">{translation.translation_mg}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-1 h-1 bg-[#FF3131] rounded-full"></div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="TYPE_MESSAGE..."
            className="flex-1 bg-slate-900 border-b-2 border-slate-700 text-slate-200 p-3 outline-none focus:border-cyan-500 font-mono text-sm transition-colors rounded-none"
          />
          <button
            type="submit"
            className="p-3 bg-[#FF3131] text-white hover:bg-red-600 transition-all clip-btn active:translate-y-1"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;