import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import getTickers, { setTickers } from './tickers';

const rootReducer = combineReducers({
  tickers: getTickers,
});

export const applyTickers = tickers => dispatch => {
  dispatch(setTickers(tickers));
}

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;