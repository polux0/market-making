import { Order } from '../order/order';
import { OrderTypes } from '../order/ordertypes';
import { OrderStates } from '../order/orderstates';
import { getLastPrice } from '../external';
import { logOrderState } from '../logs/index';
import {
  getRandomNumberArbitrary,
  getRandomId,
  isEven,
  isArrayEmpty,
} from '../utils';

export const updateBalances = async (
  order: Order,
  balances: any,
  reservedBalances: any,
) => {
  // placed order - BID;
  if (
    order.getType() === OrderTypes.BID &&
    order.getState() === OrderStates.PLACED
  ) {
    const orderTotalUSD = order.getPrice() * order.getAmount();
    balances.usd -= orderTotalUSD;
    reservedBalances.usd += orderTotalUSD;
  }
  // placed order - ASK;
  if (
    order.getType() === OrderTypes.ASK &&
    order.getState() === OrderStates.PLACED
  ) {
    balances.eth -= order.getAmount();
    reservedBalances.eth += order.getAmount();
  }
  // filled order - BID;
  if (
    order.getType() === OrderTypes.BID &&
    order.getState() === OrderStates.FILLED
  ) {
    const orderTotalUSD = order.getPrice() * order.getAmount();
    reservedBalances.usd -= orderTotalUSD;
    balances.eth += order.getAmount();
  }
  // filled order - ASK;
  if (
    order.getType() === OrderTypes.ASK &&
    order.getState() === OrderStates.FILLED
  ) {
    balances.usd += order.getAmount() * order.getPrice();
    reservedBalances.eth -= order.getAmount();
  }
  // canceled order - BID;
  if (
    order.getType() === OrderTypes.BID &&
    order.getState() === OrderStates.TO_BE_CANCELED
  ) {
    const orderTotalUSD = order.getPrice() * order.getAmount();
    balances.usd += orderTotalUSD;
    reservedBalances.usd -= orderTotalUSD;
  }
  // canceled order - ASK;
  if (
    order.getType() === OrderTypes.ASK &&
    order.getState() === OrderStates.TO_BE_CANCELED
  ) {
    balances.eth += order.getAmount();
    reservedBalances.eth -= order.getAmount();
  }
};
export const createOrder = async (
  bestBid: Order,
  bestAsk: Order,
  lastPriceEth: number,
  balances: any,
  reserveBalances: any,
  type: OrderTypes,
  state: OrderStates,
  pendingOrders: Order[],
) => {
  const minimumPrice: number =
    type === OrderTypes.BID
      ? bestBid.getPrice() - bestBid.getPrice() / 20
      : bestAsk.getPrice() - bestAsk.getPrice() / 20;
  const price: number = getRandomNumberArbitrary(
    minimumPrice,
    type === OrderTypes.BID ? bestBid.getPrice() : bestAsk.getPrice(),
  );
  const minimumSize: number =
    type === OrderTypes.BID
      ? balances.usd / 100 / lastPriceEth
      : balances.eth / 100;
  const maximumSize: number =
    type === OrderTypes.BID
      ? balances.usd / 50 / lastPriceEth
      : balances.eth / 50;
  const amount: number = getRandomNumberArbitrary(minimumSize, maximumSize);
  const orderTotal: number = type === OrderTypes.BID ? price * amount : amount;
  const enoughBalance: any =
    type === OrderTypes.BID
      ? balances.usd > orderTotal
      : balances.eth > orderTotal;

  if (enoughBalance) {
    const order: Order = new Order(price, amount, getRandomId(), type, state);
    await updateBalances(order, balances, reserveBalances);
    pendingOrders.push(order);
    logOrderState(order);
  } else {
    console.log(
      `${
        type === OrderTypes.BID ? 'BID' : 'ASK'
      } COULD NOT BE PLACED - THERE IS NOT ENOUGH ${
        type === OrderTypes.BID ? 'USD' : 'ETH'
      } BALANCE`,
    );
  }
};
export const cancelOrder = (
  orderId: number,
  historicalOrders: number[],
  pendingOrders: Order[],
) => {
  const index = pendingOrders.findIndex(
    (order: Order) => order.getId() === orderId,
  );
  historicalOrders.push(index);
};
export const cancelOrders = async (pendingOrders: Order[]) => {
  pendingOrders.splice(0, pendingOrders.length);
};
export const createOrders = async (
  bestBid: Order,
  bestAsk: Order,
  balances: any,
  reservedBalances: any,
  pendingOrders: Order[],
) => {
  const lastPriceEth: any = await getLastPrice();
  if (Object.keys(bestBid).length !== 0 && Object.keys(bestAsk).length !== 0) {
    // number of orders should be configurable in order to fulfill strategy requirements;
    for (let i = 0; i < 10; i++) {
      const orderType = isEven(i) ? OrderTypes.BID : OrderTypes.ASK;
      createOrder(
        bestBid,
        bestAsk,
        lastPriceEth[6],
        balances,
        reservedBalances,
        orderType,
        OrderStates.PLACED,
        pendingOrders,
      );
    }
  }
};
export const fillOrders = async (
  bestBid: Order,
  bestAsk: Order,
  pendingOrders: Order[],
  filledOrders: Order[],
  balances: any,
  reservedBalances: any,
) => {
  if (
    !isArrayEmpty(pendingOrders) &&
    Object.keys(bestBid).length !== 0 &&
    Object.keys(bestAsk).length !== 0
  ) {
    const cancellationOrders: number[] = [];
    for (const order of pendingOrders) {
      const orderFilled: any =
        order.getType() === OrderTypes.BID
          ? order.getPrice() > bestBid.getPrice()
          : order.getPrice() < bestAsk.getPrice();
      if (orderFilled) {
        order.setState(OrderStates.FILLED);
        await updateBalances(order, balances, reservedBalances);
        filledOrders.push(order);
        logOrderState(order);
      } else {
        order.setState(OrderStates.TO_BE_CANCELED);
        await updateBalances(order, balances, reservedBalances);
        cancelOrder(order.getId(), cancellationOrders, pendingOrders);
      }
    }
    cancelOrders(pendingOrders);
  }
};
