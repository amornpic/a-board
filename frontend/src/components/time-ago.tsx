import { useEffect, useState } from 'react';

type TimeUnit = {
  unit: string;
  ms: number;
};

const TIME_UNITS: TimeUnit[] = [
  { unit: 'year', ms: 31536000000 },
  { unit: 'month', ms: 2592000000 },
  { unit: 'day', ms: 86400000 },
  { unit: 'hour', ms: 3600000 },
  { unit: 'minute', ms: 60000 },
  { unit: 'second', ms: 1000 }
];

const formatTimeAgo = (date: Date | number): string => {
  const timestamp = date instanceof Date ? date.getTime() : date;
  const now = Date.now();
  const diff = now - timestamp;

  // Handle future dates
  if (diff < 0) {
    return 'in the future';
  }

  // Find the appropriate time unit
  const timeUnit = TIME_UNITS.find(unit => diff >= unit.ms) || TIME_UNITS[TIME_UNITS.length - 1];
  const value = Math.floor(diff / timeUnit.ms);

  // Handle special cases for better readability
  if (diff < 60000) { // less than 1 minute
    return 'just now';
  }

  return `${value} ${timeUnit.unit}${value !== 1 ? 's' : ''} ago`;
};

// React component with auto-update
const TimeAgo: React.FC<{ date: Date | number }> = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    // Initial format
    setTimeAgo(formatTimeAgo(date));

    // Update every minute
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return <span>{timeAgo}</span>;
};

export { TimeAgo, formatTimeAgo };