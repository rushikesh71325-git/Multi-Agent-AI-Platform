import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeArtifact, setActiveTab } from '../Redux/artifactSlice';
import { X, Code2, Eye, Download, Copy, Check, Presentation, FileCode, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PresentationViewer = ({ data, onDownload }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = data?.slides || [];
    const totalSlides = slides.length + 1; // 1 title slide + content slides

    const isCover = currentSlide === 0;
    const contentSlide = !isCover ? slides[currentSlide - 1] : null;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#07090e] select-none">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/[0.06] text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-semibold text-slate-200">
                        {isCover ? 'Title Slide' : `Slide ${currentSlide} of ${slides.length}`}
                    </span>
                    <span className="text-[10px] bg-white/[0.06] px-2 py-0.5 rounded-full text-indigo-300">
                        16:9 HD
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] border-none cursor-pointer transition shadow-sm"
                    >
                        <Download size={12} />
                        Download .pptx
                    </button>
                </div>
            </div>

            {/* Slide Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">
                <div className="w-full max-w-2xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col relative transition-all duration-300">
                    {isCover ? (
                        // ==================== COVER SLIDE ====================
                        <div className="w-full h-full bg-gradient-to-br from-[#0b0f19] via-[#0f172a] to-[#131b2e] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden text-left">
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                            <div>
                                {data?.category && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[10px] tracking-wider uppercase border border-indigo-500/30 mb-4">
                                        <Sparkles size={10} /> {data.category}
                                    </span>
                                )}
                                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                    {data?.title || 'Executive Presentation'}
                                </h1>
                                {data?.subtitle && (
                                    <p className="text-xs md:text-sm text-slate-400 mt-3 max-w-lg leading-relaxed">
                                        {data.subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500">
                                <span>Saksham Multi-Agent AI Platform</span>
                                <span>Executive Slide Deck</span>
                            </div>
                        </div>
                    ) : (
                        // ==================== CONTENT SLIDE ====================
                        <div className="w-full h-full bg-slate-50 flex flex-col text-left overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#0b0f19] px-6 py-3.5 flex items-center justify-between border-b-2 border-indigo-500 shrink-0">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs">
                                        0{currentSlide}
                                    </span>
                                    <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                                        {contentSlide?.title || `Section ${currentSlide}`}
                                    </h3>
                                </div>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                    {data?.title?.slice(0, 24)}...
                                </span>
                            </div>

                            {/* Body */}
                            <div className="flex-1 p-5 md:p-6 flex flex-col justify-between overflow-y-auto">
                                {/* Takeaway Banner */}
                                {contentSlide?.takeaway && (
                                    <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 text-xs font-semibold flex items-center gap-2 mb-3 shrink-0">
                                        <span>💡</span>
                                        <span className="truncate">{contentSlide.takeaway}</span>
                                    </div>
                                )}

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 items-stretch">
                                    {(contentSlide?.cards && contentSlide.cards.length > 0) ? (
                                        contentSlide.cards.slice(0, 3).map((card, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="h-1 w-8 rounded-full bg-indigo-500 mb-2.5" />
                                                    <h4 className="text-xs font-bold text-slate-900 mb-2">
                                                        {card.heading}
                                                    </h4>
                                                    <ul className="space-y-1.5 pl-3 list-disc text-[11px] text-slate-600 leading-relaxed">
                                                        {(card.bullets || []).map((b, bi) => (
                                                            <li key={bi}>{b}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 bg-white rounded-xl p-4 border border-slate-200">
                                            <ul className="space-y-2 pl-4 list-disc text-xs text-slate-700">
                                                {(contentSlide?.bullets || []).map((b, bi) => (
                                                    <li key={bi}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
                                    <span>{data?.title}</span>
                                    <span>Slide {currentSlide} of {slides.length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Slide Navigation Bar */}
            <div className="px-6 py-3 bg-black/40 border-t border-white/[0.06] flex items-center justify-between">
                <button
                    disabled={currentSlide === 0}
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed text-xs text-slate-200 border-none cursor-pointer transition"
                >
                    <ChevronLeft size={14} /> Previous
                </button>

                {/* Slide Dots */}
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all ${
                                currentSlide === idx
                                    ? 'w-6 bg-indigo-500'
                                    : 'bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>

                <button
                    disabled={currentSlide === totalSlides - 1}
                    onClick={() => setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed text-xs text-slate-200 border-none cursor-pointer transition"
                >
                    Next <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

const Artifact = () => {
    const dispatch = useDispatch();
    const { isOpen, artifact, activeTab } = useSelector((state) => state.artifact || {});
    const [copied, setCopied] = useState(false);

    if (!isOpen || !artifact) {
        return null;
    }

    const { type = 'code', title = 'Artifact', content = '', language = 'javascript', downloadUrl, fileName, presentationData } = artifact;

    const parsedPresentation = presentationData || (() => {
        try {
            return JSON.parse(content);
        } catch {
            return null;
        }
    })();

    const handleCopy = async () => {
        if (!content) return;
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';
        if (downloadUrl) {
            const finalUrl = downloadUrl.startsWith('http') ? downloadUrl : `${serverUrl}${downloadUrl}`;
            const a = document.createElement('a');
            a.href = finalUrl;
            a.download = fileName || 'presentation.pptx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else if (content) {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${language === 'html' ? 'html' : language === 'python' ? 'py' : 'txt'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="w-full xl:w-[500px] 2xl:w-[600px] h-screen shrink-0 bg-[#07090e] border-l border-white/[0.08] flex flex-col z-30 transition-all duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
                        {type === 'ppt' ? <Presentation size={15} /> : type === 'web' ? <Eye size={15} /> : <FileCode size={15} />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-[13.5px] font-semibold text-slate-100 truncate">{title}</h3>
                        <span className="text-[10px] uppercase font-semibold text-indigo-400/90 tracking-wider">
                            {type === 'web' ? 'Web Application' : type === 'ppt' ? 'Presentation Deck' : language}
                        </span>
                    </div>
                </div>

                {/* Window Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handleCopy}
                        title="Copy Code"
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors border-none bg-transparent cursor-pointer"
                    >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    {(downloadUrl || content) && (
                        <button
                            onClick={handleDownload}
                            title="Download Artifact"
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors border-none bg-transparent cursor-pointer"
                        >
                            <Download size={14} />
                        </button>
                    )}
                    <button
                        onClick={() => dispatch(closeArtifact())}
                        title="Close Panel"
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors border-none bg-transparent cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* Mode Switcher Tabs */}
            {(type === 'web' || type === 'ppt') && (
                <div className="flex items-center gap-1 px-4 py-2 bg-black/20 border-b border-white/[0.06]">
                    <button
                        onClick={() => dispatch(setActiveTab('preview'))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer transition-all ${
                            activeTab === 'preview'
                                ? 'bg-indigo-500/20 text-indigo-300 font-semibold shadow-sm'
                                : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                        }`}
                    >
                        <Eye size={13} />
                        {type === 'ppt' ? 'Slide Deck' : 'Live Preview'}
                    </button>
                    <button
                        onClick={() => dispatch(setActiveTab('code'))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer transition-all ${
                            activeTab === 'code'
                                ? 'bg-indigo-500/20 text-indigo-300 font-semibold shadow-sm'
                                : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                        }`}
                    >
                        <Code2 size={13} />
                        {type === 'ppt' ? 'Slide Outline' : 'Code Source'}
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative bg-[#090b0e]">
                {type === 'web' && activeTab === 'preview' ? (
                    <div className="w-full h-full bg-white flex flex-col">
                        <iframe
                            title="Interactive Preview"
                            srcDoc={content}
                            sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                            className="w-full h-full border-none"
                        />
                    </div>
                ) : (type === 'ppt' && activeTab === 'preview' && parsedPresentation) ? (
                    <PresentationViewer data={parsedPresentation} onDownload={handleDownload} />
                ) : (
                    <div className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <SyntaxHighlighter
                            language={language || 'javascript'}
                            style={vscDarkPlus}
                            showLineNumbers
                            wrapLongLines
                            customStyle={{
                                margin: 0,
                                padding: '20px',
                                background: 'transparent',
                                fontSize: '13px',
                                lineHeight: '1.6',
                            }}
                        >
                            {content}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Artifact;