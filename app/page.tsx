"use client";

import { useState, useRef, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import confetti from "canvas-confetti";
import Tilt from "react-parallax-tilt";
import { Typewriter } from "react-simple-typewriter";
import JSZip from "jszip";
// @ts-ignore
import { saveAs } from "file-saver";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  Sparkles, Download, RefreshCw, Maximize, Smartphone, 
  ChevronLeft, ChevronRight, Plus, Palette, Edit3, XCircle,
  Library, Zap
} from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Slide = {
  title: string;
  content: string;
};

const THEMES = [
  { id: "white", name: "MathFit White", bg: "bg-white", text: "text-slate-900", accent: "bg-orange-600", hint: "text-orange-500/60", pattern: "opacity-[0.03]", dot: "bg-white border-slate-200" },
  { id: "indigo", name: "Cuemath Indigo", bg: "bg-[#2D2CC1]", text: "text-white", accent: "bg-orange-600", hint: "text-white/40", pattern: "opacity-[0.1]", dot: "bg-[#2D2CC1]" },
  { id: "midnight", name: "Midnight Pro", bg: "bg-[#0A0E17]", text: "text-white", accent: "bg-orange-600", hint: "text-white/40", pattern: "opacity-[0.1]", dot: "bg-black" },
];

const cleanText = (text: string) => text.replace(/\*\*/g, "").trim();
export default function CuemathStudio() {
  const [idea, setIdea] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [format, setFormat] = useState<"post" | "story">("post");
  const [theme, setTheme] = useState(THEMES[0]);

  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic Font Scaling: Physically prevents text from hitting the footer
  const getTitleSize = (text: string) => {
    const len = text.length;
    if (len > 60) return "text-xl md:text-2xl"; 
    if (len > 40) return "text-2xl md:text-3xl";
    return "text-3xl md:text-5xl";
  };

  const getContentSize = (text: string) => {
    const len = text.length;
    if (len > 180) return "text-[11px] md:text-xs";
    if (len > 120) return "text-xs md:text-sm";
    return "text-sm md:text-lg";
  };

  // 1. Single Slide Download Handler
  const download = async () => {
    if (!cardRef.current) return;
    const downloadToast = toast.loading("📥 Exporting high-res image...");
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: theme.bg.includes("white") ? "#ffffff" : "#0A0E17",
      });
      const link = document.createElement("a");
      link.download = `cuemath-slide-${index + 1}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Saved to downloads!", { id: downloadToast });
    } catch (e) {
      toast.error("Export failed.", { id: downloadToast });
    }
  };

  // 2. Bulk Export Logic (ZIP)
  const downloadAll = async () => {
    if (slides.length === 0 || !cardRef.current) return;
    const zip = new JSZip();
    const batchToast = toast.loading("Preparing ZIP bundle...");
    const originalIndex = index;
    
    try {
      for (let i = 0; i < slides.length; i++) {
        setIndex(i); // Change slide
        await new Promise((r) => setTimeout(r, 600)); // Wait for animation & render
        
        const dataUrl = await htmlToImage.toPng(cardRef.current, {
          pixelRatio: 2,
          backgroundColor: theme.bg.includes("white") ? "#ffffff" : "#0A0E17",
        });
        
        const base64Data = dataUrl.split(",")[1];
        zip.file(`slide-${i + 1}.png`, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `cuemath-carousel-${Date.now()}.zip`);
      toast.success("All slides exported!", { id: batchToast });
    } catch (e) {
      toast.error("Bulk export failed.", { id: batchToast });
    } finally {
      setIndex(originalIndex);
    }
  };

  // 3. AI Generation Handler
  const generate = async () => {
    if (!idea.trim() || loading) return;
    setLoading(true);
    const toastId = toast.loading("Cuemath AI is building your studio...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, format }),
      });
      const data = await res.json();
      if (data.result) {
        setSlides(data.result);
        setIndex(0);
        toast.success("✨ Carousel Generated!", { id: toastId });
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ea580c', '#2D2CC1', '#ffffff'] });
      }
    } catch (err) {
      toast.error("AI connection failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const updateSlideText = (field: keyof Slide, val: string) => {
    const newSlides = [...slides];
    newSlides[index][field] = val;
    setSlides(newSlides);
  };
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans p-4 md:p-10 selection:bg-orange-100 relative overflow-hidden">
      {/* Background Math Blueprint Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <Toaster position="top-center" richColors />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">

        {/* SIDEBAR PANEL */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[50px] shadow-2xl shadow-slate-200/60 border border-slate-50 relative">
            <div className="absolute -top-3 -right-3 bg-[#0F172A] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-white/10 flex items-center gap-1.5">
              <Zap size={10} className="fill-yellow-400 text-yellow-400" /> Studio Pro
            </div>

            {/* Branding Header */}
            <div className="flex items-center gap-5 mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-[22px] flex items-center justify-center shadow-xl shadow-orange-200 transition-transform hover:scale-110">
                <Sparkles className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[#0F172A]">Studio</h1>
            </div>

            <div className="space-y-10">
              {/* Input Group */}
              <div className="relative group">
                <div className="flex justify-between items-center mb-4 px-2">
                   <label className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em] group-focus-within:text-orange-500 transition-colors">Your Idea</label>
                   {idea && (
                    <button onClick={() => setIdea("")} className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer p-1">
                      <XCircle size={18}/>
                    </button>
                   )}
                </div>
                <textarea
                  className="w-full p-8 rounded-[35px] bg-[#F8FAFC] border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all text-base font-medium resize-none min-h-[160px] shadow-inner"
                  placeholder="Why kids forget math concepts..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), generate())}
                />
              </div>

              {/* Format Selection Buttons */}
              <div className="grid grid-cols-2 gap-5">
                <button 
                  onClick={() => setFormat("post")} 
                  className={cn(
                    "cursor-pointer flex flex-col items-center justify-center gap-3 py-10 rounded-[40px] border-2 transition-all active:scale-95",
                    format === "post" ? "bg-[#0F172A] text-white border-[#0F172A] shadow-2xl" : "bg-white text-slate-300 border-slate-50 hover:border-slate-200"
                  )}
                >
                  <Maximize size={24} /> <span className="text-[11px] font-black uppercase tracking-widest">Post (1:1)</span>
                </button>
                <button 
                  onClick={() => setFormat("story")} 
                  className={cn(
                    "cursor-pointer flex flex-col items-center justify-center gap-3 py-10 rounded-[40px] border-2 transition-all active:scale-95",
                    format === "story" ? "bg-[#0F172A] text-white border-[#0F172A] shadow-2xl" : "bg-white text-slate-300 border-slate-50 hover:border-slate-200"
                  )}
                >
                  <Smartphone size={24} /> <span className="text-[11px] font-black uppercase tracking-widest">Story (9:16)</span>
                </button>
              </div>

              {/* Primary Action Button */}
              <button 
                onClick={generate} 
                disabled={loading} 
                className="cursor-pointer w-full bg-orange-600 text-white py-7 rounded-[40px] font-black uppercase tracking-[0.2em] text-lg hover:bg-orange-700 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="animate-spin" /> : "Build Content"}
              </button>
            </div>
          </div>

          {/* Theme Switcher Panel */}
          {slides.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[50px] border border-slate-50 space-y-8 shadow-sm">
               <div className="flex items-center gap-3 px-2 text-slate-400">
                 <Palette size={20}/>
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Themes</h3>
               </div>
               <div className="space-y-4">
                 {THEMES.map((t) => (
                   <button 
                    key={t.id} 
                    onClick={() => setTheme(t)} 
                    className={cn(
                      "cursor-pointer w-full flex items-center justify-between px-10 py-6 rounded-[30px] border-2 transition-all",
                      theme.id === t.id ? "border-orange-500 bg-orange-50/40 text-orange-700 font-bold" : "border-slate-50 bg-[#F8FAFC] text-slate-500 hover:bg-slate-100"
                    )}
                   >
                     <span className="text-base font-semibold">{t.name}</span>
                     <div className={cn(
                       "w-7 h-7 rounded-full border-2",
                       t.dot,
                       theme.id === t.id && "ring-2 ring-orange-500 ring-offset-2"
                     )} />
                   </button>
                 ))}
               </div>
            </motion.div>
          )}
        </aside>
        {/* PREVIEW CANVAS AREA */}
        <main className="lg:col-span-8 flex flex-col items-center justify-center min-h-[800px]">
          {loading ? (
            /* 🔥 1. AI THINKING STATE WITH TYPEWRITER EFFECT */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-[550px] aspect-square rounded-[70px] bg-white shadow-2xl flex flex-col items-center justify-center p-20 border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-indigo-50/30 animate-pulse" />
              <div className="z-10 flex flex-col items-center gap-8">
                <RefreshCw size={48} className="text-orange-500 animate-spin" />
                <div className="text-xl font-black italic uppercase tracking-widest text-[#0F172A] text-center min-h-[1.5em]">
                  <Typewriter
                    words={['Analyzing Math Science...', 'Crafting the Hook...', 'Visualizing Concepts...', 'Finalizing Carousel...']}
                    loop={0} cursor cursorStyle='|' typeSpeed={60} deleteSpeed={40} delaySpeed={1000}
                  />
                </div>
                <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }} animate={{ x: "100%" }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-full h-full bg-orange-500" 
                  />
                </div>
              </div>
            </motion.div>
          ) : slides.length > 0 ? (
            <div className="w-full flex flex-col items-center gap-10">
              
              {/* 🔥 2. THE INTERACTIVE 3D CARD (TILT & HOVER) */}
              <Tilt 
                tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={1000} scale={1.02} 
                className="w-full flex justify-center"
              >
                <div 
                  ref={cardRef} 
                  className={cn(
                    "relative flex flex-col transition-all duration-500",
                    theme.bg, theme.text,
                    format === "post" ? "aspect-square w-full max-w-[550px]" : "aspect-[9/16] w-full max-w-[420px]",
                    "rounded-[70px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
                  )}
                >
                  {/* Pattern Overlay */}
                  <div className={cn("absolute inset-0 pointer-events-none z-0", theme.pattern)} style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '35px 35px' }} />

                  {/* ZONE 1: FIXED HEADER (Top 25% height) */}
                  <header className="h-32 px-12 md:px-16 pt-12 flex justify-between items-start z-20 shrink-0">
                     <div className={cn(theme.accent, "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg")}>
                        {index === 0 ? 'The Hook' : index === slides.length - 1 ? 'Action' : `Insight ${index}`}
                     </div>
                     <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50 transition-transform hover:rotate-3">
                       <img src="/cuemath-logo.jpg" className="h-6 w-auto object-contain" alt="Logo" />
                     </div>
                  </header>

                  {/* ZONE 2: SAFE CONTENT BOX (Middle Tier) */}
                  <div className="flex-1 flex flex-col justify-center px-12 md:px-16 z-10 relative text-center min-h-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={index} // Key ensures animation runs on slide flip
                        initial={{ x: 25, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -25, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="flex-1 flex flex-col justify-center items-center overflow-hidden py-4"
                      >
                        <h2 
                          contentEditable suppressContentEditableWarning
                          onBlur={(e) => updateSlideText("title", e.currentTarget.innerText)}
                          className={cn(getTitleSize(slides[index].title), "font-black tracking-tighter leading-[1.1] mb-6 outline-none focus:bg-orange-500/10 rounded-2xl p-2 transition-all cursor-text")}
                        >
                          {cleanText(slides[index].title)}
                        </h2>
                        <p 
                          contentEditable suppressContentEditableWarning
                          onBlur={(e) => updateSlideText("content", e.currentTarget.innerText)}
                          className={cn(getContentSize(slides[index].content), "opacity-90 leading-relaxed font-medium outline-none focus:bg-orange-500/10 rounded-2xl p-2 transition-all cursor-text")}
                        >
                          {cleanText(slides[index].content)}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    
                    <div className={cn("mt-auto pb-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors shrink-0", theme.hint)}>
                      <Edit3 size={12}/> Click Text to tweak
                    </div>
                  </div>
                  {/* ZONE 3: FIXED FOOTER (Strictly anchored to bottom) */}
                  <footer className="min-h-[160px] px-12 md:px-16 border-t border-current/10 flex justify-between items-center z-10 shrink-0 relative bg-inherit pb-10">
                     <div className="text-left pt-2">
                       <p className="text-[14px] font-black tracking-widest uppercase mb-1 italic">CUEMATH ACADEMY</p>
                       <p className="text-[10px] opacity-60 font-bold tracking-[0.1em] uppercase">WE MAKE YOUR CHILD MATHFIT™</p>
                     </div>
                     {/* NUMBER POSITIONED HIGHER TO AVOID CORNER CLIPPING */}
                     <div className="text-[120px] font-black opacity-[0.06] leading-none select-none absolute right-12 bottom-6">
                        {index + 1}
                     </div>
                  </footer>

                  {/* Brand Accents blurs */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                </div>
              </Tilt>

              {/* ACTION BAR - High-End Floating Controls */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-6 bg-[#0F172A] text-white p-7 rounded-[45px] shadow-2xl transition-all border border-white/5 active:scale-[0.99]"
              >
                {/* Navigation Arrows */}
                <button 
                  onClick={() => setIndex(Math.max(0, index - 1))} 
                  disabled={index === 0} 
                  className="cursor-pointer p-3 hover:bg-white/10 rounded-full disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={32} />
                </button>
                
                <div className="flex flex-col items-center gap-3 min-w-[160px]">
                  <div className="flex gap-2.5">
                    {slides.map((_, i) => (
                      <motion.div 
                        key={i} 
                        animate={{ 
                          width: i === index ? 40 : 8,
                          backgroundColor: i === index ? "#f97316" : "rgba(255,255,255,0.2)"
                        }}
                        className="h-2 rounded-full shadow-sm" 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] select-none">
                    Slide {index + 1} of {slides.length}
                  </span>
                </div>

                <button 
                  onClick={() => setIndex(Math.min(slides.length - 1, index + 1))} 
                  disabled={index === slides.length - 1} 
                  className="cursor-pointer p-3 hover:bg-white/10 rounded-full disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={32} />
                </button>
                
                <div className="h-10 w-[1px] bg-white/10 mx-2" />
                
                <div className="flex items-center gap-3">
                  {/* ZIP Export Handler */}
                  <button 
                    onClick={downloadAll} 
                    className="cursor-pointer flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 shadow-lg"
                  >
                    <Library size={18} /> Export All (ZIP)
                  </button>

                  {/* Single PNG Export Handler */}
                  <button 
                    onClick={download} 
                    className="cursor-pointer flex items-center gap-3 bg-orange-600 text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl active:scale-95 group"
                  >
                    <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
                    Export PNG
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            /* EMPTY STATE: WAITING FOR USER INPUT */
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-[750px] flex flex-col items-center justify-center text-slate-200"
            >
              <div className="bg-white p-24 rounded-[80px] shadow-sm border border-slate-50 flex flex-col items-center group">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-90 transition-all duration-700">
                  <Plus size={64} strokeWidth={1} className="text-slate-300" />
                </div>
                <p className="text-[12px] font-black uppercase tracking-[0.6em] opacity-30 text-center leading-loose select-none">
                  Describe your idea to start <br/> the studio session
                </p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}