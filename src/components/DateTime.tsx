import { useState, useEffect } from 'react'

export const DateTime = () => {
  const [date, setDate] = useState(new Date());
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const timer = setInterval(()=>setDate(new Date()), 1000 )
    return function cleanup() {
      clearInterval(timer)
    }
  });

  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  // Function to get the ordinal suffix for the day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // Handle special case for teens
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return(
    <span> {year} {month}, {day}{getOrdinalSuffix(day)} {date.toLocaleTimeString()} - <em> {dayNames[date.getDay()]} </em> </span>
  )
}

export default DateTime