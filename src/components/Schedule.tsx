import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Calendar, Clock, MapPin } from 'lucide-react';

const Schedule: React.FC = () => {
  const schedule = useQuery(api.main.getSchedule) || [];

  return (
    <div className="p-4 animate-glitch pb-24">
      <h2 className="text-2xl font-mono font-bold text-slate-100 flex items-center gap-2 mb-8">
        <Calendar className="text-cyan-400" />
        CHRONOLOGY
      </h2>

      <div className="space-y-3">
        {schedule.map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center bg-slate-900 border-l-4 border-cyan-500 p-4 shadow-lg hover:bg-slate-800 transition-colors"
          >
            <div className="flex flex-col w-20 border-r border-slate-700 pr-4 mr-4 text-center">
              <span className="text-xl font-bold text-slate-100 font-sans uppercase">{item.day.substring(0,3)}</span>
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">{item.subject}</h3>
              <div className="flex gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-[#FF3131]" /> {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-cyan-400" /> {item.room}
                </span>
              </div>
            </div>
          </div>
        ))}
        {schedule.length === 0 && (
            <div className="p-8 border border-dashed border-slate-700 text-center text-slate-500 font-mono text-sm">
                NO SCHEDULED OPS
            </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;