import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/cn.js";
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineStop,
} from "react-icons/hi2";
import { motion as Motion, AnimatePresence } from "framer-motion";

const PRESET_TIMES = [
  { label: "15 min", minutes: 15 },
  { label: "25 min", minutes: 25 },
  { label: "45 min", minutes: 45 },
  { label: "60 min", minutes: 60 },
];

export default function FocusTimer({ onComplete }) {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const totalSeconds = selectedMinutes * 60;
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(selectedMinutes * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeRemaining(selectedMinutes * 60);
  };

  const handlePresetChange = (minutes) => {
    setSelectedMinutes(minutes);
    setTimeRemaining(minutes * 60);
    stopTimer();
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onComplete]);

  return (
    <div className="lt-card p-8">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-lt-text-primary mb-2">Focus Timer</h3>
        <p className="text-sm text-lt-text-tertiary">Stay focused, one session at a time</p>
      </div>

      {/* Preset Buttons */}
      <div className="lt-workspace-selector mb-8">
        {PRESET_TIMES.map((preset) => (
          <button
            key={preset.minutes}
            className={cn(
              "lt-workspace-option",
              selectedMinutes === preset.minutes && "lt-workspace-option--active"
            )}
            onClick={() => handlePresetChange(preset.minutes)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        {/* Progress Ring */}
        <div className="w-48 h-48 mx-auto relative">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--lt-border-subtle)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <Motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--lt-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={283}
              strokeDashoffset={283 - (283 * progress) / 100}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Motion.div
              className="text-5xl font-bold text-lt-text-primary font-mono"
              key={formatTime(timeRemaining)}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
            >
              {formatTime(timeRemaining)}
            </Motion.div>
            <p className="text-xs text-lt-text-tertiary mt-2 uppercase tracking-wider">
              {isRunning ? "Focusing" : isPaused ? "Paused" : "Ready"}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="lt-timer__controls justify-center">
        {!isRunning ? (
          <Motion.button
            className="lt-btn lt-btn--primary lt-btn--lg"
            onClick={startTimer}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiOutlinePlay className="w-5 h-5" />
            Start Focus
          </Motion.button>
        ) : (
          <Motion.button
            className="lt-btn lt-btn--secondary lt-btn--lg"
            onClick={isPaused ? startTimer : pauseTimer}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPaused ? (
              <>
                <HiOutlinePlay className="w-5 h-5" />
                Resume
              </>
            ) : (
              <>
                <HiOutlinePause className="w-5 h-5" />
                Pause
              </>
            )}
          </Motion.button>
        )}

        <Motion.button
          className="lt-btn lt-btn--ghost lt-btn--lg"
          onClick={resetTimer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <HiOutlineStop className="w-5 h-5" />
          Stop
        </Motion.button>
      </div>

      {/* Session Info */}
      {isRunning && (
        <Motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-lt-text-secondary">
            Session {Math.round(progress)}% complete
          </p>
        </Motion.div>
      )}
    </div>
  );
}