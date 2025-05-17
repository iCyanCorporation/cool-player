"use client";

import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Expand, Minimize } from "lucide-react";

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playVideoUrl, setPlayVideoUrl] = useState(""); // Stores the processed URL for the player
  const [wallpaperImage, setWallpaperImage] = useState<string | null>(null); // Stores data URL for image preview
  const [wallpaperVideo, setWallpaperVideo] = useState<string | null>(null); // Stores the video URL for the player
  const [hasAttemptedCreate, setHasAttemptedCreate] = useState(false);
  const [playerOpacity, setPlayerOpacity] = useState(0.75);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFsButtonVisible, setIsFsButtonVisible] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hideButtonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToEmbedUrl = (url: string): string => {
    if (!url) return "";

    // YouTube URL regex (handles various formats)
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      const videoId = youtubeMatch[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
    }

    // Check for image files (which are not videos)
    if (url.match(/\.(jpeg|jpg|gif|png)(\?.*)?$/i)) {
      return ""; // Invalid video source
    }

    // Check for direct video files
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      return url; // Use direct URL for <video> tag
    }

    // If it's an HTTPS URL but not matched above, it might be a different embeddable link or direct video
    // For simplicity, we'll return it and let the browser try. More robust parsing for Vimeo, etc., could be added.
    if (url.startsWith("https://")) {
      return url;
    }

    return ""; // Fallback for unrecognised or non-HTTPS URLs
  };

  const handleCreateVideoPlayer = () => {
    setHasAttemptedCreate(true);
    if (videoUrl) {
      const embedUrl = convertToEmbedUrl(videoUrl);
      setPlayVideoUrl(embedUrl);
    } else {
      // No video URL provided
      setPlayVideoUrl("");
      setWallpaperImage(null); // Clear image as well
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const handlePlayerMouseEnter = () => {
    if (hideButtonTimerRef.current) {
      clearTimeout(hideButtonTimerRef.current);
      hideButtonTimerRef.current = null;
    }
    setIsFsButtonVisible(true);
  };

  const handlePlayerMouseLeave = () => {
    hideButtonTimerRef.current = setTimeout(() => {
      setIsFsButtonVisible(false);
    }, 3000); // Hide after 3 seconds
  };

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (hideButtonTimerRef.current) {
        clearTimeout(hideButtonTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold">🎧 Cool Audio Player</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Turn any video into an immersive, visually engaging wallpaper
          experience.
        </p>
      </header>

      <main className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8 flex-grow">
        {" "}
        {/* Changed items-center to items-start for md */}
        {/* Input Controls Panel */}
        <div className="w-full max-w-md p-6 border rounded-lg shadow-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-xl font-semibold">
              1. Enter Video URL
            </Label>
            <Input
              id="videoUrl"
              type="text"
              placeholder="e.g., YouTube, Vimeo, .mp4, .webm"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setHasAttemptedCreate(false);
              }}
              className="w-full"
            />
          </div>
          <Button
            className="w-full" // Added pt-6 for more space above this button
            onClick={handleCreateVideoPlayer}
            disabled={!videoUrl}
          >
            PLAY
          </Button>

          <div className="space-y-2">
            <Label htmlFor="imageFileButton" className="text-xl font-semibold">
              2. Select Background Image or local video
            </Label>
            <div className="flex items-center gap-3">
              <Button
                id="imageFileButton"
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0"
              >
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground truncate flex-grow min-w-0">
                {selectedFile ? selectedFile.name : "No file selected"}
              </span>
            </div>
            <Input
              ref={fileInputRef}
              id="imageFileHidden" // Added id for potential label association if needed elsewhere
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file); // Always set selectedFile for both image and video
                  if (file.type.startsWith("video/")) {
                    // Always revoke previous object URL before creating a new one
                    if (
                      typeof wallpaperVideo === "string" &&
                      wallpaperVideo.startsWith("blob:")
                    ) {
                      URL.revokeObjectURL(wallpaperVideo);
                    }
                    const videoUrl = URL.createObjectURL(file);
                    setWallpaperVideo(videoUrl);
                    setWallpaperImage(null); // Clear image if a video is selected
                  } else if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setWallpaperImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                    setWallpaperVideo(null); // Clear video if an image is selected
                  }
                  // Do NOT clear playVideoUrl here, so YouTube/video URL stays active
                } else {
                  setSelectedFile(null);
                  if (
                    typeof wallpaperVideo === "string" &&
                    wallpaperVideo.startsWith("blob:")
                  ) {
                    URL.revokeObjectURL(wallpaperVideo);
                  }
                  setWallpaperVideo(null); // Clear video if no file is selected
                  // Do NOT clear playVideoUrl here
                }
                setHasAttemptedCreate(false);
              }}
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="opacity-slider"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Player Opacity: {Math.round(playerOpacity * 100)}%
            </label>
            <Slider
              id="opacity-slider"
              defaultValue={[0.75]}
              min={0}
              max={1}
              step={0.01}
              value={[playerOpacity]}
              onValueChange={(value) => setPlayerOpacity(value[0])}
              className="w-full"
            />
          </div>
        </div>
        {/* Player Display */}
        <div
          ref={playerContainerRef}
          className={`border rounded-lg shadow-md bg-muted overflow-hidden ${isFullScreen ? "fixed inset-0 z-50 w-screen h-screen max-w-none" : "w-full max-w-2xl aspect-video flex items-center justify-center relative"}`}
          onMouseEnter={handlePlayerMouseEnter}
          onMouseLeave={handlePlayerMouseLeave}
        >
          {/* Wallpaper: image or local video */}
          <div className="absolute top-0 left-0 w-full h-full">
            {wallpaperImage && (
              <img
                src={wallpaperImage}
                alt="Wallpaper"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              />
            )}
            {wallpaperVideo && (
              <video
                key={wallpaperVideo + (wallpaperImage || "noimg")}
                width="100%"
                height="100%"
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.poster = "";
                  target.style.display = "none";
                  const msg = document.createElement("div");
                  msg.textContent = "Failed to load video wallpaper.";
                  msg.className =
                    "absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/60 text-white z-10";
                  target.parentElement?.appendChild(msg);
                }}
              >
                <source
                  src={wallpaperVideo}
                  type={
                    selectedFile
                      ? selectedFile.type
                      : `video/${wallpaperVideo.split(".").pop()?.split("?")[0]}`
                  }
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          {/* YouTube or remote video iframe (always rendered if playVideoUrl) */}
          {playVideoUrl &&
            (playVideoUrl.match(/youtube|vimeo|\/embed\//i) ? (
              <iframe
                key={playVideoUrl + (wallpaperImage || "noimg")}
                width="100%"
                height="100%"
                src={playVideoUrl}
                title="Wallpaper Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full z-10"
                style={{ opacity: playerOpacity }}
              ></iframe>
            ) : null)}
          {playVideoUrl && isFsButtonVisible && (
            <Button
              onClick={toggleFullScreen}
              variant="outline"
              size="icon"
              className={`absolute top-3 right-3 z-20 transition-opacity duration-300 ${isFsButtonVisible ? "opacity-100" : "opacity-0"} ${isFullScreen ? "bg-black/50 hover:bg-black/70 text-white" : "bg-white/50 hover:bg-white/70 text-black"}`}
              onMouseEnter={handlePlayerMouseEnter}
              onMouseLeave={handlePlayerMouseLeave}
              aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Expand className="h-4 w-4" />
              )}
            </Button>
          )}
          {/* Error and placeholder handling */}
          {(() => {
            if (hasAttemptedCreate && videoUrl && !playVideoUrl) {
              return (
                <p className="text-red-400 z-10 bg-gray-800/90 rounded-md text-center">
                  Unsupported video URL or format. <br /> Please use a valid
                  YouTube, .mp4, .webm, or .ogg link.
                </p>
              );
            }
            if (!playVideoUrl && !wallpaperImage && !wallpaperVideo) {
              return (
                <p className="text-muted-foreground z-10">
                  Audio-Visual Wallpaper Display Area
                </p>
              );
            }
            return null;
          })()}
        </div>
      </main>

      <footer className="text-center my-12 text-muted-foreground">
        <p>
          &copy; 2025 Cool Audio Player. Built with Next.js and TailwindCSS.
        </p>
      </footer>
    </div>
  );
}
