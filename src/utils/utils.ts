import { Order } from '../orders/order';
import { OrderTypes } from '../orders/ordertypes';
import { OrderStates } from '../orders/orderstates';
import { getLastPrice } from './market';

export const getRandomNumberArbitrary = (minimum: number, maximum: number) => {
  return Math.random() * (maximum - minimum) + minimum;
};

export const isEven = (number: number) => {
  return number % 2 === 0;
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
    const order: Order = new Order(
      price,
      amount,
      getRandomNumberArbitrary(0, 100),
      type,
      state,
    );
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
export const createOrders = async (
  bestBid: Order,
  bestAsk: Order,
  balances: any,
  reservedBalances: any,
  pendingOrders: Order[],
) => {
  console.log('pendingOrders should be empty here: ' + pendingOrders.length);
  const lastPriceEth: any = await getLastPrice();
  if(Object.keys(bestBid).length !== 0 && Object.keys(bestAsk).length !== 0){
        // number of orders should be configurable in order to fulfill strategy requirements;
  // was before
  //  for (let i = 0; i < 5; i++) {
  //   const orderType = isEven(i) ? OrderTypes.BID : OrderTypes.ASK;
  //   createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, orderType, OrderStates.PLACED, pendingOrders);
  // }
  // createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.BID, OrderStates.PLACED, pendingOrders);
  //await createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
  await createOrder(
    bestBid,
    bestAsk,
    lastPriceEth[6],
    balances,
    reservedBalances,
    OrderTypes.BID,
    OrderStates.PLACED,
    pendingOrders,
  );
  // await createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
  await createOrder(
    bestBid,
    bestAsk,
    lastPriceEth[6],
    balances,
    reservedBalances,
    OrderTypes.BID,
    OrderStates.PLACED,
    pendingOrders,
  );
  //  createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
  //  createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.BID, OrderStates.PLACED, pendingOrders);
  //  createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
  //  createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.BID, OrderStates.PLACED, pendingOrders);
  //  createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
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
  if (!isArrayEmpty(pendingOrders) && Object.keys(bestBid).length !== 0 && Object.keys(bestAsk).length !== 0) {
    pendingOrders.forEach(async (order: Order, index: number) => {
      const orderFilled: any =
        order.getType() === OrderTypes.BID
          ? order.getPrice() > bestBid.getPrice()
          : order.getPrice() < bestAsk.getPrice();
      // if(order.getType() === OrderTypes.BID){
      //   // should set minimum as best bid, maximum as best bid + bestBid/20;
      //   // console.log('order price: ' + order.getPrice());
      //   // console.log('best bid: ' + bestBid.getPrice());
      //
      if (orderFilled) {
        order.setState(OrderStates.FILLED);
        await updateBalances(order, balances, reservedBalances);
        await cancelOrder(order, pendingOrders);
        filledOrders.push(order);
        logOrderState(order);
      } else {
        console.log('requested for clearing: ');
        console.log(JSON.stringify(order, null, 2));
        order.setState(OrderStates.TO_BE_CANCELED);
        await updateBalances(order, balances, reservedBalances);
        await cancelOrder(order, pendingOrders);
      }
    });

    // cancel !filled orders;
    //await cancelOrders(pendingOrders, balances, reservedBalances);
  }
};
export const cancelOrder = async (ourOrder: Order, pendingOrders: Order[]) => {
  console.log('cancelOrder is called');
  console.log('requested for clearing from cancel order: ' + ourOrder.getId());
  console.log(
    'length of pending orders before searching for index: ',
    pendingOrders.length,
  );

  const index: any = pendingOrders.map((order: Order, index: number) => {
    // console.log(JSON.stringify(order, null, 2), 'index: ', index);
    if (ourOrder.getId() == order.getId()) {
      return index;
    }
  });
  // const index = pendingOrders.findIndex((order: Order) => order.getPrice() == ourOrder.getPrice());
  // const index = pendingOrders.indexOf(ourOrder);
  if (index) {
    console.log('index found: ', index);
    pendingOrders.splice(index[0], 1);
    console.log(
      'length of pending orders after searching for index: ',
      pendingOrders.length,
    );
  } else {
    console.log('not found');
  }
};
export const cancelOrders = async (
  pendingOrders: Order[],
  balances: any,
  reservedBalances: any,
) => {
  for (let index = 0; index < pendingOrders.length; index++) {
    cancelOrder(pendingOrders[index], pendingOrders);
  }
};
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

export const logAssetBalances = (balances: any, reserveBalances: any) => {
  console.log('Balances: \n eth: ' + balances.eth + 'usd: ' + balances.usd);
  console.log(
    'Reserved balances ( in orders ): \n eth:' +
      reserveBalances.eth +
      'usd: ' +
      reserveBalances.usd,
  );
};

export const logOrderState = (order: Order) => {
  if (order.getState() === OrderStates.PLACED) {
    console.log(
      `PLACED ${
        order.getType() === OrderTypes.BID ? OrderTypes.BID : OrderTypes.ASK
      } @ PRICE: ${order.getPrice()} AMOUNT:  ${
        order.getType() === OrderTypes.BID
          ? order.getAmount()
          : -Math.abs(order.getAmount())
      } 
        `,
    );
  }
  if (order.getState() === OrderStates.FILLED) {
    console.log(
      `FILLED ${
        order.getType() === OrderTypes.BID ? OrderTypes.BID : OrderTypes.ASK
      } @ PRICE: ${order.getPrice()} AMOUNT:  ${
        order.getType() === OrderTypes.BID
          ? order.getAmount()
          : -Math.abs(order.getAmount())
      } 
        (ETH ${
          order.getType() === OrderTypes.BID ? ' + ' : ' - '
        } ${order.getAmount()}  
         USD ${
           order.getType() === OrderTypes.BID ? ' - ' : ' + '
         } ${order.getAmount() * order.getPrice()} 
        `,
    );

    // was before;
    // console.log(
    //   `FILLED ${order.getType() === OrderTypes.BID ? OrderTypes.BID: OrderTypes.ASK} @ PRICE:
    //   ${order.getPrice()}
    //    AMOUNT:
    //   ${order.getType() === OrderTypes.BID ? order.getAmount(): -Math.abs(order.getAmount())}
    //   (ETH ${order.getType() === OrderTypes.BID ?  " + " : " - " } ${order.getAmount()}
    //    USD ${order.getType() === OrderTypes.BID ?  " - " : " + " } ${order.getAmount() * order.getPrice()}
    //   `);
  }
};
export const isArrayEmpty = (orders: Order[]) => {
  if (Array.isArray(orders) && !orders.length) {
    return true;
  } else return false;
};
