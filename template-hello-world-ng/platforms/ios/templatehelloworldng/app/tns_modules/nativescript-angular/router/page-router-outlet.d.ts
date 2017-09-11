import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Injector, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, ChildrenOutletContexts } from "@angular/router";
import { Device } from "tns-core-modules/platform";
import { Frame } from "tns-core-modules/ui/frame";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { PageFactory } from "../platform-providers";
import { NSLocationStrategy } from "./ns-location-strategy";
export declare class PageRoute {
    activatedRoute: BehaviorSubject<ActivatedRoute>;
    constructor(startRoute: ActivatedRoute);
}
export declare class PageRouterOutlet implements OnDestroy, OnInit {
    private parentContexts;
    private location;
    private locationStrategy;
    private componentFactoryResolver;
    private resolver;
    private frame;
    private changeDetector;
    private pageFactory;
    private activated;
    private _activatedRoute;
    private refCache;
    private isInitialPage;
    private detachedLoaderFactory;
    private itemsToDestroy;
    private name;
    private viewUtil;
    /** @deprecated from Angular since v4 */
    readonly locationInjector: Injector;
    /** @deprecated from Angular since v4 */
    readonly locationFactoryResolver: ComponentFactoryResolver;
    readonly isActivated: boolean;
    readonly component: Object;
    readonly activatedRoute: ActivatedRoute;
    constructor(parentContexts: ChildrenOutletContexts, location: ViewContainerRef, name: string, locationStrategy: NSLocationStrategy, componentFactoryResolver: ComponentFactoryResolver, resolver: ComponentFactoryResolver, frame: Frame, changeDetector: ChangeDetectorRef, device: Device, pageFactory: PageFactory);
    ngOnDestroy(): void;
    ngOnInit(): void;
    deactivate(): void;
    private destroyQueuedCacheItems();
    private destroyCacheItem(poppedItem);
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach(): ComponentRef<any>;
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void;
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null): void;
    private activateOnGoForward(activatedRoute, loadedResolver);
    private initProvidersMap(activatedRoute, pageRoute);
    private activateOnGoBack(activatedRoute);
    private loadComponentInPage(page, componentRef);
    private getComponentFactory(activatedRoute, loadedResolver);
}
