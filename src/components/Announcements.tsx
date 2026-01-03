import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from 'date-fns';
import { Bell, AlertCircle } from 'lucide-react';

const Announcements: React.FC = () => {
  const announcements = useQuery(api.main.getAnnouncements) || [];

  return (
    <div className="p-4 space-y-6 animate-glitch pb-24">
      <h2 className="text-2xl font-mono font-bold text-slate-100 flex items-center gap-2 mb-8">
        <Bell className="text-[#FF3131]" /> 
        TRANSMISSIONS
      </h2>

      {announcements.length === 0 ? (
        <div className="text-slate-600 font-mono text-center mt-10">NO DATA RECEIVED</div>
      ) : (
        announcements.map((item, idx) => {
          const isUrgent = item.priority === "urgent";
          return (
            <div 
              key={idx}
              className={`
                relative p-6 backdrop-blur-sm border
                ${isUrgent 
                  ? 'bg-red-900/10 border-[#FF3131]/50 animate-pulse-glow' 
                  : 'bg-slate-800/30 border-slate-700'}
                rounded-tl-none rounded-br-none rounded-tr-2xl rounded-bl-2xl
                hover:translate-x-1 transition-transform
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                {isUrgent && (
                  <span className="flex items-center gap-1 bg-[#FF3131] text-white text-[10px] font-bold px-2 py-1 rounded-sm font-mono animate-pulse">
                    <AlertCircle size={10} /> URGENT
                  </span>
                )}
              </div>
              
              <p className="text-slate-300 font-light text-sm leading-relaxed mb-4">
                {item.content}
              </p>
              
              <div className="flex justify-between items-center border-t border-slate-700/50 pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  {format(new Date(item.created_at), 'yyyy.MM.dd // HH:mm')}
                </span>
                <span className="text-[10px] text-cyan-500 font-mono tracking-widest">
                  SYS.ID.{idx.toString().padStart(3, '0')}
                </span>
              </div>
              
              {/* Decorative Corner */}
              <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${isUrgent ? 'border-[#FF3131]' : 'border-slate-500'}`}></div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Announcements;