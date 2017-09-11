Object.defineProperty(exports, "__esModule", { value: true });
// Initial imports and polyfills
require("tns-core-modules/globals");
// Require application early to work around a circular import
require("tns-core-modules/application");
require("./zone-js/dist/zone-nativescript");
require("reflect-metadata");
require("./polyfills/array");
require("./polyfills/console");
var profiling_1 = require("tns-core-modules/profiling");
var core_1 = require("@angular/core");
// Work around a TS bug requiring an import of OpaqueToken without using it
if (global.___TS_UNUSED) {
    (function () {
        return core_1.OpaqueToken;
    })();
}
var trace_1 = require("./trace");
var platform_providers_1 = require("./platform-providers");
var application_1 = require("tns-core-modules/application");
var frame_1 = require("tns-core-modules/ui/frame");
var page_1 = require("tns-core-modules/ui/page");
var text_view_1 = require("tns-core-modules/ui/text-view");
require("nativescript-intl");
exports.onBeforeLivesync = new core_1.EventEmitter();
exports.onAfterLivesync = new core_1.EventEmitter();
var lastBootstrappedModule;
var NativeScriptSanitizer = (function (_super) {
    __extends(NativeScriptSanitizer, _super);
    function NativeScriptSanitizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeScriptSanitizer.prototype.sanitize = function (_context, value) {
        return value;
    };
    return NativeScriptSanitizer;
}(core_1.Sanitizer));
exports.NativeScriptSanitizer = NativeScriptSanitizer;
exports.COMMON_PROVIDERS = [
    platform_providers_1.defaultPageFactoryProvider,
    { provide: core_1.Sanitizer, useClass: NativeScriptSanitizer },
];
var NativeScriptPlatformRef = (function (_super) {
    __extends(NativeScriptPlatformRef, _super);
    function NativeScriptPlatformRef(platform, appOptions) {
        var _this = _super.call(this) || this;
        _this.platform = platform;
        _this.appOptions = appOptions;
        return _this;
    }
    NativeScriptPlatformRef.prototype.bootstrapModuleFactory = function (moduleFactory) {
        var _this = this;
        this._bootstrapper = function () { return _this.platform.bootstrapModuleFactory(moduleFactory); };
        this.bootstrapApp();
        return null; // Make the compiler happy
    };
    NativeScriptPlatformRef.prototype.bootstrapModule = function (moduleType, compilerOptions) {
        var _this = this;
        if (compilerOptions === void 0) { compilerOptions = []; }
        this._bootstrapper = function () { return _this.platform.bootstrapModule(moduleType, compilerOptions); };
        this.bootstrapApp();
        return null; // Make the compiler happy
    };
    NativeScriptPlatformRef.prototype.bootstrapApp = function () {
        var _this = this;
        global.__onLiveSyncCore = function () { return _this.livesyncModule(); };
        var mainPageEntry = this.createNavigationEntry(this._bootstrapper);
        if (this.appOptions && typeof this.appOptions.cssFile === "string") {
            // TODO: All exported fields in ES6 modules should be read-only
            // Change the case when tns-core-modules become ES6 compatible and there is a legal way to set cssFile
            application_1.setCssFileName(this.appOptions.cssFile);
        }
        application_1.start(mainPageEntry);
    };
    NativeScriptPlatformRef.prototype.livesyncModule = function () {
        trace_1.rendererLog("ANGULAR LiveSync Started");
        exports.onBeforeLivesync.next(lastBootstrappedModule ? lastBootstrappedModule.get() : null);
        var mainPageEntry = this.createNavigationEntry(this._bootstrapper, function (compRef) { return exports.onAfterLivesync.next(compRef); }, function (error) { return exports.onAfterLivesync.error(error); }, true);
        mainPageEntry.animated = false;
        mainPageEntry.clearHistory = true;
        var frame = frame_1.topmost();
        if (frame) {
            if (frame.currentPage && frame.currentPage.modal) {
                frame.currentPage.modal.closeModal();
            }
            frame.navigate(mainPageEntry);
        }
    };
    NativeScriptPlatformRef.prototype.onDestroy = function (callback) {
        this.platform.onDestroy(callback);
    };
    Object.defineProperty(NativeScriptPlatformRef.prototype, "injector", {
        get: function () {
            return this.platform.injector;
        },
        enumerable: true,
        configurable: true
    });
    NativeScriptPlatformRef.prototype.destroy = function () {
        this.platform.destroy();
    };
    Object.defineProperty(NativeScriptPlatformRef.prototype, "destroyed", {
        get: function () {
            return this.platform.destroyed;
        },
        enumerable: true,
        configurable: true
    });
    NativeScriptPlatformRef.prototype.createNavigationEntry = function (bootstrapAction, resolve, reject, isLivesync, isReboot) {
        var _this = this;
        if (isLivesync === void 0) { isLivesync = false; }
        if (isReboot === void 0) { isReboot = false; }
        var pageFactory = this.platform.injector.get(platform_providers_1.PAGE_FACTORY);
        var navEntry = {
            create: function () {
                var page = pageFactory({ isBootstrap: true, isLivesync: isLivesync });
                platform_providers_1.setRootPage(page);
                if (_this.appOptions) {
                    page.actionBarHidden = _this.appOptions.startPageActionBarHidden;
                }
                var initHandlerMethodName = "nativescript-angular/platform-common.initHandler";
                var initHandler = profiling_1.profile(initHandlerMethodName, function () {
                    page.off(page_1.Page.navigatingToEvent, initHandler);
                    // profiling.stop("application-start");
                    trace_1.rendererLog("Page loaded");
                    // profiling.start("ng-bootstrap");
                    trace_1.rendererLog("BOOTSTRAPPING...");
                    var bootstrapMethodName = "nativescript-angular/platform-common.postBootstrapAction";
                    bootstrapAction().then(profiling_1.profile(bootstrapMethodName, function (moduleRef) {
                        // profiling.stop("ng-bootstrap");
                        trace_1.rendererLog("ANGULAR BOOTSTRAP DONE.");
                        lastBootstrappedModule = new WeakRef(moduleRef);
                        if (resolve) {
                            resolve(moduleRef);
                        }
                        return moduleRef;
                    }), function (err) {
                        trace_1.rendererError("ERROR BOOTSTRAPPING ANGULAR");
                        var errorMessage = err.message + "\n\n" + err.stack;
                        trace_1.rendererError(errorMessage);
                        var view = new text_view_1.TextView();
                        view.text = errorMessage;
                        page.content = view;
                        if (reject) {
                            reject(err);
                        }
                    });
                });
                page.on(page_1.Page.navigatingToEvent, initHandler);
                return page;
            }
        };
        if (isReboot) {
            navEntry.animated = false;
            navEntry.clearHistory = true;
        }
        return navEntry;
    };
    NativeScriptPlatformRef.prototype.liveSyncApp = function () {
    };
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [core_1.NgModuleFactory]),
        __metadata("design:returntype", Promise)
    ], NativeScriptPlatformRef.prototype, "bootstrapModuleFactory", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [core_1.Type, Object]),
        __metadata("design:returntype", Promise)
    ], NativeScriptPlatformRef.prototype, "bootstrapModule", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NativeScriptPlatformRef.prototype, "bootstrapApp", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, Function, Function, Boolean, Boolean]),
        __metadata("design:returntype", Object)
    ], NativeScriptPlatformRef.prototype, "createNavigationEntry", null);
    return NativeScriptPlatformRef;
}(core_1.PlatformRef));
exports.NativeScriptPlatformRef = NativeScriptPlatformRef;
//# sourceMappingURL=platform-common.js.map