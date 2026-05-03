import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResumeData } from '../types';
import { generateResumeContent } from '../services/gemini';
import { cn } from '../lib/utils';

interface GatheringStepProps {
  onComplete: (data: ResumeData) => void;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export function GatheringStep({ onComplete }: GatheringStepProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', content: "Hi! I'm your AI Resume Architect. Let's build your professional story together. Tell me a bit about yourself: what's your current role, and what are some of your key achievements? You can paste your LinkedIn profile text or just chat with me!" }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<ResumeData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // Build full context from messages
      const fullPrompt = [...messages, userMessage].map(m => `${m.role}: ${m.content}`).join('\n');
      const data = await generateResumeContent(fullPrompt, currentDraft || undefined);
      setCurrentDraft(data);

      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        content: "Draft refined! I've structured your info. We can continue adding details (like education, skills, or projects), or if you're ready, we can move to the editor to polish it." 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: 'err', role: 'bot', content: "Sorry, I had a hiccup. Could you try that again?" }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-paper)]">
      <header className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between shrink-0 bg-white">
        <div className="space-y-1">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">System Status</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest">ResuMaster AI Arch</span>
          </div>
        </div>
        
        {currentDraft && (
          <button 
            onClick={() => onComplete(currentDraft)}
            className="px-6 py-3 bg-[var(--color-ink)] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
          >
            Review Draft
          </button>
        )}
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-12 space-y-12 bg-[#f0efeb]"
      >
        <div className="max-w-3xl mx-auto space-y-12">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col gap-2 max-w-[70%]",
                  message.role === 'user' ? "ml-auto items-end" : "items-start"
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-tighter text-[var(--color-muted)]">
                  {message.role === 'user' ? 'Direct Input' : 'Architectural Feedback'}
                </p>
                <div className={cn(
                  "p-6 text-sm leading-relaxed border",
                  message.role === 'user' 
                    ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" 
                    : "bg-white border-[var(--color-line)] shadow-sm italic font-serif"
                )}>
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isGenerating && (
            <div className="flex items-center gap-3 text-[var(--color-muted)] text-[10px] uppercase font-bold tracking-widest">
              <Loader2 size={12} className="animate-spin" />
              Processing narrative sequence...
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-white border-t border-[var(--color-line)]">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your background, education, or career goals..."
            className="w-full bg-[var(--color-paper)] border border-[var(--color-line)] p-6 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-all min-h-[100px] max-h-[300px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="absolute right-6 bottom-6 p-2 text-[var(--color-ink)] opacity-40 hover:opacity-100 disabled:opacity-10 transition-all"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}
