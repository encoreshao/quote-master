import { useState, useEffect } from 'react'

export const DateTime = (props: { wday: Boolean }) => {
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

  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  return(
    <>
      {props.wday && <p className='title'>{dayNames[date.getDay()]}</p>}
      <br />
      <p className="subtitle is-bold"> {month} {day}, {year} {date.toLocaleTimeString()} </p>
    </>
  )
}

export default DateTime