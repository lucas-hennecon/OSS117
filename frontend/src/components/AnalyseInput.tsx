
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardPaste } from "lucide-react";

type AnalyseInputProps = {
  onAnalyze: (txt: string) => void;
  initialValue?: string;
  isError?: boolean;
  errorMsg?: string;
};

export default function AnalyseInput({
  onAnalyze,
  initialValue = "",
  isError = false,
  errorMsg = "",
}: AnalyseInputProps) {
  const [input, setInput] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      textareaRef.current?.focus();
    } catch {
      // ignore
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto mt-8 w-full">
      <label
        htmlFor="oss-textarea"
        className="block text-lg font-medium text-primary-text mb-2"
      >
        Paste Text to be fact-checked
      </label>
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="oss-textarea"
          className={`
            resize-y min-h-[120px] w-full rounded-md border
            bg-background px-3 py-2 pr-10 text-base font-normal
            placeholder-secondary-text text-primary-text
            focus:outline-none transition-all
            ${focused ? "border-institutional-blue ring-2 ring-institutional-blue/20" : "border-border"}
            ${isError ? "border-destructive ring-2 ring-destructive/20" : ""}
          `}
          placeholder="Paste the text to analyze..."
          value={input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          maxLength={2000}
          style={{ fontFamily: "inherit", lineHeight: 1.6 }}
        />
        <button
          type="button"
          aria-label="Paste"
          title="Paste from clipboard"
          className="absolute right-2 top-2 text-secondary-text hover:scale-105 transition-transform"
          onClick={handlePaste}
          tabIndex={-1}
        >
          <ClipboardPaste size={20} />
        </button>
        <span className="absolute bottom-1.5 right-2 text-xs text-secondary-text">
          {input.length}/2000
        </span>
        {isError && (
          <span className="absolute -bottom-7 left-0 text-destructive text-sm font-medium">
            {errorMsg}
          </span>
        )}
      </div>
      <Button
        type="button"
        className={`
          w-full mt-5 h-11 rounded-lg font-medium text-base bg-institutional-blue text-white
          shadow-sm hover:bg-institutional-blue/90 transition-all
          focus:ring-2 focus:ring-institutional-blue/30 focus:outline-none
          active:shadow-lg
        `}
        style={{ boxShadow: "0 1.5px 6px 0 rgba(44,112,203,0.07)" }}
        disabled={!input.trim()}
        onClick={() => input && onAnalyze(input)}
      >
        Analyze Now
      </Button>
    </div>
  );
}
