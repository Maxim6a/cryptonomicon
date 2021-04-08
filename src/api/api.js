// import { getCurrentBTC } from '@/api/getCurrentBTC';

const API_KEY =
  'd6da2c95a64e83577796ab2de98e3b8613a052b5f2c3e45b73af5177d7f599bd';

const tickersHandlers = new Map(); // {}
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = '5';
const ERROR_INDEX = '500';
const keyActionAdd = 'SubAdd';
const keyActionRemove = 'SubRemove';

socket.addEventListener('message', async (e) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(
    e.data
  );
  console.log(type, ERROR_INDEX, AGGREGATE_INDEX);
  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    'open',
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket(getSubscriptionMessage(keyActionAdd, ticker));
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket(getSubscriptionMessage(keyActionRemove, ticker));
}

export const getSubscriptionMessage = (action, ticker, sub = 'USD') => {
  return {
    action: `${action}`,
    subs: [`5~CCCAGG~${ticker}~${sub}`]
  };
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};
