
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { XCircle, AlertTriangle, CheckCircle } from "lucide-react";

const STATUS_INFO = {
  red: {
    label: "Disputed",
    badge: "bg-[#E53E3E] text-white",
    icon: <XCircle className="text-white" size={16} />,
  },
  orange: {
    label: "Needs Context",
    badge: "bg-[#DD6B20] text-white",
    icon: <AlertTriangle className="text-white" size={16} />,
  },
  green: {
    label: "Verified",
    badge: "bg-[#38A169] text-white",
    icon: <CheckCircle className="text-white" size={16} />,
  },
  grey: {
    label: "Not Verifiable",
    badge: "bg-[#718096] text-white",
    icon: <AlertTriangle className="text-white" size={16} />,
  },
} as const;

type Tweet = {
  id: string;
  text: string;
  created_at: string;
  classification: "red" | "orange" | "green" | "grey";
  explanation: string;
  retweets?: number;
  likes?: number;
  views?: number;
};

type User = {
  username: string;
  name: string;
  avatar: string;
};

type TweetCardProps = {
  tweet: Tweet;
  user: User;
};

export default function TweetCard({ tweet, user }: TweetCardProps) {
  const status = STATUS_INFO[tweet.classification];
  return (
    <div className="bg-white border border-border rounded-xl shadow-card px-4 pt-4 pb-2 flex flex-col gap-2 font-inter transition hover:shadow-lg">
      <div className="flex items-center gap-3">
        <Avatar className="w-11 h-11">
          <AvatarImage src={user.avatar} alt={"@" + user.username} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px] leading-snug text-primary-text">{user.name}</span>
            <Badge variant="secondary" className={`ml-2 px-2 py-0 ${status.badge} text-xs font-medium rounded`}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </Badge>
          </div>
          <div className="text-xs text-secondary-text leading-none">@{user.username}</div>
        </div>
        <span className="ml-auto text-xs text-secondary-text">{new Date(tweet.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </div>
      <div className="text-[17px] leading-tight text-primary-text mt-1 mb-2" style={{ whiteSpace: "pre-wrap" }}>
        {tweet.text}
      </div>
      <div className="flex gap-6 pb-1 pl-1 text-sm text-secondary-text font-medium">
        <span>
          <span className="font-semibold text-primary-text">{tweet.retweets?.toLocaleString()}</span> Retweets
        </span>
        <span>
          <span className="font-semibold text-primary-text">{tweet.likes?.toLocaleString()}</span> Likes
        </span>
        <span>
          <span className="font-semibold text-primary-text">{tweet.views?.toLocaleString()}</span> Views
        </span>
      </div>
      <div className="px-1 pt-2 pb-1">
        <span className="text-xs text-warning block italic">{tweet.explanation}</span>
      </div>
    </div>
  );
}
