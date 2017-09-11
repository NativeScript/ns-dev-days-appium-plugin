Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("tns-core-modules/ui/frame");
var page_1 = require("tns-core-modules/ui/page");
var core_1 = require("@angular/core");
var platform_1 = require("tns-core-modules/platform");
var platform = require("tns-core-modules/platform");
exports.APP_ROOT_VIEW = new core_1.OpaqueToken("App Root View");
exports.DEVICE = new core_1.OpaqueToken("platfrom device");
exports.PAGE_FACTORY = new core_1.OpaqueToken("page factory");
// Work around a TS bug requiring an import of platform.Device without using it
if (global.___TS_UNUSED) {
    (function () {
        return platform;
    })();
}
var _rootPageRef;
function setRootPage(page) {
    _rootPageRef = new WeakRef(page);
}
exports.setRootPage = setRootPage;
function getRootPage() {
    return _rootPageRef && _rootPageRef.get();
}
exports.getRootPage = getRootPage;
// Use an exported function to make the AoT compiler happy.
function getDefaultPage() {
    var frame = frame_1.topmost();
    return getRootPage() || (frame && frame.currentPage);
}
exports.getDefaultPage = getDefaultPage;
exports.defaultPageProvider = { provide: page_1.Page, useFactory: getDefaultPage };
// Use an exported function to make the AoT compiler happy.
function getDefaultFrame() {
    return frame_1.topmost();
}
exports.getDefaultFrame = getDefaultFrame;
exports.defaultFrameProvider = { provide: frame_1.Frame, useFactory: getDefaultFrame };
// Use an exported function to make the AoT compiler happy.
function getDefaultDevice() {
    return platform_1.device;
}
exports.getDefaultDevice = getDefaultDevice;
exports.defaultDeviceProvider = { provide: exports.DEVICE, useFactory: getDefaultDevice };
exports.defaultPageFactory = function (_opts) {
    return new page_1.Page();
};
exports.defaultPageFactoryProvider = { provide: exports.PAGE_FACTORY, useValue: exports.defaultPageFactory };
//# sourceMappingURL=platform-providers.js.map