import './index.css';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as funcsFromStore from '../../store/store';
import { io } from 'socket.io-client';
import arrowUp from './images/arrowUp.svg';
import arrowDown from './images/arrowDown.svg';

const socket = io.connect('http://localhost:4000');

const Statistic = ({ tickers, applyTickers }) => {
  const [prevTickers, setPrevTickers] = useState([]);
  const [changePrev, setChangePrev] = useState(false);
  const [displayBrands, setDisplayBrands] = useState([
    { name: 'Apple', active: true, ticker: "AAPL" },
    { name: 'Alphabet', active: true, ticker: "GOOGL" },
    { name: 'Microsoft', active: true, ticker: "MSFT" },
    { name: 'Amazon', active: true, ticker: "AMZN" },
    { name: 'Facebook', active: true, ticker: "FB" },
    { name: 'Tesla', active: true, ticker: "TSLA" }
  ])

  useEffect(() => {
    socket.emit('start');

    socket.on('ticker', res => {
      applyTickers(res)
    });
  }, []);

  useEffect(() => {
    if (changePrev) {
      setPrevTickers(tickers);
    }

    setChangePrev(!changePrev)

  }, [tickers]);

  const tickerNames = [
    { AAPL: "Apple" },
    { GOOGL: "Alphabet" },
    { MSFT: "Microsoft" },
    { AMZN: "Amazon" },
    { FB: "Facebook" },
    { TSLA: "Tesla" }
  ];

  const changeActiveBrands = (name) => {
    const copyDisplayBrands = [...displayBrands].map(result => {
      if (result.name === name) {
        return ({ ...result, active: !result.active })
      } else {
        return result;
      }
    })

    setDisplayBrands(copyDisplayBrands);
  }

  return (
    <article className="statistic">
      <form className="statistic__form">
        {
          displayBrands.map(result => (
            <label key={result.name} htmlFor={result.name} className="statistic__label">
              <input
                id={result.name}
                type="checkbox"
                checked={result.active}
                onChange={() => { changeActiveBrands(result.name) }}
              />
              <p className="statistic__text">
                {result.name}
              </p>
            </label>
          ))
        }
      </form>


      <div className="statistic__table">
        <p className="statistic__text statistic__headerText">
          Name
        </p>
        <p className="statistic__text statistic__headerText">
          Change Percent
        </p>
        <p className="statistic__text statistic__headerText">
          Dividend
        </p>
        <p className="statistic__text statistic__headerText">
          Last Trade Time
        </p>
        <p className="statistic__text statistic__headerText">
          Price
        </p>
        <p className="statistic__text statistic__headerText">
          Yield
        </p>
        {
          tickers.map(result => {
            const date = new Date(result.last_trade_time);
            let priceGrowth = false;
            if (prevTickers.length && prevTickers.find(ticker => ticker.ticker === result.ticker)) {
              priceGrowth = prevTickers.find(ticker => ticker.ticker === result.ticker).price < result.price;
            }

            if (!displayBrands.find(brand => brand.ticker === result.ticker).active) {
              return null;
            }

            return (
              <React.Fragment key={result.ticker}>
                <p className="statistic__text statistic__name">
                  {tickerNames.find(ticker => ticker[result.ticker])[result.ticker]}
                </p>
                <p className="statistic__text">
                  {result.change_percent}
                </p>
                <p className="statistic__text">
                  {result.dividend}
                </p>
                <p className="statistic__text">
                  {`${('0' + date.getDate()).slice(-2)}-${('0' + date.getMonth()).slice(-2)}-${date.getFullYear()}`}
                </p>
                <div className="statistic__wrapper">
                  <p className="statistic__text">
                    {result.price}
                  </p>
                  <img
                    src={priceGrowth ? arrowUp : arrowDown}
                    alt={priceGrowth ? 'рост цены' : "падение цены"}
                    className={`statistic__arrow ${priceGrowth ? "" : "statistic__arrowDown"}`}
                  />
                </div>
                <p className="statistic__text">
                  {result.yield}
                </p>
              </React.Fragment>
            )
          })
        }
      </div>
    </article>
  )
}

const storeFuncs = {
  applyTickers: funcsFromStore.applyTickers
};

const storeData = state => ({
  tickers: state.tickers
});

export default connect(storeData, storeFuncs)(Statistic);