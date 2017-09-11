import { AnimationDriver, ɵAnimationEngine as AnimationEngine } from "@angular/animations/browser";
import { AnimationStyleNormalizer } from "@angular/animations/browser/src/dsl/style_normalization/animation_style_normalizer";
export declare class NativeScriptAnimationEngine extends AnimationEngine {
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer);
}
