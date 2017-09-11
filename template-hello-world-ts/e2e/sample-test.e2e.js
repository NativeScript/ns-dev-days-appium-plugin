"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var nativescript_dev_appium_1 = require("nativescript-dev-appium");
var chai_1 = require("chai");
describe("scenario simple", function () {
    var defaultWaitTime = 5000;
    var driver;
    before(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nativescript_dev_appium_1.createDriver()];
                case 1:
                    driver = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, driver.quit()];
                case 1:
                    _a.sent();
                    console.log("Driver quits!");
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.currentTest.state === "failed")) return [3 /*break*/, 2];
                        return [4 /*yield*/, driver.logScreenshoot(this.currentTest.title)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    });
    it("should find an element by text", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var tapButton, displayMsg, messageLabel, _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, driver.findElementByText("TAP")];
                case 1:
                    tapButton = _d.sent();
                    return [4 /*yield*/, tapButton.click()];
                case 2:
                    _d.sent();
                    displayMsg = "41 taps left";
                    return [4 /*yield*/, driver.findElementByText(displayMsg, 1 /* contains */)];
                case 3:
                    messageLabel = _d.sent();
                    _b = (_a = chai_1.assert).equal;
                    return [4 /*yield*/, messageLabel.text()];
                case 4:
                    _b.apply(_a, [_d.sent(), displayMsg, "You have a problem. Probably the binding is not working!"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should find an element by type", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var tapButton, messageLabel, isDisplayMessageCorrect;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, driver.findElementsByClassName("button")];
                case 1:
                    tapButton = (_a.sent())[0];
                    return [4 /*yield*/, tapButton.tap()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.findElementByText("40 taps left", 1 /* contains */)];
                case 3:
                    messageLabel = _a.sent();
                    return [4 /*yield*/, driver.compareScreen("hello-world-display.png", 10, 1.0)];
                case 4:
                    isDisplayMessageCorrect = _a.sent();
                    chai_1.assert.isTrue(isDisplayMessageCorrect, "Look at hello-world-display-diif.png");
                    return [2 /*return*/];
            }
        });
    }); });
});
