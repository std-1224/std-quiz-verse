import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  Hand,
} from "lucide-react";
import ControlButton from "./ControlButton";

export default function ControlsBar({
  setLayout,
  showChat,
  setShowChat,
  showParticipants,
  setShowParticipants,
}: {
  setLayout: (layout: "grid" | "spotlight") => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
}) {
  console.log(
    setLayout,
    showChat,
    setShowChat,
    showParticipants,
    setShowParticipants
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 w-full bg-background backdrop-blur-sm border-t border-gray-800">
      {/* Time (bottom-left) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        {currentTime}
      </div>

      {/* Controls (bottom-center) */}
      <div className="absolute bottom-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
        <ControlButton
          icon={isMuted ? MicOff : Mic}
          active={!isMuted}
          onClick={() => setIsMuted(!isMuted)}
          label="Mute/Unmute"
        />
        <ControlButton
          icon={isVideoOff ? VideoOff : Video}
          active={!isVideoOff}
          onClick={() => setIsVideoOff(!isVideoOff)}
          label="Video On/Off"
        />
        <ControlButton
          icon={Hand}
          active={isHandRaised}
          onClick={() => setIsHandRaised(!isHandRaised)}
          label="Raise Hand"
        />
        <ControlButton icon={Share2} label="Share Screen" />
        <ControlButton icon={PhoneOff} danger label="Leave Room" />
      </div>
    </div>
  );
}
