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

  // Envoi du .webm et gestion du parsing backend :
  const handleSendAudio = async (audioBlob: Blob) => {
    setStatus("transcribing");
    const BACKEND_SPEECH_URL = "http://127.0.0.1:8000/api/speech/process-audio/";
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      setTranscript(null);
      setErrorMsg(null);

      const resp = await fetch(BACKEND_SPEECH_URL, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Backend error: ${resp.status}`);
      }
      const data = await resp.json();

      // Cas simple transcription :
      if (typeof data === "object" && data.text && !data.statement && !data.classification) {
        setTranscript(data.text);
        setResults([]);
        // Au lieu de status completed, on lance directement l'analyse :
        analyzeTranscriptWithChatBackend(data.text);
      }
      // Cas analyse instantanée (rare) :
      else if (Array.isArray(data) || (data.statement && data.classification)) {
        // Normalisation retour analyse
        const resultsArr = Array.isArray(data) ? data : [data];
        setResults(resultsArr);

        let transcriptText = (data.transcript || (resultsArr[0]?.transcript) || "");
        if (!transcriptText && typeof data === "object" && data.text) transcriptText = data.text;
        setTranscript(transcriptText || null);

        setStatus("completed");
      }
      else {
        setErrorMsg("Backend response format not recognized.");
        setStatus("error");
      }
    } catch (e: any) {
      setErrorMsg("Error during audio analysis. " + (e?.message || ""));
      setStatus("error");
    }
  };

  // Analyse du transcript via backend /api/chat/ (appel automatique)
  const analyzeTranscriptWithChatBackend = async (text: string) => {
    setStatus("analyzing");
    setResults([]);
    setErrorMsg(null);
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_text: text }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `Backend error: ${resp.status}`);
      }
      const data = await resp.json();
      // nouveau : supporte { facts_checked: [...] }
      let resultsArr: any[] = [];
      if (data && Array.isArray(data.facts_checked)) {
        resultsArr = data.facts_checked;
      } else if (Array.isArray(data)) {
        resultsArr = data;
      } else if (data && typeof data === "object" && data.statement && data.classification) {
        resultsArr = [data];
      } else {
        resultsArr = [];
      }

      // Déroule explanation si c'est un JSON stringifié
      resultsArr = resultsArr.map((item) => {
        let parsedExplanation = item.explanation;
        let customSources = null;
        if (typeof parsedExplanation === "string") {
          try {
            const explObj = JSON.parse(parsedExplanation);
            if (explObj && explObj.answer) {
              parsedExplanation = explObj.answer;
              customSources = explObj.sources || null;
            }
          } catch {
            // Ok : pas JSON
          }
        }
        return {
          ...item,
          explanation: parsedExplanation,
          customSources,
        };
      });

      if (resultsArr.length > 0) {
        setResults(resultsArr);
        setStatus("completed");
      } else {
        setErrorMsg("Chat backend did not return a valid analysis.");
        setStatus("error");
      }
    } catch (err: any) {
      setErrorMsg("Erreur backend analyse texte : " + (err?.message || ""));
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

            {/* Si résultats d’analyse, on les affiche joliment via ResultsList */}
            {results.length > 0 ? (
              <ResultsList results={results} onRetry={handleReset} />
            ) : (
              // Sinon, message sympa (pas de résultats ou juste transcription)
              <div className="card max-w-2xl w-full p-5 mx-auto my-10 text-sm text-primary-text text-center">
                <div>
                  {transcript
                    ? (
                      <>
                        <div className="mb-2">✅ Audio transcrit :</div>
                        <div className="italic text-secondary-text mb-5">{transcript}</div>
                        <div className="text-xs text-muted">Aucune affirmation vérifiable détectée pour l’instant.</div>
                      </>
                    )
                    : <div className="text-muted">No verifiable analysis or transcript detected.</div>
                  }
                </div>
                <Button
                  onClick={handleReset}
                  className="mt-6 px-5 py-2 bg-institutional-blue text-white rounded font-medium shadow hover:bg-institutional-blue/90 transition"
                >
                  Restart
                </Button>
              </div>
            )}
          </div>
        )}
        {status === "idle" && <EmptyState />}
      </main>
      <FooterInstitutionnel />
    </div>
  );
}
