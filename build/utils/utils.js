"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayEmpty = exports.logOrderState = exports.logAssetBalances = exports.isEven = exports.getRandomNumberArbitrary = exports.updateBalances = exports.cancelOrders = exports.cancelOrder = exports.fillOrders = exports.createOrders = exports.createOrder = void 0;
var order_1 = require("../orders/order");
var market_1 = require("./market");
exports.createOrder = function (bestBid, bestAsk, lastPriceEth, balances, reserveBalances, type, state, pendingOrders) { return __awaiter(void 0, void 0, void 0, function () {
    var minimumPrice, price, minimumSize, maximumSize, amount, orderTotal, enoughBalance, order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                minimumPrice = type === 0 /* BID */ ? bestBid.getPrice() - bestBid.getPrice() / 20 : bestAsk.getPrice() - bestAsk.getPrice() / 20;
                price = exports.getRandomNumberArbitrary(minimumPrice, type === 0 /* BID */ ? bestBid.getPrice() : bestAsk.getPrice());
                minimumSize = type === 0 /* BID */ ? balances.usd / 100 / lastPriceEth : balances.eth / 100;
                maximumSize = type === 0 /* BID */ ? balances.usd / 50 / lastPriceEth : balances.eth / 50;
                amount = exports.getRandomNumberArbitrary(minimumSize, maximumSize);
                orderTotal = type === 0 /* BID */ ? price * amount : amount;
                enoughBalance = type === 0 /* BID */ ? (balances.usd > orderTotal) : (balances.eth > orderTotal);
                if (!enoughBalance) return [3 /*break*/, 2];
                order = new order_1.Order(price, amount, exports.getRandomNumberArbitrary(0, 100), type, state);
                return [4 /*yield*/, exports.updateBalances(order, balances, reserveBalances)];
            case 1:
                _a.sent();
                pendingOrders.push(order);
                exports.logOrderState(order);
                return [3 /*break*/, 3];
            case 2:
                console.log((type === 0 /* BID */ ? "BID" : "ASK") + " COULD NOT BE PLACED - THERE IS NOT ENOUGH " + (type === 0 /* BID */ ? "USD" : "ETH") + " BALANCE");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createOrders = function (bestBid, bestAsk, balances, reservedBalances, pendingOrders) { return __awaiter(void 0, void 0, void 0, function () {
    var lastPriceEth;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('pendingOrders should be empty here: ' + pendingOrders.length);
                return [4 /*yield*/, market_1.getLastPrice()];
            case 1:
                lastPriceEth = _a.sent();
                // number of orders should be configurable in order to fulfill strategy requirements;
                // was before
                //  for (let i = 0; i < 5; i++) {
                //   const orderType = isEven(i) ? OrderTypes.BID : OrderTypes.ASK;
                //   createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, orderType, OrderStates.PLACED, pendingOrders);
                // }
                // createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.BID, OrderStates.PLACED, pendingOrders);
                //await createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
                return [4 /*yield*/, exports.createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, 0 /* BID */, 0 /* PLACED */, pendingOrders)];
            case 2:
                // number of orders should be configurable in order to fulfill strategy requirements;
                // was before
                //  for (let i = 0; i < 5; i++) {
                //   const orderType = isEven(i) ? OrderTypes.BID : OrderTypes.ASK;
                //   createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, orderType, OrderStates.PLACED, pendingOrders);
                // }
                // createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.BID, OrderStates.PLACED, pendingOrders);
                //await createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
                _a.sent();
                // await createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
                return [4 /*yield*/, exports.createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, 0 /* BID */, 0 /* PLACED */, pendingOrders)];
            case 3:
                // await createOrder(bestBid, bestAsk, lastPriceEth[6], balances, reservedBalances, OrderTypes.ASK, OrderStates.PLACED, pendingOrders);
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.fillOrders = function (bestBid, bestAsk, pendingOrders, filledOrders, balances, reservedBalances) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!exports.isArrayEmpty(pendingOrders)) {
            pendingOrders.forEach(function (order, index) { return __awaiter(void 0, void 0, void 0, function () {
                var orderFilled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            orderFilled = order.getType() === 0 /* BID */ ? order.getPrice() > bestBid.getPrice() : order.getPrice() < bestAsk.getPrice();
                            if (!orderFilled) return [3 /*break*/, 3];
                            order.setState(1 /* FILLED */);
                            return [4 /*yield*/, exports.updateBalances(order, balances, reservedBalances)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, exports.cancelOrder(order, pendingOrders)];
                        case 2:
                            _a.sent();
                            filledOrders.push(order);
                            exports.logOrderState(order);
                            return [3 /*break*/, 6];
                        case 3:
                            console.log('requested for clearing: ');
                            console.log(JSON.stringify(order, null, 2));
                            order.setState(2 /* TO_BE_CANCELED */);
                            return [4 /*yield*/, exports.updateBalances(order, balances, reservedBalances)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, exports.cancelOrder(order, pendingOrders)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            // cancel !filled orders;
            //await cancelOrders(pendingOrders, balances, reservedBalances);
        }
        return [2 /*return*/];
    });
}); };
exports.cancelOrder = function (ourOrder, pendingOrders) { return __awaiter(void 0, void 0, void 0, function () {
    var index;
    return __generator(this, function (_a) {
        console.log('cancelOrder is called');
        console.log('requested for clearing from cancel order: ' + ourOrder.getId());
        console.log('length of pending orders before searching for index: ', pendingOrders.length);
        index = pendingOrders.map(function (order, index) {
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
            console.log('length of pending orders after searching for index: ', pendingOrders.length);
        }
        else {
            console.log('not found');
        }
        return [2 /*return*/];
    });
}); };
exports.cancelOrders = function (pendingOrders, balances, reservedBalances) { return __awaiter(void 0, void 0, void 0, function () {
    var index;
    return __generator(this, function (_a) {
        for (index = 0; index < pendingOrders.length; index++) {
            exports.cancelOrder(pendingOrders[index], pendingOrders);
        }
        return [2 /*return*/];
    });
}); };
exports.updateBalances = function (order, balances, reservedBalances) { return __awaiter(void 0, void 0, void 0, function () {
    var orderTotalUSD, orderTotalUSD, orderTotalUSD;
    return __generator(this, function (_a) {
        // placed order - BID;
        if (order.getType() === 0 /* BID */ && order.getState() === 0 /* PLACED */) {
            orderTotalUSD = order.getPrice() * order.getAmount();
            balances.usd -= orderTotalUSD;
            reservedBalances.usd += orderTotalUSD;
        }
        // placed order - ASK;
        if (order.getType() === 1 /* ASK */ && order.getState() === 0 /* PLACED */) {
            balances.eth -= order.getAmount();
            reservedBalances.eth += order.getAmount();
        }
        // filled order - BID;
        if (order.getType() === 0 /* BID */ && order.getState() === 1 /* FILLED */) {
            orderTotalUSD = order.getPrice() * order.getAmount();
            reservedBalances.usd -= orderTotalUSD;
            balances.eth += order.getAmount();
        }
        // filled order - ASK;
        if (order.getType() === 1 /* ASK */ && order.getState() === 1 /* FILLED */) {
            balances.usd += order.getAmount() * order.getPrice();
            reservedBalances.eth -= order.getAmount();
        }
        // canceled order - BID;
        if (order.getType() === 0 /* BID */ && order.getState() === 2 /* TO_BE_CANCELED */) {
            orderTotalUSD = order.getPrice() * order.getAmount();
            balances.usd += orderTotalUSD;
            reservedBalances.usd -= orderTotalUSD;
        }
        // canceled order - ASK;
        if (order.getType() === 1 /* ASK */ && order.getState() === 2 /* TO_BE_CANCELED */) {
            balances.eth += order.getAmount();
            reservedBalances.eth -= order.getAmount();
        }
        return [2 /*return*/];
    });
}); };
exports.getRandomNumberArbitrary = function (minimum, maximum) {
    return Math.random() * (maximum - minimum) + minimum;
};
exports.isEven = function (number) {
    return number % 2 === 0;
};
exports.logAssetBalances = function (balances, reserveBalances) {
    console.log('Balances: \n eth: ' + balances.eth + 'usd: ' + balances.usd);
    console.log('Reserved balances ( in orders ): \n eth:' + reserveBalances.eth + 'usd: ' + reserveBalances.usd);
};
exports.logOrderState = function (order) {
    if (order.getState() === 0 /* PLACED */) {
        console.log("PLACED " + (order.getType() === 0 /* BID */ ? 0 /* BID */ : 1 /* ASK */) + " @ PRICE: " + order.getPrice() + " AMOUNT:  " + (order.getType() === 0 /* BID */ ? order.getAmount() : -Math.abs(order.getAmount())) + " \n        ");
    }
    if (order.getState() === 1 /* FILLED */) {
        console.log("FILLED " + (order.getType() === 0 /* BID */ ? 0 /* BID */ : 1 /* ASK */) + " @ PRICE: " + order.getPrice() + " AMOUNT:  " + (order.getType() === 0 /* BID */ ? order.getAmount() : -Math.abs(order.getAmount())) + " \n        (ETH " + (order.getType() === 0 /* BID */ ? " + " : " - ") + " " + order.getAmount() + "  \n         USD " + (order.getType() === 0 /* BID */ ? " - " : " + ") + " " + order.getAmount() * order.getPrice() + " \n        ");
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
exports.isArrayEmpty = function (orders) {
    if (Array.isArray(orders) && !orders.length) {
        return true;
    }
    else
        return false;
};
