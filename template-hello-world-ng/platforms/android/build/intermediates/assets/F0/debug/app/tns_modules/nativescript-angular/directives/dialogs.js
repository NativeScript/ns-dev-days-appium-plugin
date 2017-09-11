Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page");
var detached_loader_1 = require("../common/detached-loader");
var platform_providers_1 = require("../platform-providers");
var ModalDialogParams = (function () {
    function ModalDialogParams(context, closeCallback) {
        if (context === void 0) { context = {}; }
        this.context = context;
        this.closeCallback = closeCallback;
    }
    return ModalDialogParams;
}());
exports.ModalDialogParams = ModalDialogParams;
var ModalDialogService = (function () {
    function ModalDialogService() {
    }
    ModalDialogService_1 = ModalDialogService;
    ModalDialogService.prototype.showModal = function (type, _a) {
        var viewContainerRef = _a.viewContainerRef, moduleRef = _a.moduleRef, context = _a.context, fullscreen = _a.fullscreen;
        if (!viewContainerRef) {
            throw new Error("No viewContainerRef: " +
                "Make sure you pass viewContainerRef in ModalDialogOptions.");
        }
        var parentPage = viewContainerRef.injector.get(page_1.Page);
        var pageFactory = viewContainerRef.injector.get(platform_providers_1.PAGE_FACTORY);
        // resolve from particular module (moduleRef)
        // or from same module as parentPage (viewContainerRef)
        var componentContainer = moduleRef || viewContainerRef;
        var resolver = componentContainer.injector.get(core_1.ComponentFactoryResolver);
        return new Promise(function (resolve) {
            setTimeout(function () { return ModalDialogService_1.showDialog({
                containerRef: viewContainerRef,
                context: context,
                doneCallback: resolve,
                fullscreen: fullscreen,
                pageFactory: pageFactory,
                parentPage: parentPage,
                resolver: resolver,
                type: type,
            }); }, 10);
        });
    };
    ModalDialogService.showDialog = function (_a) {
        var containerRef = _a.containerRef, context = _a.context, doneCallback = _a.doneCallback, fullscreen = _a.fullscreen, pageFactory = _a.pageFactory, parentPage = _a.parentPage, resolver = _a.resolver, type = _a.type;
        var page = pageFactory({ isModal: true, componentType: type });
        var detachedLoaderRef;
        var closeCallback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            doneCallback.apply(undefined, args);
            page.closeModal();
            detachedLoaderRef.instance.detectChanges();
            detachedLoaderRef.destroy();
        };
        var modalParams = new ModalDialogParams(context, closeCallback);
        var providers = core_1.ReflectiveInjector.resolve([
            { provide: page_1.Page, useValue: page },
            { provide: ModalDialogParams, useValue: modalParams },
        ]);
        var childInjector = core_1.ReflectiveInjector.fromResolvedProviders(providers, containerRef.parentInjector);
        var detachedFactory = resolver.resolveComponentFactory(detached_loader_1.DetachedLoader);
        detachedLoaderRef = containerRef.createComponent(detachedFactory, -1, childInjector, null);
        detachedLoaderRef.instance.loadComponent(type).then(function (compRef) {
            var componentView = compRef.location.nativeElement;
            if (componentView.parent) {
                componentView.parent.removeChild(componentView);
            }
            page.content = componentView;
            parentPage.showModal(page, context, closeCallback, fullscreen);
        });
    };
    ModalDialogService = ModalDialogService_1 = __decorate([
        core_1.Injectable()
    ], ModalDialogService);
    return ModalDialogService;
    var ModalDialogService_1;
}());
exports.ModalDialogService = ModalDialogService;
var ModalDialogHost = (function () {
    function ModalDialogHost() {
        throw new Error("ModalDialogHost is deprecated. " +
            "Call ModalDialogService.showModal() " +
            "by passing ViewContainerRef in the options instead.");
    }
    ModalDialogHost = __decorate([
        core_1.Directive({
            selector: "[modal-dialog-host]" // tslint:disable-line:directive-selector
        }),
        __metadata("design:paramtypes", [])
    ], ModalDialogHost);
    return ModalDialogHost;
}());
exports.ModalDialogHost = ModalDialogHost;
//# sourceMappingURL=dialogs.js.map