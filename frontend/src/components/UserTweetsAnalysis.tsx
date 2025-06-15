import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import TweetCard from "./TweetCard";
import TweetsTrustSummary from "./TweetsTrustSummary";

// Simuler des comptes et des tweets (remplace par une vraie API plus tard)
const MOCK_USERS = [
  {
    username: "realDonaldTrump",
    name: "Donald J. Trump",
    avatar: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"
  },
  {
    username: "BarackObama",
    name: "Barack Obama",
    avatar: "https://pbs.twimg.com/profile_images/822547732376207360/5g0FC8XX_400x400.jpg"
  },
  {
    username: "elonmusk",
    name: "Elon Musk",
    avatar: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg"
  }
];

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

const MOCK_TWEETS: Tweet[] = [
  {
    id: "1",
    text: "The United States has just achieved its lowest unemployment rate in history.",
    created_at: "2025-06-10T15:32:00Z",
    classification: "orange",
    explanation: "Partially accurate: unemployment is low, but not the lowest in history.",
  },
  {
    id: "2",
    text: "We built the strongest economy the world has ever seen.",
    created_at: "2025-06-08T09:22:00Z",
    classification: "red",
    explanation: "Incorrect: Other countries have had stronger economies. This is a subjective statement.",
  },
  {
    id: "3",
    text: "Gas prices have gone up under the new administration.",
    created_at: "2025-06-07T18:14:00Z",
    classification: "green",
    explanation: "Verified: Gas prices have indeed increased compared to last year.",
  },
  {
    id: "4",
    text: "I predicted this economic crash before anyone else.",
    created_at: "2025-06-06T11:41:00Z",
    classification: "grey",
    explanation: "Cannot be fully verified. Claim is vague or lacks timestamped evidence.",
  },
  {
    id: "5",
    text: "Our military has been rebuilt and is stronger than ever.",
    created_at: "2025-06-05T15:29:00Z",
    classification: "orange",
    explanation: "Partly true. Military spending has increased, but effectiveness is subject to debate.",
  },
  // 5 tweets de plus pour le "browse more"
  {
    id: "6",
    text: "The stock market reached an all-time high today under my administration.",
    created_at: "2025-06-04T10:12:00Z",
    classification: "orange",
    explanation: "Accurate for today, but markets have hit highs before; context needed.",
  },
  {
    id: "7",
    text: "We have the best healthcare system in the world.",
    created_at: "2025-06-03T18:55:00Z",
    classification: "red",
    explanation: "Subjective claim. Healthcare metrics place US below several nations.",
  },
  {
    id: "8",
    text: "No president has done more in their first term.",
    created_at: "2025-06-02T09:30:00Z",
    classification: "grey",
    explanation: "Very broad claim, hard to verify objectively.",
  },
  {
    id: "9",
    text: "The wall on our southern border is complete.",
    created_at: "2025-06-01T21:03:00Z",
    classification: "red",
    explanation: "Incorrect. Large segments remain unfinished.",
  },
  {
    id: "10",
    text: "Jobs are coming back at a record pace.",
    created_at: "2025-06-01T11:15:00Z",
    classification: "orange",
    explanation: "Jobs have increased, but not necessarily at a record pace.",
  },
];

// Simule stats randoms par tweet
function addFakeStatsToTweets(tweets: Tweet[]): Tweet[] {
  return tweets.map(t => ({
    ...t,
    retweets: t.retweets ?? Math.floor(Math.random() * 5000 + 500),
    likes: t.likes ?? Math.floor(Math.random() * 10000 + 800),
    views: t.views ?? Math.floor(Math.random() * 100000 + 10000),
  }));
}

type UserTweetsAnalysisProps = {};

export default function UserTweetsAnalysis({ }: UserTweetsAnalysisProps) {
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
  const [page, setPage] = useState(0); // page: 0, 1, 2...
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simuler un fetch API pour la page 0 ou changement de compte : reset
    if (page === 0) {
      setTimeout(() => {
        const start = 0;
        const end = 5;
        setTweets(addFakeStatsToTweets(MOCK_TWEETS.slice(start, end)));
        setLoading(false);
      }, 900);
    } else {
      // Si navigation "browse more", ajouter à la liste
      setTimeout(() => {
        const start = page * 5;
        const end = start + 5;
        setTweets(prevTweets =>
          prevTweets.concat(addFakeStatsToTweets(MOCK_TWEETS.slice(start, end)))
        );
        setLoading(false);
      }, 900 + page * 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, page]);

  function handleUserChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const user = MOCK_USERS.find(u => u.username === e.target.value);
    if (user) {
      setSelectedUser(user);
      setPage(0);
      setTweets([]); // on réinitialise
    }
  }

  function handleBrowseMore() {
    setPage(p => p + 1);
  }

  return (
    <div className="max-w-lg w-full mx-auto flex flex-col items-center">
      <form className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-5 w-full">
        <label htmlFor="twitter-user" className="text-sm font-medium mr-2 min-w-[110px]">Twitter account:</label>
        <select
          id="twitter-user"
          className="w-[210px] rounded-md border px-3 py-2 text-sm"
          value={selectedUser.username}
          onChange={handleUserChange}
        >
          {MOCK_USERS.map(u => (
            <option key={u.username} value={u.username}>
              {u.name} (@{u.username})
            </option>
          ))}
        </select>
      </form>
      {/* Synthèse/graphique tout en haut — après choix compte */}
      <TweetsTrustSummary
        tweets={tweets}
        username={selectedUser.username}
        name={selectedUser.name}
        avatar={selectedUser.avatar}
      />
      {loading && tweets.length === 0 ? (
        <div className="flex flex-col items-center mt-10">
          <Loader className="animate-spin text-[#1DA1F2] mb-2" />
          <div className="font-medium text-lg">Fetching tweets and running analysis...</div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          {/* Liste cumulative */}
          {tweets.map(tweet => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              user={selectedUser}
            />
          ))}
          {/* Affiche le loader en bas si on ajoute plus de tweets */}
          {loading && tweets.length > 0 && (
            <div className="flex flex-col items-center my-2">
              <Loader className="animate-spin text-[#1DA1F2] mb-2" />
              <div className="font-medium text-sm">Fetching more tweets...</div>
            </div>
          )}
          {((page + 1) * 5 < MOCK_TWEETS.length) && !loading && (
            <Button
              variant="outline"
              className="mx-auto my-2"
              onClick={handleBrowseMore}
              type="button"
            >
              Browse more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
