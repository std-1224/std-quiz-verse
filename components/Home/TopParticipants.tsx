"use client";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/libs/utils";
import Image from "next/image";
import { generateIdenticonAvatar } from "@/utils/generateAvatar";
import { useGetTopParticipantsQuery } from "@/libs/features/leaderboard/leaderboardApiSlice";
import { isTopParticipantsResponse } from "@/utils/typeGuards";
import LoadingSkeleton from "./TopParticipantsLoadingSkeleton";
import { useSocket } from "@/hooks/useSocket";
import { TopParticipantsTypes } from "@/types/leaderboard";
import Error from "../common/Error";
import { AnimatePresence, motion } from "framer-motion";

export default function TopParticipants() {
  const { data: initialParticipants, isLoading, isError } = useGetTopParticipantsQuery();
  const [participants, setParticipants] = useState<TopParticipantsTypes[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (initialParticipants && isTopParticipantsResponse(initialParticipants)) {
      setParticipants(initialParticipants.data);
    }
  }, [initialParticipants]);

  useEffect(() => {
    if (socket) {
      socket.on("topParticipants", (updatedParticipants) => {
        console.log("Top participants updated:", updatedParticipants);
  
        setParticipants((prevParticipants) => {
          // If lengths are different, update immediately
          if (prevParticipants.length !== updatedParticipants.length) {
            return updatedParticipants;
          }
  
          // Compare previous and updated participants in both order and values
          const isSameData = prevParticipants.every(
            (prev, index) =>
              prev.userId === updatedParticipants[index]?.userId &&
              prev.totalMarks === updatedParticipants[index]?.totalMarks &&
              prev.rank === updatedParticipants[index]?.rank
          );
  
          // Update state only if something has changed
          return isSameData ? prevParticipants : updatedParticipants;
        });
      });
    }
  
    return () => {
      if (socket) socket.off("topParticipants");
    };
  }, [socket]);
  
  

  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case 2: return "bg-gray-300/10 text-gray-300 border-gray-300/20";
      case 3: return "bg-amber-600/10 text-amber-600 border-amber-600/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  let element = null;

  if (isLoading) {
    element = <LoadingSkeleton />;
  }

  if (isError) {
    element = <Error msg="Please try again later." />;
  }

  if (!participants || participants.length === 0) {
    element = <p className="text-gray-400">No data available.</p>;
  }

  if (participants && participants.length > 0) {
    element = (
      <motion.div className="space-y-4">
        <AnimatePresence>
          {participants.map((participant, index) => {
            const avatarSvg = participant.avatar || generateIdenticonAvatar(participant.name, 40);

            return (
              <motion.div
                key={participant.userId}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                  mass: 0.5,
                  delay: index * 0.05, // Staggered animation
                }}
                className="bg-[#343434] p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {participant.avatar ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden relative">
                        <Image
                          src={participant.avatar}
                          alt={participant.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover aspect-square"
                        />
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: avatarSvg }}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                      />
                    )}
                    <div className="w-36">
                      <p className="text-white font-medium">{participant.name}</p>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border inline-block mt-1",
                          getBadgeColor(participant.rank)
                        )}
                      >
                        {participant.badge}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-bold text-base">
                      {participant.totalMarks} /=
                    </p>
                    <p className="text-xs text-gray-400">Rank #{participant.rank}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#1C1C1C] border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Top Participants
      </h2>
      {element}
    </div>
  );
}
