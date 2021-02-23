import { getOrders, getLastPrice } from './index';

describe('function getOrders()', () => {
  test('getOrders', async () => {
    const state = await getOrders();
    expect(state).toBeDefined();
    expect(state[0][0]).toBeGreaterThanOrEqual(0);
    expect(state[0][2]).toBeGreaterThanOrEqual(0);
    const askSearch: any = state.find((order: any) => order[2] < 0);
    expect(askSearch).toBeDefined();
    expect(askSearch[0]).toBeGreaterThanOrEqual(0);
    expect(askSearch[1]).toBeGreaterThanOrEqual(0);
    expect(askSearch[2]).toBeLessThan(0);
  });
});
describe('function getLastPrice()', () => {
  test('getLastPrice()', async () => {
    const lastPriceEth: any = await getLastPrice();
    expect(lastPriceEth).toBeDefined();
    expect(lastPriceEth[6]).toBeGreaterThan(0);
  });
});
