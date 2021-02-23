import { OrderStates } from './orderstates';
import { OrderTypes } from './ordertypes';

export class Order {
  private price: number; // Specifies the price level for trading
  private amount: number; // Total amount available at that price level
  private id: number; // Optional ( for purpose of 'Ping pong' strategy - https://docs.hummingbot.io/strategies/ping-pong/)
  private type: OrderTypes;
  private state?: OrderStates;

  constructor(
    price: number,
    amount: number,
    id: number,
    type: OrderTypes,
    state: OrderStates = OrderStates.UNDEFINED,
  ) {
    this.price = price;
    this.amount = amount;
    this.id = id;
    this.type = type;
    this.state = state;
  }
  public getPrice(): number {
    return this.price;
  }

  public setPrice(price: number) {
    this.price = price;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number) {
    this.amount = amount;
  }
  public getId() {
    return this.id;
  }
  public setId(id: number) {
    this.id = id;
  }
  public getType() {
    return this.type;
  }
  public setType(type: OrderTypes) {
    this.type = type;
  }
  public getState() {
    return this.state;
  }
  public setState(state: OrderStates) {
    this.state = state;
  }
}
