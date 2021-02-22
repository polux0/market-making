import { Order } from './orders/order';
import { OrderTypes } from './orders/ordertypes';

import market = require('./utils/market');
import utils = require('./utils/utils');

const pendingOrders: Order[] = [];
const filledOrders: Order[] = [];

const balances = {
  eth: 10,
  usd: 20000,
};
const reservedBalances = {
  eth: 0,
  usd: 0,
};

const marketCycle = async () => {
  const state = await market.getOrders();

  const bestBid: Order = new Order(
    state[0][0],
    state[0][2],
    0,
    OrderTypes.UNEDFINED,
  );
  const askSearch: any = state.find((order: any) => order[2] < 0);
  const bestAsk: Order = new Order(
    askSearch[0],
    askSearch[2],
    0,
    OrderTypes.UNEDFINED,
  );

  await utils.fillOrders(
    bestBid,
    bestAsk,
    pendingOrders,
    filledOrders,
    balances,
    reservedBalances,
  );
  await utils.createOrders(
    bestBid,
    bestAsk,
    balances,
    reservedBalances,
    pendingOrders,
  );
  setTimeout(marketCycle, 5000);
};

const balanceCycle = async () => {
  utils.logAssetBalances(balances, reservedBalances);
  setTimeout(balanceCycle, 30000);
};
setTimeout(marketCycle, 5000);
setTimeout(balanceCycle, 30000);
