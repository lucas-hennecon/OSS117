
import React from "react";
import { Card } from "@/components/ui/card";
import TrustBarSummary from "./TrustBarSummary";

type Tweet = {
  id: string;
  classification: "red" | "orange" | "green" | "grey";
};

type TweetsTrustSummaryProps = {
  tweets: Tweet[];
  username: string;
  name: string;
  avatar: string;
};

export default function TweetsTrustSummary({ tweets, username, name, avatar }: TweetsTrustSummaryProps) {
  return (
    <Card className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-4 px-4 py-4 mb-4 font-inter">
      <div className="flex flex-col items-center gap-3 md:w-[170px] min-w-[120px] md:border-r pr-6">
        <img
          src={avatar}
          alt={name}
          className="w-14 h-14 rounded-full border"
        />
        <div className="font-bold text-base text-primary">{name}</div>
        <div className="text-xs font-mono text-muted-foreground">@{username}</div>
      </div>
      <div className="flex-1 flex flex-col w-full pl-2">
        {/* Barre colorée segmentée + compteurs intégrés dans TrustBarSummary */}
        <TrustBarSummary items={tweets} />
      </div>
    </Card>
  );
}

