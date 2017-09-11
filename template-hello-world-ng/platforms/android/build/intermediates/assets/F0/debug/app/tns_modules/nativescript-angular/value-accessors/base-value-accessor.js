Object.defineProperty(exports, "__esModule", { value: true });
var BaseValueAccessor = (function () {
    function BaseValueAccessor(view) {
        this.view = view;
        this.pendingChangeNotification = 0;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    BaseValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this.onChange = function (arg) {
            if (_this.pendingChangeNotification) {
                clearTimeout(_this.pendingChangeNotification);
            }
            _this.pendingChangeNotification = setTimeout(function () {
                _this.pendingChangeNotification = 0;
                fn(arg);
            }, 20);
        };
    };
    BaseValueAccessor.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    BaseValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this.view.isEnabled = !isDisabled;
    };
    BaseValueAccessor.prototype.writeValue = function (_) { };
    return BaseValueAccessor;
}());
exports.BaseValueAccessor = BaseValueAccessor;
//# sourceMappingURL=base-value-accessor.js.map