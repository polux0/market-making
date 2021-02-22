import fetch from 'node-fetch';

export const getOrders = async () => {
  const params = {
    symbol: 'tETHUSD',
    precision: 'P0',
  };
  const url = `https://api.deversifi.com/bfx/v2/book/${params.symbol}/${params.precision}`;
  let response: any;
  try{
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
  catch(error){
    console.log('Could not fetch latest orders:', params.symbol);
    console.log('Error', error);
    return {};
  }
  return response.json();
};
export const getLastPrice = async () => {
  const symbol = 'ETH:USDT';
  const url = `https://api.deversifi.com/market-data/ticker/${symbol}`;
  let response: any;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log('Could not fetch latest price:', symbol);
    console.log('Error', error);
    return {};
  }

  return response.json();
};
