import React, { useState } from 'react';
import { User } from './types'; 
import Auth from './components/Auth';
import Chat from './components/Chat';
import Announcements from './components/Announcements';
import Schedule from './components/Schedule';
import Quiz from './components/Quiz';
import { MessageSquare, Calendar, Bell, Brain } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'chat' | 'announcements' | 'schedule' | 'quiz'>('chat');

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#020617] text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex justify-between items-center z-20">
        <h1 className="font-mono font-bold tracking-tighter text-lg">
          <span className="text-[#FF3131]">L1</span>.G5 <span className="text-cyan-400 text-xs">MANDARIN_CONNECT</span>
        </h1>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-mono text-slate-400 uppercase">{user.name}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        {view === 'chat' && <Chat currentUser={user} />}
        {view === 'announcements' && <Announcements />}
        {view === 'schedule' && <Schedule />}
        {view === 'quiz' && <Quiz currentUser={user} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-slate-950 border-t border-slate-800 p-2 z-20">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => setView('chat')}
            className={`p-3 flex flex-col items-center gap-1 transition-colors ${view === 'chat' ? 'text-[#FF3131]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-mono">COMMS</span>
          </button>
          
          <button 
            onClick={() => setView('announcements')}
            className={`p-3 flex flex-col items-center gap-1 transition-colors ${view === 'announcements' ? 'text-[#FF3131]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Bell size={20} />
            <span className="text-[10px] font-mono">ALERTS</span>
          </button>

          <button 
            onClick={() => setView('quiz')}
            className={`p-3 flex flex-col items-center gap-1 transition-colors ${view === 'quiz' ? 'text-[#FF3131]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Brain size={20} />
            <span className="text-[10px] font-mono">TRAIN</span>
          </button>
          
          <button 
            onClick={() => setView('schedule')}
            className={`p-3 flex flex-col items-center gap-1 transition-colors ${view === 'schedule' ? 'text-[#FF3131]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Calendar size={20} />
            <span className="text-[10px] font-mono">PLAN</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
