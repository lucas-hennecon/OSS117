
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertTriangle, ChevronRight } from "lucide-react";

type StatementResult = {
  statement: string;
  classification: "red" | "orange" | "green" | "grey";
  confidence: number;
  summary: string;
  sources: {
    supporting: string[];
    contradicting: string[];
    nuanced: string[];
  };
  explanation: string;
};

type AnalysisDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: StatementResult | null;
};

const STATUS = {
  red: {
    label: "Disputed Information",
    bg: "bg-[#FED7D7]",
    border: "border-l-[4px] border-[#E53E3E]",
    icon: <XCircle className="text-[#E53E3E]" size={20} />,
  },
  orange: {
    label: "Context Required",
    bg: "bg-[#FEEBC8]",
    border: "border-l-[4px] border-[#DD6B20]",
    icon: <AlertTriangle className="text-[#DD6B20]" size={20} />,
  },
  green: {
    label: "Verified Information",
    bg: "bg-[#C6F6D5]",
    border: "border-l-[4px] border-[#38A169]",
    icon: <CheckCircle className="text-[#38A169]" size={20} />,
  },
  grey: {
    label: "Not Verifiable",
    bg: "bg-[#F7FAFC]",
    border: "border-l-[4px] border-[#718096]",
    icon: <AlertTriangle className="text-[#718096]" size={20} />,
  },
} as const;

export default function AnalysisDetailModal({ open, onOpenChange, result }: AnalysisDetailModalProps) {
  if (!result) return null;
  const status = STATUS[result.classification];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl mx-auto rounded-xl p-0 md:p-6 animate-fade-in">
        <DialogHeader className="items-start px-6 pt-6 pb-0">
          <DialogTitle className="text-2xl font-semibold mb-1">Detailed Analysis</DialogTitle>
          <DialogDescription className="mb-2 text-sm">
            Complete fact-checking for this statement
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-1">
          <blockquote className="italic text-lg bg-[#FAFBFC] border-l-4 border-[#2B6CB0] px-5 py-3 rounded mb-3">
            &ldquo;{result.statement}&rdquo;
          </blockquote>
          <div className={`mb-4 px-4 py-2 rounded flex items-center gap-2 ${status.bg} ${status.border}`}>
            {status.icon}
            <span className="font-semibold">{status.label}</span>
            <span className="ml-auto text-xs text-secondary-text opacity-75 font-medium">
              Confidence: {result.confidence}%
            </span>
          </div>
          <div className="mb-4">
            <div className="font-medium text-primary-text text-base mb-1">Summary</div>
            <div className="text-secondary-text text-sm">{result.summary}</div>
          </div>
          <div className="mb-4">
            <div className="font-medium text-primary-text text-base mb-1">Detailed Explanation</div>
            <div className="text-secondary-text text-sm leading-relaxed">{result.explanation}</div>
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-1 font-semibold text-sm mb-1">
                <CheckCircle size={18} className="text-[#38A169]" /> Supporting Sources
              </div>
              <ul className="text-xs text-primary-text list-disc pl-4 space-y-0.5">
                {result.sources.supporting.length > 0
                  ? result.sources.supporting.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))
                  : <li className="text-secondary-text/70 font-medium italic">None</li>}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-sm mb-1">
                <XCircle size={18} className="text-[#E53E3E]" /> Contradicting Sources
              </div>
              <ul className="text-xs text-primary-text list-disc pl-4 space-y-0.5">
                {result.sources.contradicting.length > 0
                  ? result.sources.contradicting.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))
                  : <li className="text-secondary-text/70 font-medium italic">None</li>}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-sm mb-1">
                <AlertTriangle size={18} className="text-[#DD6B20]" /> Nuanced Sources
              </div>
              <ul className="text-xs text-primary-text list-disc pl-4 space-y-0.5">
                {result.sources.nuanced.length > 0
                  ? result.sources.nuanced.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))
                  : <li className="text-secondary-text/70 font-medium italic">None</li>}
              </ul>
            </div>
          </div>
        </div>
        <div className="px-6 pb-4 mt-2 border-t pt-3 flex justify-between items-center text-xs text-secondary-text">
          <div>Analysis performed by OSS117 Agent</div>
          <div>{new Date().toLocaleString()}</div>
        </div>
        <DialogClose asChild>
          <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-700" aria-label="Close">
            <XCircle size={22} />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
