import HeaderInstitutionnel from "@/components/HeaderInstitutionnel";
import AnalyseInput from "@/components/AnalyseInput";
import EmptyState from "@/components/EmptyState";
import FooterInstitutionnel from "@/components/FooterInstitutionnel";
import AnalysisProgress from "@/components/AnalysisProgress";
import ResultsList from "@/components/ResultsList";
import TrustBarSummary from "@/components/TrustBarSummary";
import { useState } from "react";
import { analyzeDebate } from "@/services/agentService";

type AgentStatus = "idle" | "analyzing" | "completed" | "error";
type AnalysisResult = {
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
}[];

const Index = () => {
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<AnalysisResult>([]);
  const [agentThoughts, setAgentThoughts] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (txt: string) => {
    setStatus("analyzing");
    setInputText(txt);
    setResults([]);
    setAgentThoughts([]);
    setErrorMsg(null);

    try {
      await analyzeDebate(
        txt,
        (thought) => setAgentThoughts((prev) => [...prev, thought]),
        (finalResult) => {
          setResults(finalResult);
          setStatus("completed");
        },
        (err) => {
          setErrorMsg(err);
          setStatus("error");
        }
      );
    } catch (e) {
      setErrorMsg("Analysis failed. Please try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setInputText("");
    setResults([]);
    setAgentThoughts([]);
    setErrorMsg(null);
  };

  return (
    <div className="bg-background min-h-screen w-full flex flex-col font-inter">
      <HeaderInstitutionnel />
      <main className="flex-grow flex items-center flex-col justify-start pt-8 px-2 w-full">
        {/* Afficher la TrustBar "card summary" s'il y a des résultats */}
        {results.length > 0 && (
          <TrustBarSummary items={results.map(r => ({ classification: r.classification }))} className="mb-3" />
        )}
        {(status === "idle" || status === "error") && (
          <AnalyseInput
            onAnalyze={handleAnalyze}
            initialValue={inputText}
            isError={status === "error"}
            errorMsg={errorMsg ?? ""}
          />
        )}
        {status === "idle" && <EmptyState />}
        {status === "analyzing" && (
          <AnalysisProgress agentThoughts={agentThoughts} />
        )}
        {status === "completed" && (
          <ResultsList results={results} onRetry={handleReset} />
        )}
        {/* Shortcut to audio page, now in English */}
        <div className="mt-7">
          <a href="/audio" className="inline-block text-institutional-blue hover:underline text-base font-medium">
            or try voice analysis →
          </a>
        </div>
      </main>
      <FooterInstitutionnel />
    </div>
  );
};

export default Index;
