/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { GatheringStep } from './components/GatheringStep';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumeData, INITIAL_RESUME_DATA, TemplateId } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [step, setStep] = useState<'landing' | 'gathering' | 'editing'>('landing');
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [template, setTemplate] = useState<TemplateId>('modern');

  const handleStart = () => setStep('gathering');
  
  const handleGatheringComplete = (data: ResumeData) => {
    setResumeData(data);
    setStep('editing');
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}
        
        {step === 'gathering' && (
          <motion.div
            key="gathering"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <GatheringStep onComplete={handleGatheringComplete} />
          </motion.div>
        )}

        {step === 'editing' && (
          <motion.div
            key="editing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-screen overflow-hidden"
          >
            <ResumeEditor 
              data={resumeData} 
              onDataChange={setResumeData}
              template={template}
              onTemplateChange={setTemplate}
              onBack={() => setStep('gathering')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
