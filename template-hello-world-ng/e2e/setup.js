"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var nativescript_dev_appium_1 = require("nativescript-dev-appium");
before("start server", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, nativescript_dev_appium_1.startServer()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
after("stop server", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, nativescript_dev_appium_1.stopServer()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=setup.js.map