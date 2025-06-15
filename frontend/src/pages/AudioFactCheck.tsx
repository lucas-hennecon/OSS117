import { useState, useRef, DragEvent } from "react";
import HeaderInstitutionnel from "@/components/HeaderInstitutionnel";
import EmptyState from "@/components/EmptyState";
import FooterInstitutionnel from "@/components/FooterInstitutionnel";
import ResultsList from "@/components/ResultsList";
import { Button } from "@/components/ui/button";
import TrustBarSummary from "@/components/TrustBarSummary";

type AgentStatus = "idle" | "recording" | "transcribing" | "analyzing" | "completed" | "error";
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

export default function AudioFactCheck() {
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isMicAllowed, setIsMicAllowed] = useState<boolean>(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Detection du type mime disponible pour MediaRecorder (wav ou webm ou autre)
  const getSupportedAudioMimeType = () => {
    if (MediaRecorder.isTypeSupported("audio/wav")) return "audio/wav";
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
    if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
    // fallback navigateur (laisser le MediaRecorder choisir)
    return "";
  };

  // Start recording audio from mic
  const handleStartRecording = async () => {
    setErrorMsg(null);
    setResults([]);
    setTranscript(null);
    setStatus("recording");
    setAudioUrl(null);
    setIsMicAllowed(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // DÉTECTION DYNAMIQUE DU FORMAT SUPPORTÉ
      const mimeType = getSupportedAudioMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        // Utilise le bon type MIME pour le blob
        const blobType = mimeType || "audio/webm";
        const blob = new Blob(audioChunks.current, { type: blobType });
        setAudioUrl(URL.createObjectURL(blob));
        handleSendAudio(blob);
      };
      mediaRecorder.start();
    } catch {
      setIsMicAllowed(false);
      setStatus("idle");
      setErrorMsg("Microphone permission denied or format not supported.");
    }
  };

  // Stop recording (called by UI)
  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setStatus("transcribing");
  };

  // Handle dropped .wav file
  const handleDropMp3 = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (
      file.type !== "audio/wav" &&
      file.type !== "audio/webm" &&
      file.type !== "audio/mp3" &&
      file.type !== "audio/mpeg"
    ) {
      setErrorMsg("Please drop a valid .wav, .webm or .mp3 file.");
      return;
    }
    setAudioUrl(URL.createObjectURL(file));
    handleSendAudio(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (
      file.type !== "audio/wav" &&
      file.type !== "audio/webm" &&
      file.type !== "audio/mp3" &&
      file.type !== "audio/mpeg"
    ) {
      setErrorMsg("Please select a valid .wav, .webm or .mp3 file.");
      return;
    }
    setAudioUrl(URL.createObjectURL(file));
    handleSendAudio(file);
  };

  // Simulate audio transcription + analysis
  const handleSendAudio = async (audioBlob: Blob) => {
    setStatus("transcribing");
    // Replace here by your API call that handles transcription and fact-checking
    try {
      setTimeout(() => {
        // Simulated: text recognized from audio
        const simulatedText = "Unemployment dropped by 15% this year. CO2 emissions decreased over the past year.";
        setTranscript(simulatedText);

        setStatus("analyzing");
        setTimeout(() => {
          setResults([
            {
              statement: "Unemployment dropped by 15% this year",
              classification: "orange",
              confidence: 75,
              summary: "Partially accurate but lacks temporal context",
              sources: {
                supporting: ["INSEE Q3 2024", "Employment Agency Stats"],
                contradicting: ["OECD Report 2024"],
                nuanced: ["France Strategy Analysis"]
              },
              explanation: "The figures are correct but need further precision regarding the period considered."
            },
            {
              statement: "CO2 emissions decreased over the past year.",
              classification: "green",
              confidence: 90,
              summary: "Consistent with the latest environmental reports.",
              sources: {
                supporting: ["Ministry of Ecology Report 2024"],
                contradicting: [],
                nuanced: ["European Environment Agency Overview"]
              },
              explanation: "Recent data supports a decline, though local variations may exist."
            }
          ]);
          setStatus("completed");
        }, 1500);
      }, 1750);
    } catch (e) {
      setErrorMsg("Error during audio analysis.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setAudioUrl(null);
    setResults([]);
    setTranscript(null);
    setErrorMsg(null);
  };

  // Dropzone UI (slightly adjusted)
  const DropMp3Zone = () => (
    <div
      className={`border-2 border-dashed rounded-lg py-9 px-4 mb-3 w-full transition-colors flex flex-col items-center justify-center cursor-pointer
        ${isDragging ? "border-institutional-blue bg-blue-100/40" : "border-border bg-accent/40"}
      `}
      onDragOver={e => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDropMp3}
      tabIndex={-1}
    >
      <span className="text-3xl mb-2">🎶</span>
      <span className="font-medium mb-1 text-base">Drag & drop a .wav, .webm or .mp3 file here</span>
      <span className="text-sm text-secondary-text mb-2">
        Or <label htmlFor="mp3-input" className="underline cursor-pointer text-primary">browse</label> a file from your computer
      </span>
      <input
        id="mp3-input"
        type="file"
        accept="audio/wav,audio/webm,audio/mp3,audio/mpeg"
        className="hidden"
        onChange={handleFileInput}
      />
      <span className="text-xs text-secondary-text pt-1 opacity-75">The file will be transcribed and analyzed automatically.</span>
    </div>
  );

  return (
    <div className="bg-background min-h-screen w-full flex flex-col font-inter">
      <HeaderInstitutionnel />
      <main className="flex-grow flex-col flex items-center justify-start pt-8 px-2 w-full">
        <h2 className="text-2xl font-bold mb-4">Speech Analysis</h2>
        <div className="text-base text-secondary-text mb-6">Record a discussion to be fact-checked</div>
        {/* Show the TrustBar if there are results */}
        {results.length > 0 && (
          <TrustBarSummary items={results.map(r => ({ classification: r.classification }))} className="mb-4" />
        )}
        {(status === "idle" || status === "error") && (
          <div className="card p-6 max-w-xl w-full mx-auto mt-6 text-center">
            <Button
              onClick={handleStartRecording}
              className="w-full h-11 rounded-lg font-medium text-base bg-institutional-blue text-white shadow-sm hover:bg-institutional-blue/90 transition-all"
            >
              Record a discussion to be fact-checked
            </Button>
            <div className="my-2 text-secondary-text text-sm font-medium">or</div>
            <DropMp3Zone />
            {!isMicAllowed &&
              <div className="text-destructive mt-3">Microphone permission denied.</div>
            }
            {errorMsg && (
              <div className="text-destructive mt-3">{errorMsg}</div>
            )}
            <div className="text-secondary-text mt-3 text-sm">Click the mic or drop an .mp3 to analyze.</div>
          </div>
        )}
        {status === "recording" && (
          <div className="card p-6 max-w-xl w-full mx-auto mt-6 text-center">
            <div className="text-lg mb-4">⏺️ Recording...</div>
            <Button
              onClick={handleStopRecording}
              variant="destructive"
              className="w-full h-11 rounded-lg font-medium text-base"
            >
              Stop and Analyze
            </Button>
            <div className="text-secondary-text mt-3 text-sm">Speak clearly, then click when finished.</div>
          </div>
        )}
        {status === "transcribing" && (
          <div className="card p-6 max-w-xl w-full mx-auto mt-6 text-center">
            <div className="animate-pulse text-lg font-medium">🔎 Transcribing and analyzing...</div>
          </div>
        )}
        {/* Display transcription and results */}
        {(status === "analyzing" || status === "completed") && (
          <div className="w-full">
            {audioUrl && (
              <div className="flex flex-col items-center mb-4">
                <audio src={audioUrl} controls className="mb-2" />
                {transcript && (
                  <div className="text-sm text-secondary-text mb-2">
                    <strong>Transcription:</strong> {transcript}
                  </div>
                )}
              </div>
            )}
            {results.length === 0 && (
              <div className="text-center py-10">Analysis in progress...</div>
            )}
            {results.length > 0 &&
              <ResultsList results={results} onRetry={handleReset} />
            }
          </div>
        )}
        {status === "idle" && <EmptyState />}
      </main>
      <FooterInstitutionnel />
    </div>
  );
}
