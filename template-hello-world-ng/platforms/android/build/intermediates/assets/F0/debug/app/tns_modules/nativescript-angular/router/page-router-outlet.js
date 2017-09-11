Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var frame_1 = require("tns-core-modules/ui/frame");
var page_1 = require("tns-core-modules/ui/page");
var profiling_1 = require("tns-core-modules/profiling");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var lang_facade_1 = require("../lang-facade");
var platform_providers_1 = require("../platform-providers");
var trace_1 = require("../trace");
var detached_loader_1 = require("../common/detached-loader");
var view_util_1 = require("../view-util");
var ns_location_strategy_1 = require("./ns-location-strategy");
var PageRoute = (function () {
    function PageRoute(startRoute) {
        this.activatedRoute = new BehaviorSubject_1.BehaviorSubject(startRoute);
    }
    return PageRoute;
}());
exports.PageRoute = PageRoute;
var ChildInjector = (function () {
    function ChildInjector(providers, parent) {
        this.providers = providers;
        this.parent = parent;
    }
    ChildInjector.prototype.get = function (token, notFoundValue) {
        return this.providers.get(token) || this.parent.get(token, notFoundValue);
    };
    return ChildInjector;
}());
/**
 * Reference Cache
 */
var RefCache = (function () {
    function RefCache() {
        this.cache = new Array();
    }
    Object.defineProperty(RefCache.prototype, "length", {
        get: function () {
            return this.cache.length;
        },
        enumerable: true,
        configurable: true
    });
    RefCache.prototype.push = function (cacheItem) {
        this.cache.push(cacheItem);
    };
    RefCache.prototype.pop = function () {
        return this.cache.pop();
    };
    RefCache.prototype.peek = function () {
        return this.cache[this.cache.length - 1];
    };
    RefCache.prototype.clear = function () {
        while (this.length) {
            RefCache.destroyItem(this.pop());
        }
    };
    RefCache.destroyItem = function (item) {
        if (lang_facade_1.isPresent(item.componentRef)) {
            item.componentRef.destroy();
        }
        if (lang_facade_1.isPresent(item.loaderRef)) {
            item.loaderRef.destroy();
        }
    };
    return RefCache;
}());
var log = function (msg) { return trace_1.routerLog(msg); };
var PageRouterOutlet = (function () {
    function PageRouterOutlet(parentContexts, location, name, locationStrategy, componentFactoryResolver, resolver, frame, changeDetector, device, pageFactory) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.locationStrategy = locationStrategy;
        this.componentFactoryResolver = componentFactoryResolver;
        this.resolver = resolver;
        this.frame = frame;
        this.changeDetector = changeDetector;
        this.pageFactory = pageFactory;
        this.activated = null;
        this._activatedRoute = null;
        this.refCache = new RefCache();
        this.isInitialPage = true;
        this.itemsToDestroy = [];
        this.name = name || router_1.PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, this);
        this.viewUtil = new view_util_1.ViewUtil(device);
        this.detachedLoaderFactory = resolver.resolveComponentFactory(detached_loader_1.DetachedLoader);
        log("DetachedLoaderFactory loaded");
    }
    Object.defineProperty(PageRouterOutlet.prototype, "locationInjector", {
        /** @deprecated from Angular since v4 */
        get: function () { return this.location.injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "locationFactoryResolver", {
        /** @deprecated from Angular since v4 */
        get: function () { return this.resolver; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "isActivated", {
        get: function () {
            return !!this.activated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "component", {
        get: function () {
            if (!this.activated) {
                throw new Error("Outlet is not activated");
            }
            return this.activated.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRouterOutlet.prototype, "activatedRoute", {
        get: function () {
            if (!this.activated) {
                throw new Error("Outlet is not activated");
            }
            return this._activatedRoute;
        },
        enumerable: true,
        configurable: true
    });
    PageRouterOutlet.prototype.ngOnDestroy = function () {
        this.parentContexts.onChildOutletDestroyed(this.name);
    };
    PageRouterOutlet.prototype.ngOnInit = function () {
        if (this.isActivated) {
            return;
        }
        // If the outlet was not instantiated at the time the route got activated we need to populate
        // the outlet when it is initialized (ie inside a NgIf)
        var context = this.parentContexts.getContext(this.name);
        if (!context || !context.route) {
            return;
        }
        if (context.attachRef) {
            // `attachRef` is populated when there is an existing component to mount
            this.attach(context.attachRef, context.route);
        }
        else {
            // otherwise the component defined in the configuration is created
            this.activateWith(context.route, context.resolver || null);
        }
    };
    PageRouterOutlet.prototype.deactivate = function () {
        if (this.locationStrategy._isPageNavigatingBack()) {
            log("PageRouterOutlet.deactivate() while going back - should destroy");
            if (!this.isActivated) {
                return;
            }
            var poppedItem = this.refCache.pop();
            var poppedRef = poppedItem.componentRef;
            if (this.activated !== poppedRef) {
                throw new Error("Current componentRef is different for cached componentRef");
            }
            RefCache.destroyItem(poppedItem);
            this.activated = null;
        }
        else {
            log("PageRouterOutlet.deactivate() while going forward - do nothing");
        }
    };
    PageRouterOutlet.prototype.destroyQueuedCacheItems = function () {
        while (this.itemsToDestroy.length > 0) {
            this.destroyCacheItem(this.itemsToDestroy.pop());
        }
    };
    PageRouterOutlet.prototype.destroyCacheItem = function (poppedItem) {
        if (lang_facade_1.isPresent(poppedItem.componentRef)) {
            poppedItem.componentRef.destroy();
        }
        if (lang_facade_1.isPresent(poppedItem.loaderRef)) {
            poppedItem.loaderRef.destroy();
        }
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    PageRouterOutlet.prototype.detach = function () {
        if (!this.isActivated) {
            throw new Error("Outlet is not activated");
        }
        this.location.detach();
        var cmp = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return cmp;
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    PageRouterOutlet.prototype.attach = function (ref, activatedRoute) {
        log("PageRouterOutlet.attach()" +
            "when RouteReuseStrategy instructs to re-attach " +
            "previously detached subtree");
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.location.insert(ref.hostView);
    };
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    PageRouterOutlet.prototype.activateWith = function (activatedRoute, resolver) {
        log("PageRouterOutlet.activateWith() - " +
            "instanciating new component during commit phase of a navigation");
        this._activatedRoute = activatedRoute;
        resolver = resolver || this.resolver;
        if (this.locationStrategy._isPageNavigatingBack()) {
            this.activateOnGoBack(activatedRoute);
        }
        else {
            this.activateOnGoForward(activatedRoute, resolver);
        }
    };
    PageRouterOutlet.prototype.activateOnGoForward = function (activatedRoute, loadedResolver) {
        var pageRoute = new PageRoute(activatedRoute);
        var providers = this.initProvidersMap(activatedRoute, pageRoute);
        var childInjector = new ChildInjector(providers, this.location.injector);
        var factory = this.getComponentFactory(activatedRoute, loadedResolver);
        if (this.isInitialPage) {
            log("PageRouterOutlet.activate() initial page - just load component");
            this.isInitialPage = false;
            this.activated = this.location.createComponent(factory, this.location.length, childInjector, []);
            this.changeDetector.markForCheck();
            this.refCache.push({
                componentRef: this.activated,
                reusedRoute: pageRoute,
                loaderRef: null,
            });
        }
        else {
            log("PageRouterOutlet.activate() forward navigation - " +
                "create detached loader in the loader container");
            var page = this.pageFactory({
                isNavigation: true,
                componentType: factory.componentType,
            });
            providers.set(page_1.Page, page);
            var loaderRef = this.location.createComponent(this.detachedLoaderFactory, this.location.length, childInjector, []);
            this.changeDetector.markForCheck();
            this.activated = loaderRef.instance.loadWithFactory(factory);
            this.loadComponentInPage(page, this.activated);
            this.refCache.push({
                componentRef: this.activated,
                reusedRoute: pageRoute,
                loaderRef: loaderRef,
            });
        }
    };
    PageRouterOutlet.prototype.initProvidersMap = function (activatedRoute, pageRoute) {
        var providers = new Map();
        providers.set(PageRoute, pageRoute);
        providers.set(router_1.ActivatedRoute, activatedRoute);
        var childContexts = this.parentContexts.getOrCreateContext(this.name).children;
        providers.set(router_1.ChildrenOutletContexts, childContexts);
        return providers;
    };
    PageRouterOutlet.prototype.activateOnGoBack = function (activatedRoute) {
        log("PageRouterOutlet.activate() - Back navigation, so load from cache");
        this.locationStrategy._finishBackPageNavigation();
        var cacheItem = this.refCache.peek();
        cacheItem.reusedRoute.activatedRoute.next(activatedRoute);
        this.activated = cacheItem.componentRef;
    };
    PageRouterOutlet.prototype.loadComponentInPage = function (page, componentRef) {
        var _this = this;
        // Component loaded. Find its root native view.
        var componentView = componentRef.location.nativeElement;
        // Remove it from original native parent.
        this.viewUtil.removeChild(componentView.parent, componentView);
        // Add it to the new page
        page.content = componentView;
        page.on(page_1.Page.navigatedToEvent, function () { return setTimeout(function () {
            _this.destroyQueuedCacheItems();
        }); });
        page.on(page_1.Page.navigatedFromEvent, global.Zone.current.wrap(function (args) {
            if (args.isBackNavigation) {
                _this.locationStrategy._beginBackPageNavigation();
                _this.locationStrategy.back();
            }
        }));
        var navOptions = this.locationStrategy._beginPageNavigation();
        this.frame.navigate({
            create: function () { return page; },
            clearHistory: navOptions.clearHistory,
            animated: navOptions.animated,
            transition: navOptions.transition
        });
        // Clear refCache if navigation with clearHistory
        if (navOptions.clearHistory) {
            this.refCache.clear();
        }
    };
    // NOTE: Using private APIs - potential break point!
    PageRouterOutlet.prototype.getComponentFactory = function (activatedRoute, loadedResolver) {
        var snapshot = activatedRoute._futureSnapshot;
        var component = snapshot._routeConfig.component;
        return loadedResolver ?
            loadedResolver.resolveComponentFactory(component) :
            this.componentFactoryResolver.resolveComponentFactory(component);
    };
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, Object]),
        __metadata("design:returntype", void 0)
    ], PageRouterOutlet.prototype, "activateWith", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [page_1.Page, core_1.ComponentRef]),
        __metadata("design:returntype", void 0)
    ], PageRouterOutlet.prototype, "loadComponentInPage", null);
    PageRouterOutlet = __decorate([
        core_1.Directive({ selector: "page-router-outlet" }) // tslint:disable-line:directive-selector
        ,
        __param(2, core_1.Attribute("name")),
        __param(8, core_1.Inject(platform_providers_1.DEVICE)),
        __param(9, core_1.Inject(platform_providers_1.PAGE_FACTORY)),
        __metadata("design:paramtypes", [router_1.ChildrenOutletContexts,
            core_1.ViewContainerRef, String, ns_location_strategy_1.NSLocationStrategy,
            core_1.ComponentFactoryResolver,
            core_1.ComponentFactoryResolver,
            frame_1.Frame,
            core_1.ChangeDetectorRef, Object, Function])
    ], PageRouterOutlet);
    return PageRouterOutlet;
}());
exports.PageRouterOutlet = PageRouterOutlet;
//# sourceMappingURL=page-router-outlet.js.map