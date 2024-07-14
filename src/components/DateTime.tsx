import { useState, useEffect } from 'react'

export const DateTime = (props: { withYear: Boolean }) => {
  const [date, setDate] = useState(new Date());
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  });

  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  return(
    <>
      <p className="subtitle is-bold" style={{ fontSize: '2rem' }}>
        {dayNames[date.getDay()]}, {props.withYear ? date.getFullYear() : ''} {month} {day}
      </p>
      <p className='subtitle is-bold' style={{ fontSize: '15rem' }}>
        {date.getHours()}:{String(date.getMinutes()).padStart(2, '0')}
      </p>
    </>
  )
}

export default DateTime