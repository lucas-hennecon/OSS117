
import { FileText } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center px-3 py-20">
      <div className="bg-institutional-blue-light rounded-full p-4 mb-5">
        <FileText className="text-institutional-blue" size={36} aria-hidden />
      </div>
      <div className="text-xl font-medium mb-2 text-primary-text">Welcome!</div>
      <p className="text-secondary-text mb-1 text-base text-center max-w-[340px]">
        Paste your text to be verified.
      </p>
      <span className="text-sm text-secondary-text opacity-70">Your data remains confidential and secure.</span>
    </div>
  );
}
