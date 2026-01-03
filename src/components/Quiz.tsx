import React, { useState } from 'react';
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { QuizQuestion, User } from '../../types';
import { Brain, CheckCircle, XCircle, ChevronRight, RefreshCw, Trophy, BarChart } from 'lucide-react';

interface QuizProps {
  currentUser?: User;
}

const Quiz: React.FC<QuizProps> = ({ currentUser }) => {
  const generateQuiz = useAction(api.actions.generateQuiz);
  const saveResult = useMutation(api.main.saveQuizResult);
  
  const userId = currentUser?._id;
  const history = useQuery(api.main.getUserQuizResults, userId ? { user_id: userId } : "skip") || [];
  
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('HSK1');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const hskLevels = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'];

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    
    try {
      const qs = await generateQuiz({ topic, difficulty });
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return; 
    setSelectedOption(optionIdx);
    
    if (optionIdx === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(p => p + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      if (currentUser) {
        await saveResult({
          user_id: currentUser._id,
          score: score + (selectedOption === questions[currentIndex].correctAnswerIndex ? 1 : 0),
          total: questions.length,
          topic: `${topic} (${difficulty})`
        });
      }
    }
  };

  return (
    <div className="p-4 animate-glitch pb-24 h-full flex flex-col overflow-y-auto">
       <h2 className="text-2xl font-mono font-bold text-slate-100 flex items-center gap-2 mb-6">
        <Brain className="text-[#FF3131]" />
        NEURAL DRILL
      </h2>

      {history.length > 0 && !questions.length && (
        <div className="mb-8 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
          <h3 className="text-xs font-mono text-cyan-500 mb-3 flex items-center gap-2">
            <Trophy size={12} /> HISTORIQUE
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {history.map((h, i) => (
              <div key={i} className="flex-shrink-0 bg-slate-950 p-2 border border-slate-800 min-w-[100px]">
                <div className="text-[10px] text-slate-400 truncate w-24">{h.topic}</div>
                <div className="text-lg font-bold text-slate-200">{h.score}/{h.total}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length === 0 && !loading ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-6">
           
           <div className="w-full max-w-xs">
              <label className="text-xs text-cyan-500 font-mono mb-2 flex items-center gap-1">
                <BarChart size={12} /> NIVEAU (DIFFICULTY)
              </label>
              <div className="grid grid-cols-3 gap-2">
                 {hskLevels.map(level => (
                   <button
                     key={level}
                     onClick={() => setDifficulty(level)}
                     className={`py-2 text-xs font-mono border transition-all active:scale-95 ${difficulty === level ? 'bg-[#FF3131] border-[#FF3131] text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-cyan-500'}`}
                   >
                     {level}
                   </button>
                 ))}
              </div>
           </div>

           <div className="relative w-full max-w-xs">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="SUJET (ex: Salutations)"
                className="w-full bg-slate-900 border border-slate-700 p-4 text-center text-slate-100 font-mono outline-none focus:border-cyan-400 transition-colors rounded-none"
              />
              <div className="absolute inset-0 border border-transparent pointer-events-none">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>
              </div>
           </div>
           
           <button 
             onClick={handleGenerate}
             className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-8 clip-btn transition-transform active:scale-95 font-mono w-full max-w-xs"
           >
             GÉNÉRER
           </button>
        </div>
      ) : loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-cyan-400 font-mono animate-pulse">
           <RefreshCw className="animate-spin mb-4" size={32} />
           INITIALISATION DU PROTOCOLE...
           <span className="text-xs text-slate-500 mt-2">Génération en Français...</span>
        </div>
      ) : showResult ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 p-8 clip-cyber border border-slate-700">
           <div className="text-4xl font-bold text-white mb-2">
             {score + (selectedOption === questions[currentIndex]?.correctAnswerIndex ? 1 : 0)} / {questions.length}
           </div>
           <div className="text-slate-400 font-mono mb-8">ANALYSE TERMINÉE</div>
           <button 
             onClick={() => { setQuestions([]); setTopic(''); }}
             className="flex items-center gap-2 text-[#FF3131] hover:text-white transition-colors"
           >
             <RefreshCw size={16} /> REBOOT SYSTEM
           </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="w-full bg-slate-800 h-1 mb-6">
            <div 
              className="bg-cyan-500 h-1 transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="mb-6">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-mono text-slate-500">Q.0{currentIndex + 1}</span>
               <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-1 rounded border border-cyan-900/50">{difficulty}</span>
             </div>
             <h3 className="text-xl font-bold text-slate-100 mt-2">{questions[currentIndex].question}</h3>
          </div>

          <div className="space-y-3">
            {questions[currentIndex].options.map((opt, idx) => {
              let btnClass = "bg-slate-800 border-slate-700 hover:border-slate-500";
              
              if (selectedOption !== null) {
                if (idx === questions[currentIndex].correctAnswerIndex) {
                  btnClass = "bg-green-900/30 border-green-500 text-green-400";
                } else if (idx === selectedOption) {
                  btnClass = "bg-red-900/30 border-red-500 text-red-400";
                } else {
                  btnClass = "bg-slate-900 border-slate-800 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 border ${btnClass} transition-all duration-200 font-sans font-light flex items-center justify-between`}
                >
                  {opt}
                  {selectedOption !== null && idx === questions[currentIndex].correctAnswerIndex && <CheckCircle size={16} />}
                  {selectedOption === idx && idx !== questions[currentIndex].correctAnswerIndex && <XCircle size={16} />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="mt-6 animate-glitch">
               <div className="text-xs font-mono text-cyan-400 mb-2">INTEL (Explication):</div>
               <p className="text-sm text-slate-300 italic border-l-2 border-cyan-500 pl-3">
                 {questions[currentIndex].explanation}
               </p>
               <button 
                 onClick={nextQuestion}
                 className="mt-6 w-full bg-slate-100 text-slate-900 font-bold py-3 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 clip-btn"
               >
                 SUIVANT <ChevronRight size={16} />
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;