"use client";

import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Expand, Minimize } from "lucide-react";

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [wallpaperUrl, setWallpaperUrl] = useState(""); // Stores the processed URL for the player
  const [wallpaperImage, setWallpaperImage] = useState<string | null>(null); // Stores data URL for image preview
  const [hasAttemptedCreate, setHasAttemptedCreate] = useState(false);
  const [playerOpacity, setPlayerOpacity] = useState(0.75);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFsButtonVisible, setIsFsButtonVisible] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hideButtonTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCreateWallpaper = () => {
    setHasAttemptedCreate(true);
    if (videoUrl) {
      const embedUrl = convertToEmbedUrl(videoUrl);
      setWallpaperUrl(embedUrl);

      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setWallpaperImage(reader.result as string);
        };
        reader.readAsDataURL(imageFile);
      } else {
        setWallpaperImage(null); // Clear image if none selected in this attempt
      }
    } else {
      // No video URL provided
      setWallpaperUrl("");
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
    <div className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold">🎧 Cool Audio Player</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Turn any video into an immersive, visually engaging wallpaper
          experience.
        </p>
      </header>

      <main className="flex flex-col items-center gap-8">
        {/* Placeholder for Video URL Input */}
        <div className="w-full max-w-md p-6 border rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">1. Enter Video URL</h2>
          <input
            type="text"
            placeholder="e.g., YouTube, Vimeo, .mp4, .webm"
            className="w-full p-2 border rounded mb-4"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setHasAttemptedCreate(false); // Reset attempt status on new input
            }}
          />
          {/* Placeholder for Image Selection */}
          <h2 className="text-2xl font-semibold mb-4 mt-6">
            2. Select Background Image
          </h2>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              } else {
                setImageFile(null);
              }
              setHasAttemptedCreate(false); // Reset attempt status
            }}
          />
          <button
            className="mt-6 w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90"
            onClick={handleCreateWallpaper}
            disabled={!videoUrl} // Optionally disable if no URL
          >
            Create Wallpaper
          </button>
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
          className={`border rounded-lg shadow-md bg-muted overflow-hidden ${isFullScreen ? "fixed inset-0 z-50 w-screen h-screen max-w-none p-0" : "w-full max-w-2xl aspect-video flex items-center justify-center p-6 relative"}`}
          onMouseEnter={handlePlayerMouseEnter}
          onMouseLeave={handlePlayerMouseLeave}
          style={
            wallpaperImage
              ? {
                  backgroundImage: `url(${wallpaperImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : { backgroundColor: "#2d3748" }
          } // Darker default bg
        >
          {wallpaperUrl && isFsButtonVisible && (
            <Button
              onClick={toggleFullScreen}
              variant="outline"
              size="icon" // Changed to icon size
              className={`absolute top-3 right-3 z-20 transition-opacity duration-300 ${isFsButtonVisible ? "opacity-100" : "opacity-0"} ${isFullScreen ? "bg-black/50 hover:bg-black/70 text-white" : "bg-white/50 hover:bg-white/70 text-black"}`}
              onMouseEnter={handlePlayerMouseEnter} // Keep button visible if mouse is over it
              onMouseLeave={handlePlayerMouseLeave} // Restart timer if mouse leaves button itself
              aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"} // Accessibility
            >
              {isFullScreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Expand className="h-4 w-4" />
              )}
            </Button>
          )}
          {(() => {
            if (hasAttemptedCreate && videoUrl && !wallpaperUrl) {
              return (
                <p className="text-red-400 z-10 p-4 bg-gray-800/90 rounded-md text-center">
                  Unsupported video URL or format. <br /> Please use a valid
                  YouTube, .mp4, .webm, or .ogg link.
                </p>
              );
            }
            if (wallpaperUrl) {
              const isDirectVideo =
                wallpaperUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) != null;
              if (isDirectVideo) {
                return (
                  <video
                    key={wallpaperUrl + (wallpaperImage || "noimg")}
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    muted
                    loop
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    style={{ opacity: playerOpacity }}
                  >
                    <source
                      src={wallpaperUrl}
                      type={`video/${wallpaperUrl.split(".").pop()?.split("?")[0]}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                );
              } else {
                // Assumed embeddable link like YouTube or other platform that provides direct embed URL
                return (
                  <iframe
                    key={wallpaperUrl + (wallpaperImage || "noimg")}
                    width="100%"
                    height="100%"
                    src={wallpaperUrl}
                    title="Wallpaper Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full z-0"
                    style={{ opacity: playerOpacity }}
                  ></iframe>
                );
              }
            }
            // Default placeholder
            return (
              <p className="text-muted-foreground z-10">
                Audio-Visual Wallpaper Display Area
              </p>
            );
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
