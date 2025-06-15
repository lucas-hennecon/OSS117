
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AudioFactCheck from "./pages/AudioFactCheck";
import TwitterAnalysis from "./pages/TwitterAnalysis";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Routing is handled here, within one BrowserRouter context (provided in main.tsx) */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/audio" element={<AudioFactCheck />} />
          <Route path="/twitter" element={<TwitterAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

