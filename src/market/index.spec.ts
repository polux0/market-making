import { Order } from '../order/order';
import { OrderTypes } from '../order/ordertypes';
import { OrderStates } from '../order/orderstates';
import api = require('../external');
import market = require('./index');

describe('function updateBalances()', () => {
  test('if function will update balances in accordance with the state of the order', async () => {
    const bidPlaced: Order= new Order(1, 1, 1, OrderTypes.BID, OrderStates.PLACED);
    const askPlaced: Order = new Order(1, 1, 2, OrderTypes.ASK, OrderStates.PLACED);
    const bidFilled: Order= new Order(1, 1, 3, OrderTypes.BID, OrderStates.FILLED);
    const askFilled: Order = new Order(1, 1, 4, OrderTypes.ASK, OrderStates.FILLED);
    const bidCanceled: Order = new Order(
      1,
      1,
      5,
      OrderTypes.BID,
      OrderStates.TO_BE_CANCELED,
    );
    const askCanceled = new Order(
      1,
      1,
      6,
      OrderTypes.ASK,
      OrderStates.TO_BE_CANCELED,
    );

    const balances = {
      eth: 2,
      usd: 2,
    };
    const reserveBalances = {
      eth: 0,
      usd: 0,
    };
    market.updateBalances(bidPlaced, balances, reserveBalances);
    expect(balances).toBeDefined();
    expect(balances.usd).toEqual(1);
    expect(reserveBalances.usd).toEqual(1);

    balances.eth = 2;
    balances.usd = 2;

    reserveBalances.eth = 0;
    reserveBalances.usd = 0;

    market.updateBalances(askPlaced, balances, reserveBalances);
    expect(balances).toBeDefined();
    expect(balances.eth).toEqual(1);
    expect(reserveBalances.eth).toEqual(1);

    balances.eth = 2;
    balances.usd = 2;

    reserveBalances.eth = 0;
    reserveBalances.usd = 1;

    market.updateBalances(bidFilled, balances, reserveBalances);
    expect(balances).toBeDefined();
    expect(balances.eth).toEqual(3);
    expect(reserveBalances.usd).toEqual(0);

    balances.eth = 2;
    balances.usd = 2;

    reserveBalances.eth = 1;
    reserveBalances.usd = 1;

    market.updateBalances(askFilled, balances, reserveBalances);
    expect(balances).toBeDefined();
    expect(balances.usd).toEqual(3);
    expect(reserveBalances.eth).toEqual(0);

    balances.eth = 2;
    balances.usd = 2;

    reserveBalances.eth = 1;
    reserveBalances.usd = 1;

    market.updateBalances(bidCanceled, balances, reserveBalances);
    expect(balances).toBeDefined();
    expect(balances.usd).toEqual(3);
    expect(reserveBalances.usd).toEqual(0);

    balances.eth = 2;
    balances.usd = 2;

    reserveBalances.eth = 1;
    reserveBalances.usd = 1;

    market.updateBalances(askCanceled, balances, reserveBalances);

    expect(balances).toBeDefined();
    expect(balances.eth).toEqual(3);
    expect(reserveBalances.eth).toEqual(0);
  });
});
describe('function createOrder()', () => {
  test('if function will create bid and ask orders', async () => {
    const balances = {
      eth: 10,
      usd: 20000,
    };
    const reserveBalances = {
      eth: 0,
      usd: 0,
    };
    const pendingOrders: Order[] = [];
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
    const lastPriceEth: any = await api.getLastPrice();

    await market.createOrder(
      bestBid,
      bestAsk,
      lastPriceEth[6],
      balances,
      reserveBalances,
      OrderTypes.BID,
      OrderStates.PLACED,
      pendingOrders,
    );

    expect(balances.usd).toBeLessThan(20000);
    expect(reserveBalances.usd).toBeGreaterThan(0);
    expect(pendingOrders).toBeDefined();
    expect(pendingOrders.length).toEqual(1);

    await market.createOrder(
      bestBid,
      bestAsk,
      lastPriceEth[6],
      balances,
      reserveBalances,
      OrderTypes.ASK,
      OrderStates.PLACED,
      pendingOrders,
    );

    expect(balances.eth).toBeLessThan(20);
    expect(reserveBalances.eth).toBeGreaterThan(0);
    expect(pendingOrders.length).toEqual(2);
  });
});

describe('function createOrders()', () => {
  test('if function will create bid and ask orders', async () => {
    const balances = {
      eth: 10,
      usd: 20000,
    };
    const reserveBalances = {
      eth: 0,
      usd: 0,
    };
    const pendingOrders: Order[] = [];
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
      reserveBalances,
      pendingOrders,
    );
    let bids: number = 0;
    let asks: number = 0;
    for (const order of pendingOrders) {
      order.getType() === OrderTypes.BID ? bids++ : asks++;
    }
    expect(bids).toEqual(5);
    expect(asks).toEqual(5);
  });
});
describe('function fillOrders()', () => {
  test('if fill / cancel orders properly', async () => {
    const pendingOrders: Order[] = [];
    const filledOrders: Order[] = [];

    const balances = {
      eth: 10,
      usd: 20000,
    };
    const reserveBalances = {
      eth: 0,
      usd: 0,
    };
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
    const lastPriceEth: any = await api.getLastPrice();
    //order.getPrice() > bestBid.getPrice()
    await market.createOrder(
      bestBid,
      bestAsk,
      lastPriceEth[6],
      balances,
      reserveBalances,
      OrderTypes.BID,
      OrderStates.PLACED,
      pendingOrders,
    );
    await market.createOrder(
      bestBid,
      bestAsk,
      lastPriceEth[6],
      balances,
      reserveBalances,
      OrderTypes.BID,
      OrderStates.PLACED,
      pendingOrders,
    );

    await market.fillOrders(
      bestBid,
      bestBid,
      pendingOrders,
      filledOrders,
      balances,
      reserveBalances,
    );
    await market.createOrder(
      bestBid,
      bestAsk,
      lastPriceEth[6],
      balances,
      reserveBalances,
      OrderTypes.ASK,
      OrderStates.PLACED,
      pendingOrders,
    );

    expect(filledOrders.length).toBeGreaterThanOrEqual(0);
  });
});
describe('if function will cancel not filled orders', () => {
  test('will cancel not !filled orders properly', async () => {
    const pendingOrders: Order[] = [];
    const filledOrders: Order[] = [];

    const balances = {
      eth: 10,
      usd: 20000,
    };
    const reserveBalances = {
      eth: 0,
      usd: 0,
    };
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
    const lastPriceEth: any = await api.getLastPrice();
    //order.getPrice() > bestBid.getPrice()
    await market.createOrder(
      bestBid,
      bestAsk,
      lastPriceEth[6],
      balances,
      reserveBalances,
      OrderTypes.BID,
      OrderStates.PLACED,
      pendingOrders,
    );
    await market.createOrder(
      bestBid,
      bestAsk,
      lastPriceEth[6],
      balances,
      reserveBalances,
      OrderTypes.BID,
      OrderStates.PLACED,
      pendingOrders,
    );

    await market.fillOrders(
      bestBid,
      bestBid,
      pendingOrders,
      filledOrders,
      balances,
      reserveBalances,
    );

    expect(pendingOrders.length).toEqual(0);
  });
});
