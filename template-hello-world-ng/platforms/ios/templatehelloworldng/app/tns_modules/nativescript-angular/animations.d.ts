import { NgZone, Provider } from "@angular/core";
import { AnimationDriver, ɵAnimationStyleNormalizer as AnimationStyleNormalizer, ɵWebAnimationsStyleNormalizer as WebAnimationsStyleNormalizer } from "@angular/animations/browser";
import { ɵAnimationRendererFactory as AnimationRendererFactory } from "@angular/platform-browser/animations";
import { NativeScriptAnimationEngine } from "./animations/animation-engine";
import { NativeScriptAnimationDriver } from "./animations/animation-driver";
import { NativeScriptRendererFactory } from "./renderer";
export declare class InjectableAnimationEngine extends NativeScriptAnimationEngine {
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer);
}
export declare function instantiateSupportedAnimationDriver(): NativeScriptAnimationDriver;
export declare function instantiateRendererFactory(renderer: NativeScriptRendererFactory, engine: NativeScriptAnimationEngine, zone: NgZone): AnimationRendererFactory;
export declare function instantiateDefaultStyleNormalizer(): WebAnimationsStyleNormalizer;
export declare const NATIVESCRIPT_ANIMATIONS_PROVIDERS: Provider[];
export declare class NativeScriptAnimationsModule {
}
