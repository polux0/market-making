import { Order } from './order/order';
import { OrderTypes } from './order/ordertypes';

import logger = require('./logs/');
import api = require('./external');
import market = require('./market');

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
  const state = await api.getOrders();

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
  await market.createOrders(
    bestBid,
    bestAsk,
    balances,
    reservedBalances,
    pendingOrders,
  );
  await market.fillOrders(
    bestBid,
    bestAsk,
    pendingOrders,
    filledOrders,
    balances,
    reservedBalances,
  );
  setTimeout(marketCycle, 5000);
};

const balanceCycle = async () => {
  logger.logAssetBalances(balances);
  setTimeout(balanceCycle, 30000);
};
setTimeout(marketCycle, 5000);
setTimeout(balanceCycle, 30000);
