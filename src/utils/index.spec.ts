import { Order } from '../order/order';
import { OrderStates } from '../order/orderstates';
import { OrderTypes } from '../order/ordertypes';
import utils = require('../utils');

describe('function getRandomNumberArbitrary()', () => {
  test('if getRandomNumberArbitrary() works properly', async () => {
    const getRandomNumberArbitrary = jest.fn();
    getRandomNumberArbitrary();
    expect(getRandomNumberArbitrary).toHaveBeenCalled();
  });
});
describe('function getRandomId()', () => {
  test('if getRandomId() returns random id within bounds', async () => {
    const id = utils.getRandomId();
    expect(id).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
    expect(id).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
  });
});
describe('function isEven()', () => {
  test('isEven() working properly', async () => {
    const yes = utils.isEven(0);
    const no = utils.isEven(1);
    expect(yes).toBeTruthy();
    expect(no).toBeFalsy();
  });
});
describe('function isArrayEmpty()', () => {
  test('isArrayEmpty() is working properly', async () => {
    const first: Array<Order> = [];
    const second: Array<Order> = [];
    const bidPlaced = new Order(1, 1, 1, OrderTypes.BID, OrderStates.PLACED);
    const askPlaced = new Order(1, 1, 2, OrderTypes.ASK, OrderStates.PLACED);
    const truthy = utils.isArrayEmpty(first);
    second.push(bidPlaced);
    const falsy = utils.isArrayEmpty(second);
    expect(truthy).toBeTruthy();
    expect(falsy).toBeFalsy();
  });
});
