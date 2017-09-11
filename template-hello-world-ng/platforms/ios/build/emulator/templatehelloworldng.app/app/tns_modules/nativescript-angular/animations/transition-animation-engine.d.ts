import { TransitionAnimationEngine } from "./private-imports/render/transition_animation_engine";
export declare class NSTransitionAnimationEngine extends TransitionAnimationEngine {
    flush(microtaskId?: number): void;
    private _flushAnimationsOverride(microtaskId);
    elementContainsData(namespaceId: string, element: any): any;
    private _beforeAnimationBuildOverride(namespaceId, instruction, allPreviousPlayersMap);
}
