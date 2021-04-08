export const getCurrentBTC = async () => {
  const URL = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD';
  return await (await fetch(URL)).json();
};
