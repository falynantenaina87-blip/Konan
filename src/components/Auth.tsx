import React, { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { User } from '../../types';
import { Shield, Zap } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const loginMutation = useMutation(api.main.login);
  const registerMutation = useMutation(api.main.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        const user = await registerMutation({ email, password, name, role });
        onLogin(user as User);
      } else {
        const user = await loginMutation({ email, password });
        if (user) {
          onLogin(user as User);
        } else {
          setError('Invalid credentials');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-glitch">
      <div className="relative p-1">
        {/* Decorative borders */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FF3131]"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FF3131]"></div>
        
        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-tr-3xl rounded-bl-3xl border border-slate-700 w-full max-w-sm relative z-10 clip-cyber">
          <div className="flex justify-center mb-6 text-[#FF3131] animate-pulse-glow rounded-full p-2 w-16 h-16 mx-auto items-center border border-[#FF3131]">
            <Shield size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-1 text-slate-100 font-mono tracking-tighter">
            L1 G5 ACCESS
          </h2>
          <p className="text-center text-cyan-400 text-xs mb-8 font-mono">SECURE LOGIN // MANDARIN_CONNECT</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="CODENAME"
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 outline-none focus:border-[#FF3131] transition-colors font-mono text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-4 font-mono text-xs text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="accent-[#FF3131]" />
                    STUDENT
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} className="accent-[#FF3131]" />
                    SENSEI
                  </label>
                </div>
              </>
            )}
            
            <input
              type="email"
              placeholder="EMAIL_ID"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 outline-none focus:border-[#FF3131] transition-colors font-mono text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="PASSPHRASE"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 p-3 outline-none focus:border-[#FF3131] transition-colors font-mono text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-[#FF3131] text-xs font-mono">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#FF3131] hover:bg-red-600 text-white font-bold py-3 mt-4 clip-btn transition-transform active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Zap size={16} className="group-hover:animate-pulse" />
              {isRegister ? 'INITIALIZE' : 'CONNECT'}
            </button>
          </form>

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-center mt-6 text-slate-500 text-xs hover:text-cyan-400 transition-colors font-mono"
          >
            {isRegister ? 'ALREADY REGISTERED? LOGIN' : 'NO ACCESS? REGISTER'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;