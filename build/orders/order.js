"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var Order = /** @class */ (function () {
    function Order(price, amount, id, type, state) {
        if (id === void 0) { id = 0; }
        if (state === void 0) { state = 4 /* UNDEFINED */; }
        this.price = price;
        this.amount = amount;
        this.id = id;
        this.type = type;
        this.state = state;
    }
    Order.prototype.getPrice = function () {
        return this.price;
    };
    Order.prototype.setPrice = function (price) {
        this.price = price;
    };
    Order.prototype.getAmount = function () {
        return this.amount;
    };
    Order.prototype.setAmount = function (amount) {
        this.amount = amount;
    };
    Order.prototype.getId = function () {
        return this.id;
    };
    Order.prototype.setId = function (id) {
        this.id = id;
    };
    Order.prototype.getType = function () {
        return this.type;
    };
    Order.prototype.setType = function (type) {
        this.type = type;
    };
    Order.prototype.getState = function () {
        return this.state;
    };
    Order.prototype.setState = function (state) {
        this.state = state;
    };
    return Order;
}());
exports.Order = Order;
