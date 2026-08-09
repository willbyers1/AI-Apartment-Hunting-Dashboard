import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, ShieldAlert, CheckCircle2, XCircle, ArrowRight, RefreshCw, FileText, Building, Info } from 'lucide-react';
import { Listing, AIAnalysis, UserPreferences } from '../types';

interface AIAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  preferences: UserPreferences;
  aiAnalysis?: AIAnalysis;
  onRunAudit: (listing: Listing) => void;
  isLoading: boolean;
}

const LOADING_STEPS = [
  'Parsing apartment listing text & lease disclosures...',
  'Checking neighborhood safety, commute times & local stats...',
  'Auditing security deposit rules & mandatory HOA fee structures...',
  'Calculating custom compatibility match score...',
  'Generating executive verdict recommendation...',
];

export const AIAuditModal: React.FC<AIAuditModalProps> = ({
  isOpen,
  onClose,
  listing,
  preferences,
  aiAnalysis,
  onRunAudit,
  isLoading,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setCurrentStepIndex(0);
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isOpen || !listing) return null;

  const matchScore = aiAnalysis?.matchScore ?? 85;
  const scoreColor = matchScore >= 85 
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' 
    : matchScore >= 70 
    ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' 
    : 'text-rose-400 border-rose-500/40 bg-rose-500/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                AI Property Audit & Red Flag Evaluation
              </h2>
              <p className="text-xs text-zinc-400">
                Evaluating <span className="text-zinc-200 font-semibold">{listing.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State Animation */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin" />
              <Sparkles className="w-8 h-8 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="font-bold text-zinc-200 text-base">Running Real Estate AI Auditor</h3>
              <p className="text-xs text-emerald-400 font-medium animate-fade-in h-6">
                {LOADING_STEPS[currentStepIndex]}
              </p>
            </div>
          </div>
        ) : (
          /* Result Body */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            {/* Top Score & Verdict Summary Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/70 p-5 rounded-2xl border border-zinc-800">
              {/* Score Dial */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border bg-zinc-900 text-center border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-widest">
                  AI Match Score
                </span>
                <div className={`text-4xl font-black px-4 py-2 rounded-2xl border my-1 ${scoreColor}`}>
                  {matchScore}%
                </div>
                <span className="text-[11px] text-zinc-400 mt-1">
                  Based on your preferences
                </span>
              </div>

              {/* Executive Verdict */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  Executive Recommendation
                </div>
                <p className="text-sm text-zinc-200 font-medium leading-relaxed bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 italic">
                  "{aiAnalysis?.verdict || 'Property offers strong overall value with minor compromises on lease terms.'}"
                </p>
              </div>
            </div>

            {/* Red Flag Detector Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-zinc-100 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Red Flag & Hidden Fee Detector
                </h4>
                <span className="text-xs text-zinc-400 font-medium">
                  {aiAnalysis?.redFlags?.length || 0} Issues Spotted
                </span>
              </div>

              {aiAnalysis?.redFlags && aiAnalysis.redFlags.length > 0 ? (
                <div className="space-y-2.5">
                  {aiAnalysis.redFlags.map((flag, idx) => {
                    const sevColor = flag.severity === 'HIGH' 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                      : flag.severity === 'MEDIUM' 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';

                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex gap-3 items-start">
                        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${flag.severity === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`} />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-200 text-xs sm:text-sm">{flag.issue}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sevColor}`}>
                              {flag.severity} RISK
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-normal">{flag.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>No major hidden red flags or unusual deposit burdens detected in this listing!</span>
                </div>
              )}
            </div>

            {/* Pros and Cons Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Pros */}
              <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="font-bold text-emerald-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Advantages
                </h4>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {aiAnalysis?.pros?.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  )) || <li>Fits general search criteria.</li>}
                </ul>
              </div>

              {/* Cons */}
              <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="font-bold text-amber-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  Trade-offs & Sacrifices
                </h4>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {aiAnalysis?.cons?.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  )) || <li>Higher price relative to size.</li>}
                </ul>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => onRunAudit(listing)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                Re-evaluate Audit
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Close Audit View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
