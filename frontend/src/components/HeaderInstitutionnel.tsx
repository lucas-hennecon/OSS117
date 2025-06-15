import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Nouveau logo fourni par l'utilisateur
const SMOLAGENT_LOGO = "/lovable-uploads/40eed738-81ab-4eac-95d8-1d05cfb054c7.png";

const MODELS = [
  { value: "claude-sonnet-4", label: "Claude 4 Sonnet" },
  { value: "claude-opus-4", label: "Claude 4 Opus" }
];

export default function HeaderInstitutionnel() {
  const location = useLocation();
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4");

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-card-bg">
      <div className="flex items-center gap-3">
        <img
          src={SMOLAGENT_LOGO}
          alt="Smolagent Logo"
          className="w-9 h-9 object-contain bg-white rounded"
          onError={e => {
            (e.currentTarget as HTMLImageElement).src =
              "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/smolagents/icon_smolagents.png";
          }}
        />
        <span className="font-bold text-xl text-primary-text">OSS117 Fact Checker</span>
        <div className="ml-4 flex flex-col min-w-[180px]">
          <span className="flex items-center gap-2 bg-[#F5F6FA] rounded px-2 py-0.5 text-xs font-semibold text-[#754fff] border border-[#ebeaff] whitespace-nowrap">
            POWERED WITH AI AGENTS
          </span>
          <select
            id="ai-model"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="text-xs rounded border px-1.5 py-0.5 focus:outline-none bg-white/80 mt-1"
          >
            {MODELS.map(model => (
              <option value={model.value} key={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <nav className="flex items-center gap-6">
        <Link to="/" className={`font-medium text-base hover:underline ${location.pathname === "/" ? "text-institutional-blue" : "text-secondary-text"}`}>
          Text Analysis
        </Link>
        <Link to="/audio" className={`font-medium text-base hover:underline ${location.pathname === "/audio" ? "text-institutional-blue" : "text-secondary-text"}`}>
          Speech Analysis
        </Link>
        <Link to="/twitter" className={`font-medium text-base hover:underline ${location.pathname === "/twitter" ? "text-institutional-blue" : "text-secondary-text"}`}>
          X Analysis
        </Link>
      </nav>
    </header>
  );
}
