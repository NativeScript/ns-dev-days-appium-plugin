Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var layout_base_1 = require("tns-core-modules/ui/layouts/layout-base");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var profiling_1 = require("tns-core-modules/profiling");
var element_registry_1 = require("../element-registry");
var collection_facade_1 = require("../collection-facade");
var trace_1 = require("../trace");
var NG_VIEW = "_ngViewRef";
var ListItemContext = (function () {
    function ListItemContext($implicit, item, index, even, odd) {
        this.$implicit = $implicit;
        this.item = item;
        this.index = index;
        this.even = even;
        this.odd = odd;
    }
    return ListItemContext;
}());
exports.ListItemContext = ListItemContext;
var ListViewComponent = (function () {
    function ListViewComponent(_elementRef, _iterableDiffers, _cdr) {
        this._iterableDiffers = _iterableDiffers;
        this._cdr = _cdr;
        this.setupItemView = new core_1.EventEmitter();
        this.listView = _elementRef.nativeElement;
        this.listView.on("itemLoading", this.onItemLoading, this);
    }
    Object.defineProperty(ListViewComponent.prototype, "nativeElement", {
        get: function () {
            return this.listView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListViewComponent.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (value) {
            this._items = value;
            var needDiffer = true;
            if (value instanceof observable_array_1.ObservableArray) {
                needDiffer = false;
            }
            if (needDiffer && !this._differ && collection_facade_1.isListLikeIterable(value)) {
                this._differ = this._iterableDiffers.find(this._items)
                    .create(this._cdr, function (_index, item) { return item; });
            }
            this.listView.items = this._items;
        },
        enumerable: true,
        configurable: true
    });
    ListViewComponent.prototype.ngAfterContentInit = function () {
        trace_1.listViewLog("ListView.ngAfterContentInit()");
        this.setItemTemplates();
    };
    ListViewComponent.prototype.ngOnDestroy = function () {
        this.listView.off("itemLoading", this.onItemLoading, this);
    };
    ListViewComponent.prototype.setItemTemplates = function () {
        // The itemTemplateQuery may be changed after list items are added that contain <template> inside,
        // so cache and use only the original template to avoid errors.
        this.itemTemplate = this.itemTemplateQuery;
        if (this._templateMap) {
            trace_1.listViewLog("Setting templates");
            var templates_1 = [];
            this._templateMap.forEach(function (value) {
                templates_1.push(value);
            });
            this.listView.itemTemplates = templates_1;
        }
    };
    ListViewComponent.prototype.registerTemplate = function (key, template) {
        var _this = this;
        trace_1.listViewLog("registerTemplate for key: " + key);
        if (!this._templateMap) {
            this._templateMap = new Map();
        }
        var keyedTemplate = {
            key: key,
            createView: function () {
                trace_1.listViewLog("registerTemplate for key: " + key);
                var viewRef = _this.loader.createEmbeddedView(template, new ListItemContext(), 0);
                var resultView = getItemViewRoot(viewRef);
                resultView[NG_VIEW] = viewRef;
                return resultView;
            }
        };
        this._templateMap.set(key, keyedTemplate);
    };
    ListViewComponent.prototype.onItemLoading = function (args) {
        if (!args.view && !this.itemTemplate) {
            return;
        }
        var index = args.index;
        var items = args.object.items;
        var currentItem = typeof items.getItem === "function" ? items.getItem(index) : items[index];
        var viewRef;
        if (args.view) {
            trace_1.listViewLog("onItemLoading: " + index + " - Reusing existing view");
            viewRef = args.view[NG_VIEW];
            // Getting angular view from original element (in cases when ProxyViewContainer
            // is used NativeScript internally wraps it in a StackLayout)
            if (!viewRef && args.view instanceof layout_base_1.LayoutBase && args.view.getChildrenCount() > 0) {
                viewRef = args.view.getChildAt(0)[NG_VIEW];
            }
            if (!viewRef) {
                trace_1.listViewError("ViewReference not found for item " + index + ". View recycling is not working");
            }
        }
        if (!viewRef) {
            trace_1.listViewLog("onItemLoading: " + index + " - Creating view from template");
            viewRef = this.loader.createEmbeddedView(this.itemTemplate, new ListItemContext(), 0);
            args.view = getItemViewRoot(viewRef);
            args.view[NG_VIEW] = viewRef;
        }
        this.setupViewRef(viewRef, currentItem, index);
        this.detectChangesOnChild(viewRef, index);
    };
    ListViewComponent.prototype.setupViewRef = function (viewRef, data, index) {
        var context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 === 0);
        context.odd = !context.even;
        this.setupItemView.next({ view: viewRef, data: data, index: index, context: context });
    };
    ListViewComponent.prototype.detectChangesOnChild = function (viewRef, index) {
        trace_1.listViewLog("Manually detect changes in child: " + index);
        viewRef.markForCheck();
        viewRef.detectChanges();
    };
    ListViewComponent.prototype.ngDoCheck = function () {
        if (this._differ) {
            trace_1.listViewLog("ngDoCheck() - execute differ");
            var changes = this._differ.diff(this._items);
            if (changes) {
                trace_1.listViewLog("ngDoCheck() - refresh");
                this.listView.refresh();
            }
        }
    };
    __decorate([
        core_1.ViewChild("loader", { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], ListViewComponent.prototype, "loader", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ListViewComponent.prototype, "setupItemView", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", core_1.TemplateRef)
    ], ListViewComponent.prototype, "itemTemplateQuery", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ListViewComponent.prototype, "items", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ListViewComponent.prototype, "onItemLoading", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [core_1.EmbeddedViewRef, Number]),
        __metadata("design:returntype", void 0)
    ], ListViewComponent.prototype, "detectChangesOnChild", null);
    ListViewComponent = __decorate([
        core_1.Component({
            selector: "ListView",
            template: "\n        <DetachedContainer>\n            <Placeholder #loader></Placeholder>\n        </DetachedContainer>",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.IterableDiffers,
            core_1.ChangeDetectorRef])
    ], ListViewComponent);
    return ListViewComponent;
}());
exports.ListViewComponent = ListViewComponent;
function getItemViewRoot(viewRef, rootLocator) {
    if (rootLocator === void 0) { rootLocator = element_registry_1.getSingleViewRecursive; }
    var rootView = rootLocator(viewRef.rootNodes, 0);
    return rootView;
}
exports.getItemViewRoot = getItemViewRoot;
var TemplateKeyDirective = (function () {
    function TemplateKeyDirective(templateRef, list) {
        this.templateRef = templateRef;
        this.list = list;
    }
    Object.defineProperty(TemplateKeyDirective.prototype, "nsTemplateKey", {
        set: function (value) {
            if (this.list && this.templateRef) {
                this.list.registerTemplate(value, this.templateRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], TemplateKeyDirective.prototype, "nsTemplateKey", null);
    TemplateKeyDirective = __decorate([
        core_1.Directive({ selector: "[nsTemplateKey]" }),
        __param(1, core_1.Host()),
        __metadata("design:paramtypes", [core_1.TemplateRef,
            ListViewComponent])
    ], TemplateKeyDirective);
    return TemplateKeyDirective;
}());
exports.TemplateKeyDirective = TemplateKeyDirective;
//# sourceMappingURL=list-view-comp.js.map