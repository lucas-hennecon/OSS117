
import React from "react";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

const STATUS_INFO = {
  green: {
    label: "Verified",
    color: "#38A169",
    icon: (cls: string) => <CheckCircle className={cls} size={17} />,
  },
  orange: {
    label: "Needs Context",
    color: "#F6AD55",
    icon: (cls: string) => <AlertTriangle className={cls} size={17} />,
  },
  red: {
    label: "Disputed",
    color: "#E53E3E",
    icon: (cls: string) => <XCircle className={cls} size={17} />,
  },
  grey: {
    label: "Not Verifiable",
    color: "#718096",
    icon: (cls: string) => <HelpCircle className={cls} size={17} />,
  },
} as const;

type Classification = "red" | "orange" | "green" | "grey";
type Props = {
  items: { classification: Classification }[];
  className?: string;
};

export default function TrustBarSummary({ items, className = "" }: Props) {
  const total = items.length || 1;
  const counts = {
    green: 0,
    orange: 0,
    red: 0,
    grey: 0,
  };
  items.forEach(({ classification }) => {
    counts[classification]++;
  });
  const segments = (["green", "orange", "red", "grey"] as Classification[]).map((key) => ({
    count: counts[key],
    color: STATUS_INFO[key].color,
    label: key,
  }));
  const percents = segments.map((s) => (total === 0 ? 0 : (s.count / total) * 100));

  return (
    <div className={`w-full max-w-xl mx-auto rounded-xl bg-white shadow-card border border-border p-4 ${className}`}>
      <div className="font-semibold mb-2 text-md text-primary-text tracking-tight">
        Summary Analysis
      </div>
      <div className="w-full h-4 rounded-full bg-muted flex overflow-hidden border border-border mb-3">
        {percents.map((percent, idx) => (
          <div
            key={segments[idx].label}
            style={{
              width: `${percent}%`,
              background: segments[idx].color,
            }}
            className="h-full transition-all"
          />
        ))}
      </div>
      {/* Petits stats sous la barre */}
      <div className="flex flex-row items-center justify-around gap-2 mt-1">
        {(Object.keys(STATUS_INFO) as Classification[]).map((key) => (
          <div className="flex flex-col items-center min-w-[64px]" key={key}>
            <div>
              {/* Icon: couleur du rond = statut, icône blanche dedans */}
              <span className="flex items-center justify-center rounded-full"
                style={{ background: STATUS_INFO[key].color, width: 27, height: 27 }}>
                {STATUS_INFO[key].icon("text-white")}
              </span>
            </div>
            <span className="font-semibold text-base mt-1">{counts[key]}</span>
            <span className="text-[12px] text-muted-foreground text-center leading-tight">{STATUS_INFO[key].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
