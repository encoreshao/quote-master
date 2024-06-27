/* eslint-disable jsx-a11y/anchor-is-valid */

import { useEffect, useState } from "react";

function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [quote, setQuote] = useState()

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch("https://gist.githubusercontent.com/balasubramanim/95406cbd0e17d63085de11a1f13e06b3/raw");
        const quotes = await res.json();
        setQuotes(quotes.quotes);

      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, [])

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [quotes])

  return (
    <>
      <div className="hero-body" id="quotes">
        <div className="container has-text-centered">
          <p className="title">Quotes</p>
        </div>
      </div>

      {quote &&
        <div className="card has-background-primary-100">
          <div className="container card-content">
            <p className="title">
              ”{quote['quote']}“
            </p>
            <br />
            <p className="subtitle">{quote['author']}</p>
          </div>
        </div>
      }
    </>
  );
}

export default Quotes;
