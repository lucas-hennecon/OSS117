
import React from "react";

type AnalysisProgressProps = {
  agentThoughts: string[];
};

export default function AnalysisProgress({ agentThoughts }: AnalysisProgressProps) {
  return (
    <div className="card max-w-xl w-full mx-auto my-12 flex flex-col items-center px-8 py-10 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-institutional-blue-light flex items-center justify-center mb-4">
        <div className="relative flex">
          <span className="w-2 h-2 mx-[3px] bg-institutional-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-2 h-2 mx-[3px] bg-institutional-blue/80 rounded-full animate-bounce" style={{ animationDelay: "120ms" }}></span>
          <span className="w-2 h-2 mx-[3px] bg-institutional-blue/60 rounded-full animate-bounce" style={{ animationDelay: "240ms" }}></span>
        </div>
      </div>
      <div className="text-lg font-medium text-primary-text mb-2 text-center">
        OSS117 analyzes statements with precision...
      </div>
      <div className="text-secondary-text text-base text-center mb-1">
        Analysis completed in ~30 seconds
      </div>
      <div className="min-h-10 w-full flex flex-col items-center mt-5">
        {agentThoughts.length > 0 ? (
          agentThoughts.slice(-3).map((thought, i) => (
            <div key={i} className="text-xs text-primary-text/70 font-medium italic my-0.5 w-full text-center">
              {thought}
            </div>
          ))
        ) : (
          <div className="text-xs text-secondary-text opacity-70 animate-pulse">
            Awaiting agent response...
          </div>
        )}
      </div>
    </div>
  );
}

