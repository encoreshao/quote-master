import React, { useState, useEffect } from 'react';

interface ClockWidgetProps {
  username?: string;
  greeting?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const ClockWidget: React.FC<ClockWidgetProps> = ({ username, greeting }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const displayGreeting = greeting || `${getGreeting()}${username ? `, ${username}` : ''}`;

  return (
    <div className="text-center py-4">
      <p className="text-5xl md:text-6xl font-light t-primary tracking-tight">
        {formatTime(now)}
      </p>
      <p className="t-tertiary text-sm mt-2">
        {formatDate(now)}
      </p>
      <p className="t-secondary text-lg mt-1 font-light">
        {displayGreeting}
      </p>
    </div>
  );
};

export default ClockWidget;
