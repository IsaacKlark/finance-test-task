export const setTickers = tickers => ({
  type: "TICKERS",
  tickers: tickers
});

const getTickers = (currentTickers = [], action) => {
  switch (action.type) {
    case "TICKERS":
      return action.tickers;
    default:
      return currentTickers;
  }
}

export default getTickers;