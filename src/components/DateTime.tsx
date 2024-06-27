import { useState, useEffect } from 'react'

export const DateTime = () => {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(()=>setDate(new Date()), 1000 )
    return function cleanup() {
      clearInterval(timer)
    }
  });

  return(
    <>
      <p> {date.toLocaleDateString()} : {date.toLocaleTimeString()} </p>
    </>
  )
}

export default DateTime