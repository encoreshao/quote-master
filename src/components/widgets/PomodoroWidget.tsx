import React, { useState, useEffect, useRef } from 'react';
import WidgetCard from './WidgetCard';

type Phase = 'work' | 'break';

const PomodoroWidget: React.FC = () => {
  const [workMinutes] = useState(25);
  const [breakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('work');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Switch phase
            const nextPhase: Phase = phase === 'work' ? 'break' : 'work';
            setPhase(nextPhase);
            return (nextPhase === 'work' ? workMinutes : breakMinutes) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, phase, workMinutes, breakMinutes]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = (phase === 'work' ? workMinutes : breakMinutes) * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const handleReset = () => {
    setIsRunning(false);
    setPhase('work');
    setSecondsLeft(workMinutes * 60);
  };

  return (
    <WidgetCard
      title={phase === 'work' ? 'Focus Time' : 'Break Time'}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    >
      <div className="flex flex-col items-center py-2">
        {/* Timer display */}
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--glass-border-subtle)" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={phase === 'work' ? 'var(--accent-color)' : '#10B981'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-light t-primary tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="glass-button text-xs px-4 py-1.5"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="glass-button-ghost text-xs px-3 py-1.5"
          >
            Reset
          </button>
        </div>
      </div>
    </WidgetCard>
  );
};

export default PomodoroWidget;
