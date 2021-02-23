import { Order } from '../order/order';

export const getRandomNumberArbitrary = (minimum: number, maximum: number) => {
  return Math.random() * (maximum - minimum) + minimum;
};

export const getRandomId = () => {
  return Math.round(
    Math.random() * (Number.MAX_SAFE_INTEGER - Number.MIN_SAFE_INTEGER) +
      Number.MIN_SAFE_INTEGER,
  );
};
export const isEven = (number: number) => {
  return number % 2 === 0;
};
export const isArrayEmpty = (orders: Order[]) => {
  if (Array.isArray(orders) && !orders.length) {
    return true;
  } else return false;
};
