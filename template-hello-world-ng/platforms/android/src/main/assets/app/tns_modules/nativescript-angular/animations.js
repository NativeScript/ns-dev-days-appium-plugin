Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var browser_1 = require("@angular/animations/browser");
var animations_2 = require("@angular/platform-browser/animations");
var animation_engine_1 = require("./animations/animation-engine");
var animation_driver_1 = require("./animations/animation-driver");
var nativescript_module_1 = require("./nativescript.module");
var renderer_1 = require("./renderer");
var InjectableAnimationEngine = (function (_super) {
    __extends(InjectableAnimationEngine, _super);
    function InjectableAnimationEngine(driver, normalizer) {
        return _super.call(this, driver, normalizer) || this;
    }
    InjectableAnimationEngine = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [browser_1.AnimationDriver, browser_1.ɵAnimationStyleNormalizer])
    ], InjectableAnimationEngine);
    return InjectableAnimationEngine;
}(animation_engine_1.NativeScriptAnimationEngine));
exports.InjectableAnimationEngine = InjectableAnimationEngine;
function instantiateSupportedAnimationDriver() {
    return new animation_driver_1.NativeScriptAnimationDriver();
}
exports.instantiateSupportedAnimationDriver = instantiateSupportedAnimationDriver;
function instantiateRendererFactory(renderer, engine, zone) {
    return new animations_2.ɵAnimationRendererFactory(renderer, engine, zone);
}
exports.instantiateRendererFactory = instantiateRendererFactory;
function instantiateDefaultStyleNormalizer() {
    return new browser_1.ɵWebAnimationsStyleNormalizer();
}
exports.instantiateDefaultStyleNormalizer = instantiateDefaultStyleNormalizer;
exports.NATIVESCRIPT_ANIMATIONS_PROVIDERS = [
    { provide: animations_1.AnimationBuilder, useClass: animations_2.ɵBrowserAnimationBuilder },
    { provide: browser_1.AnimationDriver, useFactory: instantiateSupportedAnimationDriver },
    { provide: browser_1.ɵAnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer },
    { provide: animation_engine_1.NativeScriptAnimationEngine, useClass: InjectableAnimationEngine },
    {
        provide: core_1.RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [renderer_1.NativeScriptRendererFactory, animation_engine_1.NativeScriptAnimationEngine, core_1.NgZone]
    }
];
var NativeScriptAnimationsModule = (function () {
    function NativeScriptAnimationsModule() {
    }
    NativeScriptAnimationsModule = __decorate([
        core_1.NgModule({
            imports: [nativescript_module_1.NativeScriptModule],
            providers: exports.NATIVESCRIPT_ANIMATIONS_PROVIDERS,
        })
    ], NativeScriptAnimationsModule);
    return NativeScriptAnimationsModule;
}());
exports.NativeScriptAnimationsModule = NativeScriptAnimationsModule;
//# sourceMappingURL=animations.js.map