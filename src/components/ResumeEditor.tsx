import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, TemplateId } from '../types';
import { ResumePreview } from './ResumePreview';
import { generateLaTeXCode } from '../services/gemini';
import { 
  Plus, Trash2, Download, Copy, ChevronLeft, 
  User, Briefcase, GraduationCap, Code, Lightbulb,
  Check, Loader2, Share2, Clipboard, Layout
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ResumeEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  template: TemplateId;
  onTemplateChange: (template: TemplateId) => void;
  onBack: () => void;
}

export function ResumeEditor({ data, onDataChange, template, onTemplateChange, onBack }: ResumeEditorProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const [latexLanguage, setLatexLanguage] = useState<'zh' | 'en'>('en');
  const [previewLanguage, setPreviewLanguage] = useState<'zh' | 'en'>('zh');
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education' | 'skills' | 'projects'>('info');

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onDataChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const addItem = (list: 'experience' | 'education' | 'skills' | 'projects') => {
    const newItem = list === 'experience' ? { company: '', position: '', location: '', duration: '', description: [''] }
                 : list === 'education' ? { institution: '', degree: '', location: '', duration: '' }
                 : list === 'skills' ? { category: '', items: [] }
                 : { name: '', description: '', technologies: [] };
    
    onDataChange({ ...data, [list]: [...data[list], newItem] });
  };

  const removeItem = (list: 'experience' | 'education' | 'skills' | 'projects', index: number) => {
    const newList = [...data[list]];
    newList.splice(index, 1);
    onDataChange({ ...data, [list]: newList });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const code = await generateLaTeXCode(data, template, latexLanguage);
      setLatexCode(code);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = () => {
    if (latexCode) {
      navigator.clipboard.writeText(latexCode);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }
  };

  const downloadTex = () => {
    if (latexCode) {
      const blob = new Blob([latexCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${latexLanguage}_${template}.tex`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex h-screen bg-[#ebeae6]">
      {/* Sidebar Editor */}
      <aside className="w-[450px] flex flex-col bg-[#f8f7f4] border-r border-[#dcdad5] z-10 box-border">
        <header className="p-6 border-b border-[#dcdad5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/50 rounded transition-colors text-[var(--color-muted)]">
              <ChevronLeft size={16} />
            </button>
            <div>
              <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] leading-none mb-1">Architect</h1>
              <p className="text-sm font-bold uppercase tracking-widest">Workspace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-white border border-[#dcdad5] p-1">
             {(['modern', 'classic', 'minimalist'] as TemplateId[]).map(t => (
               <button 
                key={t}
                onClick={() => onTemplateChange(t)}
                className={cn(
                  "px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all",
                  template === t ? "bg-[#1a1a1a] text-white" : "text-zinc-400 hover:text-zinc-900"
                )}
               >
                 {t}
               </button>
             ))}
          </div>
        </header>

        <nav className="flex border-b border-[#dcdad5] bg-white shrink-0">
          <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<User size={14} />} label="Ident" />
          <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={14} />} label="Exp" />
          <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={<Code size={14} />} label="Skill" />
          <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<GraduationCap size={14} />} label="Edu" />
          <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Lightbulb size={14} />} label="Proj" />
        </nav>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {activeTab === 'info' && (
            <section className="space-y-10 animate-in fade-in duration-500">
              <div className="flex items-center gap-6 mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 bg-white border border-[#dcdad5] overflow-hidden">
                    {data.personalInfo.photo ? (
                      <img src={data.personalInfo.photo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <User size={32} />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-white font-bold uppercase tracking-widest">Update</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updatePersonalInfo('photo', reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {data.personalInfo.photo && (
                    <button 
                      onClick={() => updatePersonalInfo('photo', '')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
                <div className="space-y-1 border-l-2 border-black pl-4">
                   <h2 className="text-[11px] font-bold uppercase tracking-widest">Base Identity</h2>
                   <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-tighter">Primary contact and location meta</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <Input label="Full Name" value={data.personalInfo.fullName} onChange={v => updatePersonalInfo('fullName', v)} />
                <Input label="Email Address" value={data.personalInfo.email} onChange={v => updatePersonalInfo('email', v)} />
                <Input label="Phone Number" value={data.personalInfo.phone} onChange={v => updatePersonalInfo('phone', v)} />
                <Input label="Primary Location" value={data.personalInfo.location || ''} onChange={v => updatePersonalInfo('location', v)} />
                <Input label="Global Website" value={data.personalInfo.website || ''} onChange={v => updatePersonalInfo('website', v)} />
                <Input label="Network Identity" value={data.personalInfo.linkedin || ''} onChange={v => updatePersonalInfo('linkedin', v)} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#8c8a82]">Professional Statement</label>
                <textarea 
                  value={data.summary}
                  onChange={e => onDataChange({...data, summary: e.target.value})}
                  className="w-full bg-white border border-[#dcdad5] p-5 text-sm min-h-[160px] focus:border-black outline-none font-serif leading-relaxed"
                />
              </div>
            </section>
          )}

          {activeTab === 'experience' && (
            <section className="space-y-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-end border-l-2 border-black pl-4">
                <div className="space-y-1">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest">Career Sequence</h2>
                  <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-tighter">Historical professional milestones</p>
                </div>
                <button onClick={() => addItem('experience')} className="px-3 py-1 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Add +</button>
              </div>
              {data.experience.map((exp, i) => (
                <div key={i} className="p-6 bg-white border border-[#dcdad5] relative space-y-6 group">
                  <button onClick={() => removeItem('experience', i)} className="absolute top-6 right-6 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="Organization" value={exp.company} onChange={v => {
                      const newList = [...data.experience];
                      newList[i].company = v;
                      onDataChange({...data, experience: newList});
                    }} />
                    <Input label="Official Role" value={exp.position} onChange={v => {
                      const newList = [...data.experience];
                      newList[i].position = v;
                      onDataChange({...data, experience: newList});
                    }} />
                    <Input label="Temporal Range" placeholder="e.g. 2019 — Present" value={exp.duration} onChange={v => {
                      const newList = [...data.experience];
                      newList[i].duration = v;
                      onDataChange({...data, experience: newList});
                    }} />
                    <Input label="Base Location" value={exp.location} onChange={v => {
                      const newList = [...data.experience];
                      newList[i].location = v;
                      onDataChange({...data, experience: newList});
                    }} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c8a82]">Impact Metrics</p>
                    <div className="space-y-2">
                       {exp.description.map((bullet, j) => (
                        <div key={j} className="flex gap-3">
                          <input 
                            value={bullet} 
                            onChange={e => {
                              const newList = [...data.experience];
                              newList[i].description[j] = e.target.value;
                              onDataChange({...data, experience: newList});
                            }}
                            className="flex-1 bg-white border border-[#dcdad5] px-4 py-2 text-xs font-serif italic"
                          />
                          <button 
                            onClick={() => {
                              const newList = [...data.experience];
                              newList[i].description.splice(j, 1);
                              onDataChange({...data, experience: newList});
                            }}
                            className="text-zinc-300 hover:text-red-500"
                          ><Trash2 size={12}/></button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const newList = [...data.experience];
                        newList[i].description.push('');
                        onDataChange({...data, experience: newList});
                      }}
                      className="text-[10px] font-bold uppercase underline tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >+ Append Metric</button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'skills' && (
            <section className="space-y-10 animate-in fade-in duration-500">
               <div className="flex justify-between items-end border-l-2 border-black pl-4">
                <div className="space-y-1">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest">Technical Arsenal</h2>
                  <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-tighter">Skill clustering and categories</p>
                </div>
                <button onClick={() => addItem('skills')} className="px-3 py-1 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Add +</button>
              </div>
              {data.skills.map((skill, i) => (
                <div key={i} className="p-8 bg-white border border-[#dcdad5] relative space-y-6">
                  <button onClick={() => removeItem('skills', i)} className="absolute top-6 right-6 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <Input label="Domain Category" placeholder="e.g. Distributed Systems" value={skill.category} onChange={v => {
                    const newList = [...data.skills];
                    newList[i].category = v;
                    onDataChange({...data, skills: newList});
                  }} />
                  <Input label="Entities (comma-separated)" placeholder="React, Go, K8s" value={skill.items.join(', ')} onChange={v => {
                    const newList = [...data.skills];
                    newList[i].items = v.split(',').map(s => s.trim());
                    onDataChange({...data, skills: newList});
                  }} />
                </div>
              ))}
            </section>
          )}
          
          {(activeTab === 'education' || activeTab === 'projects') && (
            <section className="space-y-10 animate-in fade-in duration-500">
               <div className="flex justify-between items-end border-l-2 border-black pl-4">
                <div className="space-y-1">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest">{activeTab}</h2>
                  <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-tighter">Supplemental professional evidence</p>
                </div>
                <button onClick={() => addItem(activeTab)} className="px-3 py-1 border border-black text-[10px] font-bold uppercase tracking-widest">Add +</button>
              </div>
              {activeTab === 'education' ? (
                data.education.map((edu, i) => (
                  <div key={i} className="p-8 bg-white border border-[#dcdad5] relative grid grid-cols-2 gap-6">
                    <button onClick={() => removeItem('education', i)} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500"><Trash2 size={14} /></button>
                    <Input label="Institution" value={edu.institution} onChange={v => {
                      const newList = [...data.education];
                      newList[i].institution = v;
                      onDataChange({...data, education: newList});
                    }} />
                    <Input label="Degree / Cert" value={edu.degree} onChange={v => {
                      const newList = [...data.education];
                      newList[i].degree = v;
                      onDataChange({...data, education: newList});
                    }} />
                    <Input label="Temporal" value={edu.duration} onChange={v => {
                      const newList = [...data.education];
                      newList[i].duration = v;
                      onDataChange({...data, education: newList});
                    }} />
                    <Input label="Location" value={edu.location} onChange={v => {
                      const newList = [...data.education];
                      newList[i].location = v;
                      onDataChange({...data, education: newList});
                    }} />
                  </div>
                ))
              ) : (
                data.projects.map((proj, i) => (
                  <div key={i} className="p-8 bg-white border border-[#dcdad5] relative space-y-6">
                    <button onClick={() => removeItem('projects', i)} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500"><Trash2 size={14} /></button>
                    <div className="grid grid-cols-2 gap-6">
                      <Input label="Identifier" value={proj.name} onChange={v => {
                        const newList = [...data.projects];
                        newList[i].name = v;
                        onDataChange({...data, projects: newList});
                      }} />
                      <Input label="Tech Stack" value={proj.technologies.join(', ')} onChange={v => {
                        const newList = [...data.projects];
                        newList[i].technologies = v.split(',').map(s => s.trim());
                        onDataChange({...data, projects: newList});
                      }} />
                    </div>
                    <Input label="Source / Demo" value={proj.link || ''} onChange={v => {
                      const newList = [...data.projects];
                      newList[i].link = v;
                      onDataChange({...data, projects: newList});
                    }} />
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#8c8a82]">Metric Statement</label>
                       <textarea 
                        value={proj.description}
                        onChange={e => {
                          const newList = [...data.projects];
                          newList[i].description = e.target.value;
                          onDataChange({...data, projects: newList});
                        }}
                        className="w-full bg-white border border-[#dcdad5] p-3 text-xs italic font-serif leading-relaxed focus:border-black outline-none"
                      />
                    </div>
                  </div>
                ))
              )}
            </section>
          )}
        </div>

        <footer className="p-8 border-t border-[#dcdad5] bg-white shrink-0">
          <div className="flex gap-1 bg-[#f8f7f4] border border-[#dcdad5] p-1 mb-4">
            {(['en', 'zh'] as const).map(lang => (
              <button 
                key={lang}
                onClick={() => setLatexLanguage(lang)}
                className={cn(
                  "flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                  latexLanguage === lang ? "bg-[#1a1a1a] text-white" : "text-zinc-400 hover:text-zinc-900"
                )}
              >
                {lang === 'en' ? 'English (Global)' : 'Chinese (Standard)'}
              </button>
            ))}
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-5 bg-[#1a1a1a] text-white text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-black active:scale-[0.98]"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin inline-block mr-2" /> : `System Export (${latexLanguage.toUpperCase()})`}
          </button>
        </footer>
      </aside>

      {/* Preview Section */}
      <main className="flex-1 overflow-y-auto p-12 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-10 max-w-[210mm] px-4">
          <div className="flex gap-8">
            <div className="flex bg-[#f8f7f4] border border-[#dcdad5] p-1">
              {(['en', 'zh'] as const).map(lang => (
                <button 
                  key={lang}
                  onClick={() => setPreviewLanguage(lang)}
                  className={cn(
                    "px-4 py-1 text-[9px] font-bold uppercase tracking-widest transition-all",
                    previewLanguage === lang ? "bg-[#1a1a1a] text-white" : "text-zinc-400 hover:text-zinc-900"
                  )}
                >
                  {lang === 'en' ? 'English' : '中文'}
                </button>
              ))}
            </div>
            <button className="text-[10px] uppercase font-bold tracking-widest border-b border-black pb-1">Visual Preview</button>
          </div>
          <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-[var(--color-muted)]">
             <span>Auto-saved — {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          </div>
        </div>
        <div className="scale-[0.85] border-2 border-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] transition-transform duration-500">
           <ResumePreview data={data} template={template} language={previewLanguage} />
        </div>
      </main>

      {/* Export Modal */}
      <AnimatePresence>
        {latexCode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm flex items-center justify-center p-12"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white w-full max-w-4xl h-[80vh] flex flex-col border border-white"
            >
              <header className="p-8 border-b border-[#dcdad5] flex items-center justify-between">
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1">LaTeX Compiled Source</h2>
                  <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-tighter italic font-serif">Compiled architectural sequence for high-fidelity output</p>
                </div>
                <button onClick={() => setLatexCode(null)} className="p-2 border border-black hover:bg-black hover:text-white transition-all"><Plus size={16} className="rotate-45" /></button>
              </header>
              
              <div className="flex-1 overflow-y-auto p-10 font-mono text-xs bg-[#f8f7f4] text-zinc-900 selection:bg-black selection:text-white whitespace-pre-wrap leading-relaxed">
                {latexCode}
              </div>

              <footer className="p-8 bg-white border-t border-[#dcdad5] flex items-center gap-6">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  {copyStatus ? <Check size={16} /> : <Clipboard size={16} />}
                  {copyStatus ? 'Sequence Copied' : 'Transfer to Clipboard'}
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={downloadTex}
                    className="px-6 py-4 border border-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
                  >
                    Download .tex
                  </button>
                  <button className="px-6 py-4 border border-[#dcdad5] text-zinc-400">
                    <Share2 size={16} />
                  </button>
                </div>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8c8a82] leading-none block">{label}</label>
      <input 
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-[#dcdad5] px-4 py-2.5 text-xs focus:border-black outline-none transition-all placeholder:text-zinc-300"
      />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-4 flex flex-col items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all border-b border-transparent",
        active ? "bg-white text-black border-black border-t border-t-[#dcdad5]" : "bg-[#f8f7f4] text-[#8c8a82] hover:text-black"
      )}
    >
      <div className={cn("transition-transform duration-300", active ? "scale-110" : "scale-100 opacity-50")}>{icon}</div>
      <span className={cn("transition-opacity duration-300", active ? "opacity-100" : "opacity-40")}>{label}</span>
    </button>
  );
}
