"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    function HelloWorldModel() {
        var _this = _super.call(this) || this;
        // Initialize default values.
        _this._counter = 42;
        _this.updateMessage();
        return _this;
    }
    Object.defineProperty(HelloWorldModel.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            if (this._message !== value) {
                this._message = value;
                this.notifyPropertyChange('message', value);
            }
        },
        enumerable: true,
        configurable: true
    });
    HelloWorldModel.prototype.onTap = function () {
        this._counter--;
        this.updateMessage();
    };
    HelloWorldModel.prototype.updateMessage = function () {
        if (this._counter <= 0) {
            this.message = 'Hoorraaay! You unlocked the NativeScript clicker achievement!';
        }
        else {
            this.message = this._counter + " taps left";
        }
    };
    return HelloWorldModel;
}(observable_1.Observable));
exports.HelloWorldModel = HelloWorldModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi12aWV3LW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi12aWV3LW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOENBQTJDO0FBRTNDO0lBQXFDLG1DQUFVO0lBSzNDO1FBQUEsWUFDSSxpQkFBTyxTQUtWO1FBSEcsNkJBQTZCO1FBQzdCLEtBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7SUFDekIsQ0FBQztJQUVELHNCQUFJLG9DQUFPO2FBQVg7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QixDQUFDO2FBRUQsVUFBWSxLQUFhO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDL0MsQ0FBQztRQUNMLENBQUM7OztPQVBBO0lBU00sK0JBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLHVDQUFhLEdBQXJCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsK0RBQStELENBQUM7UUFDbkYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLE9BQU8sR0FBTSxJQUFJLENBQUMsUUFBUSxlQUFZLENBQUM7UUFDaEQsQ0FBQztJQUNMLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUFwQ0QsQ0FBcUMsdUJBQVUsR0FvQzlDO0FBcENZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xuXG5leHBvcnQgY2xhc3MgSGVsbG9Xb3JsZE1vZGVsIGV4dGVuZHMgT2JzZXJ2YWJsZSB7XG5cbiAgICBwcml2YXRlIF9jb3VudGVyOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfbWVzc2FnZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBkZWZhdWx0IHZhbHVlcy5cbiAgICAgICAgdGhpcy5fY291bnRlciA9IDQyO1xuICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2UoKTtcbiAgICB9XG5cbiAgICBnZXQgbWVzc2FnZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgICB9XG4gICAgXG4gICAgc2V0IG1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5fbWVzc2FnZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5UHJvcGVydHlDaGFuZ2UoJ21lc3NhZ2UnLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvblRhcCgpIHtcbiAgICAgICAgdGhpcy5fY291bnRlci0tO1xuICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZU1lc3NhZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9ICdIb29ycmFhYXkhIFlvdSB1bmxvY2tlZCB0aGUgTmF0aXZlU2NyaXB0IGNsaWNrZXIgYWNoaWV2ZW1lbnQhJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IGAke3RoaXMuX2NvdW50ZXJ9IHRhcHMgbGVmdGA7XG4gICAgICAgIH1cbiAgICB9XG59Il19