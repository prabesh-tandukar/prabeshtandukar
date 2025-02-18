// src/components/PixelCollectorGame.tsx
import React, { useState, useEffect, useCallback } from "react";

interface Pixel {
  x: number;
  y: number;
  id: number;
}

interface PlayerPosition {
  x: number;
  y: number;
}

interface PixelCollectorGameProps {
  onScore: (score: number) => void;
  soundEnabled?: boolean;
}

const PixelCollectorGame: React.FC<PixelCollectorGameProps> = ({
  onScore,
  soundEnabled = true,
}) => {
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({ x: 50, y: 50 });
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameLevel, setGameLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [highScore, setHighScore] = useState(0);

  // Sound effects
  const collectSound = new Audio("/sounds/collect.wav");

  const playCollectSound = () => {
    if (soundEnabled) {
      collectSound.currentTime = 0;
      collectSound.play().catch(() => {});
    }
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setGameLevel(1);
    generatePixels();
  };

  const generatePixels = () => {
    const pixelCount = Math.min(5 + gameLevel, 15); // Increase pixels with level
    const newPixels: Pixel[] = [];

    for (let i = 0; i < pixelCount; i++) {
      newPixels.push({
        x: Math.random() * 90,
        y: Math.random() * 90,
        id: Date.now() + i,
      });
    }
    setPixels(newPixels);
  };

  const movePlayer = useCallback(
    (e: KeyboardEvent) => {
      if (!gameActive) return;

      const speed = 5 + gameLevel * 0.5; // Increase speed with level

      switch (e.key) {
        case "ArrowUp":
          setPlayerPos((prev) => ({ ...prev, y: Math.max(0, prev.y - speed) }));
          break;
        case "ArrowDown":
          setPlayerPos((prev) => ({
            ...prev,
            y: Math.min(90, prev.y + speed),
          }));
          break;
        case "ArrowLeft":
          setPlayerPos((prev) => ({ ...prev, x: Math.max(0, prev.x - speed) }));
          break;
        case "ArrowRight":
          setPlayerPos((prev) => ({
            ...prev,
            x: Math.min(90, prev.x + speed),
          }));
          break;
        default:
          break;
      }
    },
    [gameActive, gameLevel]
  );

  // Handle keyboard input
  useEffect(() => {
    window.addEventListener("keydown", movePlayer);
    return () => window.removeEventListener("keydown", movePlayer);
  }, [movePlayer]);

  // Game timer
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          if (score > highScore) {
            setHighScore(score);
          }
          onScore(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, score, highScore, onScore]);

  // Collision detection and pixel collection
  useEffect(() => {
    if (!gameActive) return;

    const newPixels = pixels.filter((pixel) => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - pixel.x, 2) + Math.pow(playerPos.y - pixel.y, 2)
      );

      if (distance < 5) {
        setScore((prev) => prev + 10 * gameLevel);
        playCollectSound();
        return false;
      }
      return true;
    });

    if (newPixels.length < pixels.length) {
      setPixels(newPixels);
      if (newPixels.length === 0) {
        setGameLevel((prev) => prev + 1);
        generatePixels();
      }
    }
  }, [playerPos, pixels, gameActive, gameLevel, soundEnabled]);

  return (
    <div className="border-2 border-green-400 p-4 relative h-96">
      {!gameActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-xl mb-4">Pixel Collector</h3>
          <p className="mb-2">Collect pixels using arrow keys!</p>
          <p className="mb-4">High Score: {highScore}</p>
          <button
            onClick={startGame}
            className="border-2 border-green-400 p-2 hover:bg-green-400 hover:text-black transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          {/* Game HUD */}
          <div className="absolute top-4 right-4 flex flex-col items-end">
            <div className="mb-2">Level: {gameLevel}</div>
            <div className="mb-2">Score: {score}</div>
            <div className="mb-2">Time: {timeLeft}s</div>
          </div>

          {/* Player */}
          <div
            className="absolute w-4 h-4 bg-green-400 transform transition-all duration-100"
            style={{
              left: `${playerPos.x}%`,
              top: `${playerPos.y}%`,
              boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
            }}
          />

          {/* Pixels */}
          {pixels.map((pixel) => (
            <div
              key={pixel.id}
              className="absolute w-2 h-2 bg-yellow-400 animate-pulse"
              style={{
                left: `${pixel.x}%`,
                top: `${pixel.y}%`,
                boxShadow: "0 0 5px rgba(236, 201, 75, 0.5)",
              }}
            />
          ))}

          {/* Level indicator */}
          <div className="absolute top-4 left-4 text-sm">Level {gameLevel}</div>
        </>
      )}
    </div>
  );
};

export default PixelCollectorGame;
