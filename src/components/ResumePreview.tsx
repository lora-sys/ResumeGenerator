import { ResumeData, TemplateId } from '../types';
import { cn } from '../lib/utils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateId;
  language?: 'zh' | 'en';
}

const TRANSLATIONS = {
  en: {
    summary: "System Abstract",
    experience: "Experience Domain",
    skills: "Technical Arsenal",
    education: "Academic Foundation",
    projects: "Select Commissions",
  },
  zh: {
    summary: "个人总结",
    experience: "工作经历",
    skills: "专业技能",
    education: "教育背景",
    projects: "项目经验",
  }
};

export function ResumePreview({ data, template, language = 'en' }: ResumePreviewProps) {
  const isModern = template === 'modern';
  const isClassic = template === 'classic';
  const isMinimal = template === 'minimalist';
  const t = TRANSLATIONS[language];

  return (
    <div 
      className={cn(
        "w-[210mm] min-h-[297mm] bg-white mx-auto p-[20mm] text-[#1a1a1a] transition-all",
        language === 'zh' ? "font-sans" : (isClassic ? "font-serif" : "font-sans"),
        isMinimal ? "p-[25mm]" : ""
      )}
    >
      {/* Header */}
      <header className={cn(
        "mb-10 flex justify-between items-start",
        isModern ? "border-b border-black pb-8" : "",
        isClassic ? "text-center pb-8 border-b-2 border-black flex-col items-center" : "",
        isMinimal ? "mb-14" : ""
      )}>
        <div className={cn(isClassic ? "w-full" : "flex-1")}>
          <h1 className={cn(
            "font-bold tracking-tight",
            isModern ? "text-5xl uppercase" : "text-4xl",
            isClassic ? "font-display italic text-6xl uppercase tracking-tighter" : "",
            isMinimal ? "text-7xl font-light tracking-tighter" : ""
          )}>
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          
          <div className={cn(
            "mt-6 flex flex-wrap gap-y-1 gap-x-6 text-[10px] font-mono uppercase tracking-widest text-[#8c8a82]",
            isClassic ? "justify-center" : "",
            isMinimal ? "mt-8" : ""
          )}>
            {data.personalInfo.email && <div className="flex items-center gap-2">{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div className="flex items-center gap-2">{data.personalInfo.phone}</div>}
            {data.personalInfo.location && <div className="flex items-center gap-2">{data.personalInfo.location}</div>}
            {data.personalInfo.website && <div className="flex items-center gap-2 text-black font-bold underline">{data.personalInfo.website.replace(/^https?:\/\//, '')}</div>}
          </div>
        </div>

        {data.personalInfo.photo && (
          <div className={cn(
            "shrink-0 overflow-hidden border border-zinc-200",
            isClassic ? "mt-6 w-24 h-24 rounded-full" : "w-28 h-32 ml-8 shadow-sm"
          )}>
            <img src={data.personalInfo.photo} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-10">
          <SectionTitle title={t.summary} template={template} />
          <p className={cn(
            "text-xs leading-relaxed text-zinc-700 text-justify",
            isClassic ? "font-serif italic" : ""
          )}>{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-10">
          <SectionTitle title={t.experience} template={template} />
          <div className="space-y-8">
            {data.experience.map((exp, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm uppercase tracking-wide">{exp.position}</h3>
                  <span className="text-[9px] font-mono text-zinc-400">{exp.duration}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs -mt-1">
                  <span className={cn("font-medium italic", isModern ? "text-black underline" : "text-zinc-600 italic")}>{exp.company}</span>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest">{exp.location}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-zinc-700 space-y-1.5 ml-4">
                  {exp.description.map((bullet, j) => (
                    <li key={j} className="pl-1"><span className="relative left-[0.2rem]">{bullet}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-10">
          <SectionTitle title={t.skills} template={template} />
          <div className="grid grid-cols-1 gap-3">
            {data.skills.map((skill, i) => (
              <div key={i} className="text-xs flex gap-4">
                <span className="font-bold text-zinc-800 uppercase tracking-tighter w-24 shrink-0">{skill.category}</span>
                <span className="text-zinc-600 font-serif italic border-l border-zinc-200 pl-4">{skill.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-10">
          <SectionTitle title={t.education} template={template} />
          <div className="space-y-6">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-xs uppercase tracking-wide">{edu.institution}</h3>
                  <span className="text-[9px] font-mono text-zinc-400">{edu.duration}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="italic text-zinc-500 font-serif">{edu.degree}</span>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest">{edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-12">
          <SectionTitle title={t.projects} template={template} />
          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            {data.projects.map((proj, i) => (
              <div key={i} className="space-y-2 border-l border-zinc-100 pl-4">
                <h3 className="font-bold text-xs uppercase tracking-tight">{proj.name}</h3>
                <p className="text-[10px] text-zinc-500 font-mono italic">{proj.technologies.join(' / ')}</p>
                <p className="text-[11px] text-zinc-700 leading-[1.6]">{proj.description}</p>
                {proj.link && <p className="text-[9px] text-black font-bold underline uppercase tracking-widest">{proj.link.replace(/^https?:\/\//, '')}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-auto pt-12 flex justify-center opacity-10">
        <div className="w-24 h-[1px] bg-black"></div>
      </footer>
    </div>
  );
}

function SectionTitle({ title, template }: { title: string, template: TemplateId }) {
  const isModern = template === 'modern';
  const isClassic = template === 'classic';
  const isMinimal = template === 'minimalist';

  return (
    <div className={cn(
      "mb-6 flex items-center gap-6",
      isClassic ? "justify-center mb-8" : ""
    )}>
      <h2 className={cn(
        "font-bold uppercase tracking-[0.25em] text-[10px] shrink-0 border-l-2 border-black pl-3",
        isClassic ? "border-l-0 border-b-2 border-black pb-1 px-4" : "",
        isMinimal ? "border-none text-zinc-300 tracking-[0.4em]" : ""
      )}>
        {title}
      </h2>
      {!isClassic && <div className="h-px bg-zinc-200 w-full" />}
    </div>
  );
}
