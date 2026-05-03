import { motion } from 'motion/react';
import { FileText, Sparkles, Send, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-paper)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center space-y-12"
      >
        <div className="flex justify-center mb-4">
          <div className="px-5 py-2 border-2 border-[var(--color-ink)] text-[var(--color-ink)] font-mono text-xs uppercase tracking-widest font-bold">
            ResuMaster — v1.0
          </div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-display font-medium tracking-tight text-[var(--color-ink)] leading-[0.9]">
          The <span className="italic">Standard</span> <br />
          of Resumes
        </h1>
        
        <p className="text-lg text-[var(--color-muted)] max-w-xl mx-auto font-medium uppercase tracking-wider leading-relaxed">
          Craft architectural-grade LaTeX resumes <br /> with generative AI intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
          <button 
            id="start-generating-btn"
            onClick={onStart}
            className="group relative px-12 py-5 bg-[var(--color-ink)] text-white font-bold text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            Init Drafting
          </button>
          
          <div className="flex items-center gap-3 text-[var(--color-muted)] text-[10px] uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 bg-black rounded-full" />
            <span>LaTeX Specialized System</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-0 max-w-6xl w-full border border-[var(--color-line)] bg-white">
        <FeatureCard 
          icon={<Send size={20} />}
          title="Narrative Input"
          description="Speak your career history. Our engine parses the sequence into structured data."
        />
        <FeatureCard 
          icon={<FileText size={20} />}
          title="Modernist LaTeX"
          description="Output formatted specifically for high-growth tech and academic environments."
        />
        <FeatureCard 
          icon={<Sparkles size={20} />}
          title="Sync Editing"
          description="Live architectural updates across all parameters as you modify data."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-10 border-r last:border-r-0 border-[var(--color-line)] space-y-6 hover:bg-[var(--color-paper)] transition-colors group">
      <div className="w-10 h-10 flex items-center justify-center text-[var(--color-ink)] border border-[var(--color-line)]">
        {icon}
      </div>
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{title}</h3>
        <p className="text-[var(--color-muted)] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
