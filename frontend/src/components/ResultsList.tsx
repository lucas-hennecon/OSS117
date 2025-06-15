
import React, { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalysisDetailModal from "./AnalysisDetailModal";

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

type ResultsListProps = {
  results: StatementResult[];
  onRetry: () => void;
};

const STATUS_INFO = {
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

export default function ResultsList({ results, onRetry }: ResultsListProps) {
  const [selected, setSelected] = useState<StatementResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (result: StatementResult) => {
    setSelected(result);
    setModalOpen(true);
  };

  if (!results.length) {
    return (
      <div className="card py-16 px-7 max-w-xl w-full mx-auto text-center my-10">
        <div className="text-xl font-medium text-primary-text mb-2">No verifiable statements found.</div>
        <div className="text-secondary-text mb-5">Try different text or review your input.</div>
        <Button onClick={onRetry}>Start a New Analysis</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 pb-16 animate-fade-in">
      {results.map((result, idx) => {
        const status = STATUS_INFO[result.classification];
        return (
          <button
            key={idx}
            type="button"
            className={`card flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 shadow-md transition-shadow hover:shadow-xl duration-200 group ${status.bg} ${status.border} text-left outline-none focus:ring-2 focus:ring-[#2B6CB0]/60`}
            style={{ borderRadius: "12px" }}
            onClick={() => handleCardClick(result)}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              {status.icon}
              <span className="text-xs font-medium text-primary-text">{status.label}</span>
            </div>
            <div className="flex-1">
              <div className="italic text-primary-text text-base mb-0.5">&ldquo;{result.statement}&rdquo;</div>
              <div className="text-sm font-medium text-secondary-text mb-1">{result.summary}</div>
              <div className="w-full h-2 bg-muted rounded mt-3 mb-1 relative">
                <div
                  style={{
                    width: `${result.confidence}%`,
                    background: "#2B6CB0",
                  }}
                  className="h-2 rounded transition-all duration-300"
                />
              </div>
              <div className="text-xs text-secondary-text opacity-80 mb-1">Confidence: {result.confidence}%</div>
            </div>
            <div className="ml-auto flex items-center">
              <span className="text-primary-text opacity-60 text-2xl cursor-pointer transition-transform group-hover:scale-110">
                <ChevronRight size={22} />
              </span>
            </div>
          </button>
        );
      })}
      <Button variant="outline" className="mt-4 mx-auto" onClick={onRetry}>
        Start a New Analysis
      </Button>
      <AnalysisDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        result={selected}
      />
    </div>
  );
}
