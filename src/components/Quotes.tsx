/* eslint-disable jsx-a11y/anchor-is-valid */

import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [quote, setQuote] = useState()

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch(
          "https://gist.githubusercontent.com/encoreshao/b5ace7ba9e7f1b689646a06c4478cf48/raw"
        );
        const quotes = await res.json();
        setQuotes(quotes.quotes);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, [])

  useEffect(() => {
    quotes && handleRefreshQuote(quotes)
  }, [quotes])

  const handleRefreshQuote = (quotes: any) => {
    setQuote(
      quotes[Math.floor(Math.random() * quotes.length)]
    )
  }

  return (
    <>
      <div className="hero-body">
        <div className="container has-text-centered">
          {/* <p className="title">Quotes</p> */}
          {/* <hr /> */}
        </div>
      </div>

      {quote &&
        <div className="card has-background-primary-100">
          <div className="container card-content">
            <p className="title">
              ”{quote['quote']}“
            </p>

            <br />
            <p className="subtitle is-primary" style={{ cursor: 'pointer' }} onClick={() => handleRefreshQuote(quotes) }>
              <FontAwesomeIcon
                icon={faRefresh}
                fontSize={'20'}
                className="pr-2"
              />

              Refresh new
            </p>
            {quote['author'] && <p className="subtitle">{quote['author']}</p>}
          </div>
        </div>
      }
    </>
  );
}

export default Quotes;
