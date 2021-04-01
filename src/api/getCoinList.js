export const getCoinLis = async () => {
  const URL =
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true";
  const jsonData = await (await fetch(URL)).json();

  return jsonData.Data;
};
