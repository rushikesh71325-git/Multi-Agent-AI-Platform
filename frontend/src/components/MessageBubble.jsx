import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
    ExternalLink, 
    X, 
    Check, 
    Copy, 
    Download, 
    ZoomIn, 
    Loader2, 
    Presentation, 
    RefreshCw, 
    Sparkles, 
    User,
    FileText,
    ArrowDownToLine,
    Maximize2
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useDispatch } from 'react-redux'
import { openArtifact } from '../Redux/artifactSlice'

const ImageItem = ({ src, onZoom }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);

    const handleDownload = (e) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = imgSrc;
        a.download = `yug-ai-artwork-${Date.now()}.jpg`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleRetry = (e) => {
        e.stopPropagation();
        setHasError(false);
        setIsLoading(true);
        const separator = imgSrc.includes('?') ? '&' : '?';
        setImgSrc(`${src}${separator}retry=${Date.now()}`);
    };

    return (
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#07090e] w-full sm:w-[320px] md:w-[360px] aspect-square flex items-center justify-center shadow-xl shadow-black/40">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-10 gap-2.5">
                    <Loader2 size={26} className="text-fuchsia-400 animate-spin" />
                    <span className="text-xs text-slate-300 font-semibold tracking-wide">Rendering high-res artwork...</span>
                </div>
            )}

            {hasError ? (
                <div className="flex flex-col items-center justify-center p-5 text-center gap-3">
                    <span className="text-xs text-rose-300 font-medium">Generation took longer than expected</span>
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 border-none cursor-pointer transition"
                    >
                        <RefreshCw size={13} /> Retry Artwork
                    </button>
                </div>
            ) : (
                <>
                    <img
                        src={imgSrc}
                        alt="AI Generated Artwork"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                        onClick={() => onZoom(imgSrc)}
                        className={`w-full h-full object-cover cursor-zoom-in transition-all duration-300 group-hover:scale-105 ${
                            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                    />
                    {!isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3.5 pointer-events-none">
                            <span className="text-[10.5px] font-semibold text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                                1024 × 1024 • HD
                            </span>
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <button
                                    onClick={() => onZoom(imgSrc)}
                                    title="View Full Resolution"
                                    className="p-2 rounded-xl bg-black/60 hover:bg-black/85 text-white border border-white/15 cursor-pointer transition"
                                >
                                    <Maximize2 size={13} />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    title="Download Artwork"
                                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-95 text-white text-xs font-semibold border-none cursor-pointer transition shadow-md"
                                >
                                    <Download size={13} />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

function MessageBubble({ role, content = "", images }) {
    const isUser = role === "user"
    const dispatch = useDispatch()
    const [lightBox, setLightBox] = useState(null)
    const [copiedBubble, setCopiedBubble] = useState(false)
    const [copiedCode, setCopiedCode] = useState("")

    const copyEntireMessage = async () => {
        if (!content) return;
        await navigator.clipboard.writeText(content);
        setCopiedBubble(true);
        setTimeout(() => setCopiedBubble(false), 2000);
    };

    const copyCode = async (code) => {
        await navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(""), 2000)
    }

    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

    return (
        <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-2`}>
            {isUser ? (
                // ==================== USER MESSAGE ====================
                <div className="flex items-end gap-2.5 max-w-[90vw] md:max-w-[75%]">
                    <div className="w-fit bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white px-5 py-3.5 rounded-2xl rounded-br-sm shadow-xl shadow-indigo-600/20 border border-indigo-400/25 break-words leading-relaxed text-[14px]">
                        <p className="whitespace-pre-wrap">{content}</p>
                    </div>
                </div>
            ) : (
                // ==================== ASSISTANT MESSAGE ====================
                <div className="flex flex-col gap-1.5 w-full max-w-[96vw] md:max-w-[85%]">
                    {/* Assistant Header */}
                    <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                <Sparkles size={12} />
                            </div>
                            <span className="font-bold text-slate-200 text-xs tracking-tight">Yug-AI</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>

                        <button
                            onClick={copyEntireMessage}
                            title="Copy Response"
                            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 bg-transparent border-none cursor-pointer transition px-2 py-1 rounded-md hover:bg-white/[0.05]"
                        >
                            {copiedBubble ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            <span>{copiedBubble ? "Copied" : "Copy"}</span>
                        </button>
                    </div>

                    {/* Main Assistant Body */}
                    <div className="bg-[#0e121d] border border-white/[0.08] shadow-2xl shadow-black/30 rounded-2xl rounded-tl-sm p-5 md:p-6 text-slate-200 break-words leading-relaxed">
                        {/* Images Grid */}
                        {images?.length > 0 && (
                            <div className='flex flex-wrap gap-4 mb-4'>
                                {images.map((img, i) => (
                                    <ImageItem key={i} src={img} onZoom={setLightBox} />
                                ))}
                            </div>
                        )}

                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className='text-2xl font-extrabold text-white tracking-tight mt-5 mb-3 pb-2 border-b border-white/[0.08]'>
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className='text-lg font-bold text-indigo-200 mt-4 mb-2'>
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className='text-base font-semibold text-cyan-300 mt-3 mb-1.5'>
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className='mb-3 text-[14px] text-slate-200 leading-relaxed break-words'>
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className='list-disc pl-5 space-y-1.5 my-2.5 text-[14px] text-slate-300 marker:text-indigo-400'>
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className='list-decimal pl-5 space-y-1.5 my-2.5 text-[14px] text-slate-300 marker:text-indigo-400'>
                                        {children}
                                    </ol>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className='border-l-4 border-indigo-500 bg-indigo-500/[0.08] px-4 py-2.5 rounded-r-xl my-3 text-slate-300 italic text-[13.5px]'>
                                        {children}
                                    </blockquote>
                                ),
                                table: ({ children }) => (
                                    <div className='overflow-x-auto my-4 rounded-xl border border-white/10 shadow-md'>
                                        <table className='min-w-full text-xs text-left divide-y divide-white/10'>
                                            {children}
                                        </table>
                                    </div>
                                ),
                                th: ({ children }) => (
                                    <th className='bg-white/[0.06] px-4 py-2.5 font-bold text-slate-200 text-xs tracking-wide uppercase'>
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className='px-4 py-2.5 text-slate-300 text-xs border-t border-white/[0.04] bg-white/[0.01]'>
                                        {children}
                                    </td>
                                ),
                                a: ({ href, children }) => {
                                    const resolvedHref = href?.startsWith('/') ? `${serverUrl}${href}` : href;
                                    const isPpt = resolvedHref?.toLowerCase().includes('download-ppt') || resolvedHref?.toLowerCase().endsWith('.pptx');

                                    if (isPpt) {
                                        return (
                                            <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0e121d] border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                                                        <Presentation size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-white tracking-wide">PowerPoint Presentation Deck</h4>
                                                        <p className="text-[11px] text-slate-400">Ready for presentation & slide review</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => dispatch(openArtifact())}
                                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 border border-white/10 cursor-pointer transition"
                                                    >
                                                        <span>View Slides</span>
                                                    </button>
                                                    <a
                                                        href={resolvedHref}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-xs font-bold text-white no-underline shadow-lg shadow-purple-500/25 transition"
                                                    >
                                                        <ArrowDownToLine size={14} />
                                                        <span>Download .pptx</span>
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <a
                                            href={resolvedHref}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-cyan-400 underline underline-offset-2 inline-flex items-center gap-1 hover:text-cyan-300 font-medium transition"
                                        >
                                            {children}
                                            <ExternalLink size={12} />
                                        </a>
                                    );
                                },
                                code: ({ className, children }) => {
                                    const value = String(children).trim();

                                    if (!className) {
                                        return (
                                            <code className='px-1.5 py-0.5 rounded-md bg-white/[0.08] text-pink-300 text-xs font-mono border border-white/[0.08]'>
                                                {value}
                                            </code>
                                        );
                                    }

                                    const match = /language-(\w+)/.exec(className || "");
                                    const language = match ? match[1] : "text";

                                    return (
                                        <div className="relative my-4 rounded-2xl overflow-hidden border border-white/10 bg-[#080b11] shadow-xl">
                                            {/* macOS Window Titlebar */}
                                            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08] text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                                    </div>
                                                    <span className="ml-2 font-mono uppercase text-[10.5px] font-bold text-indigo-300 tracking-wider">
                                                        {language}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => copyCode(value)}
                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-[11px] font-medium border-none cursor-pointer transition"
                                                >
                                                    {copiedCode === value ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                    <span>{copiedCode === value ? "Copied" : "Copy Code"}</span>
                                                </button>
                                            </div>

                                            <SyntaxHighlighter
                                                language={language}
                                                style={vscDarkPlus}
                                                showLineNumbers
                                                customStyle={{
                                                    margin: 0,
                                                    padding: "18px",
                                                    background: "transparent",
                                                    fontSize: "13px",
                                                    lineHeight: "1.65",
                                                }}
                                            >
                                                {value}
                                            </SyntaxHighlighter>
                                        </div>
                                    );
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            {/* LightBox Modal */}
            {lightBox && (
                <div
                    onClick={() => setLightBox(null)}
                    className="fixed inset-0 bg-black/92 backdrop-blur-xl z-50 flex items-center justify-center p-4 cursor-zoom-out"
                >
                    <div className="relative max-w-5xl max-h-[92vh] flex flex-col items-center">
                        <button
                            onClick={() => setLightBox(null)}
                            title="Close Full Screen"
                            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer transition"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={lightBox}
                            alt="Full resolution visual"
                            className="max-w-full max-h-[86vh] rounded-2xl object-contain shadow-2xl border border-white/15"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageBubble;