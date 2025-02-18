"use client";

// src/components/Portfolio.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Github, Linkedin, Mail, Globe, User, Code, Briefcase, Award, ChevronRight, Gamepad } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { PortfolioData } from '@/types';


// Mini-game component
const PixelCollectorGame = ({ onScore }: { onScore: (score: number) => void }) => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [pixels, setPixels] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    generatePixels();
  };

  const generatePixels = () => {
    const newPixels = [];
    for (let i = 0; i < 5; i++) {
      newPixels.push({
        x: Math.random() * 90,
        y: Math.random() * 90,
        id: Date.now() + i
      });
    }
    setPixels(newPixels);
  };

  const movePlayer = useCallback((e: KeyboardEvent) => {
    if (!gameActive) return;
    
    const speed = 5;
    switch (e.key) {
      case 'ArrowUp':
        setPlayerPos(prev => ({ ...prev, y: Math.max(0, prev.y - speed) }));
        break;
      case 'ArrowDown':
        setPlayerPos(prev => ({ ...prev, y: Math.min(90, prev.y + speed) }));
        break;
      case 'ArrowLeft':
        setPlayerPos(prev => ({ ...prev, x: Math.max(0, prev.x - speed) }));
        break;
      case 'ArrowRight':
        setPlayerPos(prev => ({ ...prev, x: Math.min(90, prev.x + speed) }));
        break;
      default:
        break;
    }
  }, [gameActive]);

  useEffect(() => {
    window.addEventListener('keydown', movePlayer);
    return () => window.removeEventListener('keydown', movePlayer);
  }, [movePlayer]);

  useEffect(() => {
    if (!gameActive) return;

    const newPixels = pixels.filter(pixel => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - pixel.x, 2) + 
        Math.pow(playerPos.y - pixel.y, 2)
      );
      if (distance < 5) {
        setScore(prev => prev + 10);
        return false;
      }
      return true;
    });

    if (newPixels.length < pixels.length) {
      setPixels(newPixels);
      if (newPixels.length === 0) {
        generatePixels();
        onScore(score + 10);
      }
    }
  }, [playerPos, pixels, score, gameActive, onScore]);

  return (
    <div className="border-2 border-green-400 p-4 relative h-96">
      {!gameActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-xl mb-4">Pixel Collector</h3>
          <p className="mb-4">Collect pixels using arrow keys!</p>
          <button 
            onClick={startGame}
            className="border-2 border-green-400 p-2 hover:bg-green-400 hover:text-black"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-4 right-4">Score: {score}</div>
          <div 
            className="absolute w-4 h-4 bg-green-400"
            style={{ 
              left: `${playerPos.x}%`, 
              top: `${playerPos.y}%`,
              transition: 'all 0.1s'
            }}
          />
          {pixels.map(pixel => (
            <div
              key={pixel.id}
              className="absolute w-2 h-2 bg-yellow-400"
              style={{ 
                left: `${pixel.x}%`, 
                top: `${pixel.y}%` 
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// Retro Button Component
const RetroButton = ({ 
  onClick, 
  children, 
  active = false 
}: { 
  onClick: () => void; 
  children: React.ReactNode; 
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`border-2 p-2 flex items-center justify-center gap-2 transition-all
      ${active ? 'bg-green-400 text-black' : 'border-green-400 hover:bg-green-400 hover:text-black'}
      active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50`}
  >
    {children}
  </button>
);

// Progress Bar Component
const ProgressBar = ({ value, max }: { value: number; max: number }) => (
  <div className="w-full h-4 border-2 border-green-400 relative">
    <div 
      className="h-full bg-green-400 transition-all duration-500"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

// Main Portfolio Component
const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('start');
  const [typing, setTyping] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [experience, setExperience] = useState(0);
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string }>>([]);
  const [achievement, setAchievement] = useState<{ title: string; time: number } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Portfolio data
  const portfolioData: PortfolioData = {
    name: "Your Name",
    title: "Software Developer",
    level: "Level 5 Developer",
    about: "Masters in Software Engineering graduate from Auckland University. Passionate about creating efficient, scalable solutions and exploring new technologies.",
    skills: [
      { name: "JavaScript/TypeScript", level: 85 },
      { name: "React/Next.js", level: 90 },
      { name: "Node.js", level: 80 },
      { name: "Python", level: 75 },
      { name: "Java", level: 70 },
      { name: "SQL/NoSQL", level: 85 },
      { name: "AWS", level: 75 },
      { name: "Docker", level: 70 }
    ],
    projects: [
      {
        title: "Project 1",
        description: "A full-stack application using React and Node.js",
        tech: ["React", "Node.js", "MongoDB"],
        link: "#",
        xp: 500
      },
      {
        title: "Project 2",
        description: "Mobile-first web application with real-time features",
        tech: ["Next.js", "Firebase", "Tailwind"],
        link: "#",
        xp: 750
      }
    ],
    education: {
      degree: "Master of Software Engineering",
      school: "University of Auckland",
      year: "2024",
      achievements: ["Dean's List", "Research Excellence Award"]
    }
  };

  // Sound effects
  const sounds = {
    click: new Audio('/sounds/click.mp3'),
    levelUp: new Audio('/sounds/levelUp.mp3'),
    collect: new Audio('/sounds/collect.mp3')
  };

  const playSound = (soundName: keyof typeof sounds) => {
    if (soundEnabled && sounds[soundName]) {
      sounds[soundName].currentTime = 0;
      sounds[soundName].play().catch(() => {});
    }
  };

  // Typing effect
  useEffect(() => {
    if (activeSection === 'about') {
      let index = 0;
      const text = portfolioData.about;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setTyping(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activeSection]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Add experience and show notification
  const addExperience = (amount: number, reason: string) => {
    setExperience(prev => {
      const newXP = prev + amount;
      if (Math.floor(newXP / 1000) > Math.floor(prev / 1000)) {
        playSound('levelUp');
        showAchievement('Level Up!');
      }
      return newXP;
    });
    
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `+${amount}XP: ${reason}`
    }]);
    
    playSound('click');
    
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  // Show achievement
  const showAchievement = (title: string) => {
    setAchievement({ title, time: Date.now() });
    setTimeout(() => setAchievement(null), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono relative">
      {/* Sound toggle */}
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 right-4 border-2 border-green-400 p-2 z-50"
      >
        Sound: {soundEnabled ? 'ON' : 'OFF'}
      </button>

      {/* XP Bar and Level */}
      <div className="fixed top-16 right-4 border-2 border-green-400 p-2 bg-black">
        <div className="text-sm mb-1">{portfolioData.level}</div>
        <ProgressBar value={experience} max={1000} />
      </div>

      {/* Notifications */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 space-y-2">
        {notifications.map(notif => (
          <div 
            key={notif.id}
            className="bg-green-400 text-black px-4 py-2 rounded animate-slideDown"
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Achievement Popup */}
      {achievement && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 border-2 border-yellow-400 bg-black p-4 animate-popup">
          <div className="text-yellow-400">Achievement Unlocked!</div>
          <div>{achievement.title}</div>
        </div>
      )}

      {/* Start Screen */}
      {activeSection === 'start' ? (
        <div className="h-screen flex flex-col items-center justify-center animate-pulse">
          <h1 className="text-6xl mb-8">PORTFOLIO.exe</h1>
          <RetroButton 
            onClick={() => {
              setActiveSection('about');
              addExperience(100, 'Starting Journey');
            }}
          >
            PRESS START
          </RetroButton>
          <p className="mt-4 animate-bounce">INSERT COIN</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="border-2 border-green-400 p-4 mb-8">
            <h1 className="text-4xl mb-2">{portfolioData.name}</h1>
            <p className="text-xl">{portfolioData.title}</p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <Github 
                className="cursor-pointer hover:text-green-200 transform hover:scale-110 transition-all" 
                onClick={() => addExperience(50, 'GitHub Connected')}
              />
              <Linkedin 
                className="cursor-pointer hover:text-green-200 transform hover:scale-110 transition-all"
                onClick={() => addExperience(50, 'LinkedIn Connected')}
              />
              <Mail 
                className="cursor-pointer hover:text-green-200 transform hover:scale-110 transition-all"
                onClick={() => addExperience(50, 'Contact Made')}
              />
              <Globe 
                className="cursor-pointer hover:text-green-200 transform hover:scale-110 transition-all"
                onClick={() => addExperience(50, 'Website Visited')}
              />
            </div>
          </header>

          {/* Navigation */}
          <nav className="grid grid-cols-5 gap-4 mb-8">
            {[
              { id: 'about', icon: User, label: 'ABOUT' },
              { id: 'skills', icon: Code, label: 'SKILLS' },
              { id: 'projects', icon: Briefcase, label: 'PROJECTS' },
              { id: 'education', icon: Award, label: 'EDUCATION' },
              { id: 'game', icon: Gamepad, label: 'GAME' }
            ].map(({ id, icon: Icon, label }) => (
              <RetroButton
                key={id}
                onClick={() => {
                  setActiveSection(id);
                  addExperience(25, `Visited ${label}`);
                  playSound('click');
                }}
                active={activeSection === id}
              >
                <Icon size={16} />
                {label}
              </RetroButton>
            ))}
          </nav>

          {/* Main Content */}
          <main className="border-2 border-green-400 p-4">
            {/* About Section */}
            {activeSection === 'about' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl mb-4">> ABOUT_ME.exe</h2>
                <p>{typing}{showCursor ? '|' : ' '}</p>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl mb-4">> SKILLS.exe</h2>
                <div className="space-y-4">
                  {portfolioData.skills.map((skill, index) => (
                    <div key={index} className="border border-green-400 p-4">
                      <div className="flex justify-between mb-2">
                      <span>{skill.name}</span>
                        <span>{skill.level}/100</span>
                      </div>
                      <ProgressBar value={skill.level} max={100} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl mb-4">> PROJECTS.exe</h2>
                <div className="space-y-4">
                  {portfolioData.projects.map((project, index) => (
                    <div 
                      key={index} 
                      className="border border-green-400 p-4 hover:bg-green-400 hover:text-black transition-all cursor-pointer"
                      onClick={() => {
                        addExperience(project.xp, `Viewed ${project.title}`);
                        showAchievement(`Project Master: ${project.title}`);
                      }}
                    >
                      <h3 className="text-xl mb-2 flex items-center gap-2">
                        <ChevronRight size={16} />
                        {project.title}
                      </h3>
                      <p className="mb-2">{project.description}</p>
                      <div className="flex gap-2">
                        {project.tech.map((tech, i) => (
                          <span key={i} className="text-sm border border-current px-2">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm">XP Reward: {project.xp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl mb-4">> EDUCATION.exe</h2>
                <div className="border border-green-400 p-4">
                  <h3 className="text-xl mb-2">{portfolioData.education.degree}</h3>
                  <p>{portfolioData.education.school}</p>
                  <p>Graduated: {portfolioData.education.year}</p>
                  <div className="mt-4">
                    <h4 className="mb-2">Achievements:</h4>
                    {portfolioData.education.achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-yellow-400 cursor-pointer hover:text-yellow-300"
                        onClick={() => showAchievement(achievement)}
                      >
                        <Award size={16} />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Game Section */}
            {activeSection === 'game' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl mb-4">> MINIGAME.exe</h2>
                <PixelCollectorGame 
                  onScore={(score) => {
                    addExperience(score, 'Mini-game Score');
                    if (score >= 100) {
                      showAchievement('Game Master!');
                      playSound('levelUp');
                    }
                  }}
                />
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-8 text-center border-t-2 border-green-400 pt-4">
            <p className="animate-pulse">PRESS START TO CONTACT</p>
          </footer>
        </>
      )}

      {/* Avatar */}
      <div className="fixed bottom-4 right-4 w-16 h-16 border-2 border-green-400 p-1">
        <img 
          src="/api/artifacts/pixel-avatar" 
          alt="Pixel Avatar"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Portfolio;