
import React from "react";
import HeaderInstitutionnel from "@/components/HeaderInstitutionnel";
import FooterInstitutionnel from "@/components/FooterInstitutionnel";
import UserTweetsAnalysis from "../components/UserTweetsAnalysis";

// SVG inspiré du logo X officiel Freepik (version épurée pour usage légal et tech)
const XLogo = () => (
  <svg viewBox="0 0 120 120" width={36} height={36} className="inline-block align-middle" aria-label="X logo" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="28" fill="white"/>
    <path
      d="M29 27h21.5l17.2 22.3L84.2 27H103L72.4 63.7L103 93.2H82.8L65.1 71.2L46.1 93.2H27l32.4-37.7L29 27Z"
      fill="#181818"
    />
  </svg>
);

export default function TwitterAnalysis() {
  return (
    <div className="bg-background min-h-screen w-full flex flex-col font-inter">
      <HeaderInstitutionnel />
      <main className="flex-grow flex items-center flex-col justify-start pt-8 px-2 w-full">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          {/* Logo X stylisé */}
          <span className="font-black text-3xl text-[#181818] tracking-tight leading-none flex items-center" style={{fontFamily:'monospace'}}>
            <XLogo />
          </span>
          X Analysis
        </h2>
        <div className="mb-2 text-sm text-secondary-text max-w-xl text-center">
          Fact-checking of the latest trending tweets from political personalities.<br/>
          <span className="text-xs text-muted">Live tweets simulated for demo purposes. Choose an account to start.</span>
        </div>
        <UserTweetsAnalysis />
      </main>
      <FooterInstitutionnel />
    </div>
  );
}
