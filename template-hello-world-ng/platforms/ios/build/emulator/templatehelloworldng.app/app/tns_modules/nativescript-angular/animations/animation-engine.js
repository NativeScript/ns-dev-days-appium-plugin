Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("@angular/animations/browser");
var transition_animation_engine_1 = require("./transition-animation-engine");
var NativeScriptAnimationEngine = (function (_super) {
    __extends(NativeScriptAnimationEngine, _super);
    function NativeScriptAnimationEngine(driver, normalizer) {
        var _this = _super.call(this, driver, normalizer) || this;
        _this._transitionEngine = new transition_animation_engine_1.NSTransitionAnimationEngine(driver, normalizer);
        _this._transitionEngine.onRemovalComplete = function (element, delegate) {
            var parent = delegate && delegate.parentNode(element);
            if (parent) {
                delegate.removeChild(parent, element);
            }
        };
        return _this;
    }
    return NativeScriptAnimationEngine;
}(browser_1.ɵAnimationEngine));
exports.NativeScriptAnimationEngine = NativeScriptAnimationEngine;
//# sourceMappingURL=animation-engine.js.map