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
                    case 2: return [4 /*yield*/, driver.navBack()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it("should find an element by text", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var terStegenPlayer, masipPlayer, _a, _b, _c, _d, _e, isDisplayMessageCorrect;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, driver.findElementByText("A. Iniesta")];
                case 1:
                    terStegenPlayer = _f.sent();
                    _b = (_a = driver).scrollToElement;
                    _c = [0 /* down */,
                        function () { return driver.findElementByText("Masip", 1 /* contains */); }];
                    return [4 /*yield*/, terStegenPlayer.location()];
                case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_f.sent(),
                        400]))];
                case 3:
                    masipPlayer = _f.sent();
                    _e = (_d = console).log;
                    return [4 /*yield*/, masipPlayer.isDisplayed()];
                case 4:
                    _e.apply(_d, [_f.sent()]);
                    return [4 /*yield*/, masipPlayer.tap()];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, driver.compareScreen("massipPlayerDetails.png", 10, 0.2)];
                case 6:
                    isDisplayMessageCorrect = _f.sent();
                    chai_1.assert.isTrue(isDisplayMessageCorrect, "Look at massipPlayerDetails.png");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should find an element by type", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var mascherano, terStegen, terStegenPlayer, _a, _b, _c, label, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, driver.findElementByText("Jordi Alba")];
                case 1:
                    mascherano = _f.sent();
                    terStegen = "Ter Stegen";
                    _b = (_a = driver).scrollToElement;
                    _c = [1 /* up */,
                        function () { return driver.findElementByText(terStegen); }];
                    return [4 /*yield*/, mascherano.location()];
                case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_f.sent(),
                        400]))];
                case 3:
                    terStegenPlayer = _f.sent();
                    return [4 /*yield*/, terStegenPlayer.tap()];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, driver.findElementByText(terStegen)];
                case 5:
                    label = _f.sent();
                    _e = (_d = chai_1.assert).isTrue;
                    return [4 /*yield*/, label.isDisplayed()];
                case 6:
                    _e.apply(_d, [_f.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=sample-test.e2e.js.map