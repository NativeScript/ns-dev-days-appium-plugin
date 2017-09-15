Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var view_1 = require("tns-core-modules/ui/core/view");
var transition_animation_engine_1 = require("./private-imports/render/transition_animation_engine");
var element_instruction_map_1 = require("./private-imports/dsl/element_instruction_map");
var shared_1 = require("./private-imports/render/shared");
var util_1 = require("./private-imports/util");
var utils_1 = require("./utils");
function eraseStylesOverride(element, styles) {
    if (!element.style) {
        return;
    }
    Object.keys(styles).forEach(function (prop) {
        var camelCaseProp = utils_1.dashCaseToCamelCase(prop);
        element.style[camelCaseProp] = view_1.unsetValue;
    });
}
function setStylesOverride(element, styles) {
    if (!element.style) {
        return;
    }
    Object.keys(styles).forEach(function (prop) {
        if (styles[prop] === "*") {
            return;
        }
        var camelCaseProp = utils_1.dashCaseToCamelCase(prop);
        element.style[camelCaseProp] = styles[camelCaseProp];
    });
}
// extending Angular's TransitionAnimationEngine
// and overriding a few methods that work on the DOM
var NSTransitionAnimationEngine = (function (_super) {
    __extends(NSTransitionAnimationEngine, _super);
    function NSTransitionAnimationEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NSTransitionAnimationEngine.prototype.flush = function (microtaskId) {
        var _this = this;
        if (microtaskId === void 0) { microtaskId = -1; }
        var players = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach(function (ns, element) { return _this._balanceNamespaceList(ns, element); });
            this.newHostElements.clear();
        }
        if (this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            players = this._flushAnimationsOverride(microtaskId);
        }
        else {
            for (var i = 0; i < this.collectedLeaveElements.length; i++) {
                var element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }
        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        this._flushFns.forEach(function (fn) { return fn(); });
        this._flushFns = [];
        if (this._whenQuietFns.length) {
            // we move these over to a variable so that
            // if any new callbacks are registered in another
            // flush they do not populate the existing set
            var quietFns_1 = this._whenQuietFns;
            this._whenQuietFns = [];
            if (players.length) {
                shared_1.optimizeGroupPlayer(players).onDone(function () { quietFns_1.forEach(function (fn) { return fn(); }); });
            }
            else {
                quietFns_1.forEach(function (fn) { return fn(); });
            }
        }
    };
    // _flushAnimationsOverride is almost the same as
    // _flushAnimations from Angular"s TransitionAnimationEngine.
    // A few dom-specific method invocations are replaced
    NSTransitionAnimationEngine.prototype._flushAnimationsOverride = function (microtaskId) {
        var _this = this;
        var subTimelines = new element_instruction_map_1.ElementInstructionMap();
        var skippedPlayers = [];
        var skippedPlayersMap = new Map();
        var queuedInstructions = [];
        var queriedElements = new Map();
        var allPreStyleElements = new Map();
        var allPostStyleElements = new Map();
        var allEnterNodes = this.collectedEnterElements.length ?
            this.collectedEnterElements.filter(createIsRootFilterFn(this.collectedEnterElements)) :
            [];
        // this must occur before the instructions are built below such that
        // the :enter queries match the elements (since the timeline queries
        // are fired during instruction building).
        for (var i = 0; i < allEnterNodes.length; i++) {
            addClass(allEnterNodes[i], util_1.ENTER_CLASSNAME);
        }
        var allLeaveNodes = [];
        var leaveNodesWithoutAnimations = [];
        for (var i = 0; i < this.collectedLeaveElements.length; i++) {
            var element = this.collectedLeaveElements[i];
            var details = element[transition_animation_engine_1.REMOVAL_FLAG];
            if (details && details.setForRemoval) {
                addClass(element, util_1.LEAVE_CLASSNAME);
                allLeaveNodes.push(element);
                if (!details.hasAnimation) {
                    leaveNodesWithoutAnimations.push(element);
                }
            }
        }
        for (var i = this._namespaceList.length - 1; i >= 0; i--) {
            var ns = this._namespaceList[i];
            ns.drainQueuedTransitions(microtaskId).forEach(function (entry) {
                var player = entry.player;
                var element = entry.element;
                // the below check is skipped, because it's
                // irrelevant in the NativeScript context
                // if (!bodyNode || !this.driver.containsElement(bodyNode, element)) {
                //     player.destroy();
                //     return;
                // }
                var instruction = _this._buildInstruction(entry, subTimelines);
                if (!instruction) {
                    return;
                }
                // if a unmatched transition is queued to go then it SHOULD NOT render
                // an animation and cancel the previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(function () { return eraseStylesOverride(element, instruction.fromStyles); });
                    player.onDestroy(function () { return setStylesOverride(element, instruction.toStyles); });
                    skippedPlayers.push(player);
                    return;
                }
                // this means that if a parent animation uses this animation as a sub trigger
                // then it will instruct the timeline builder to not add a player delay, but
                // instead stretch the first keyframe gap up until the animation starts. The
                // reason this is important is to prevent extra initialization styles from being
                // required by the user in the animation.
                instruction.timelines.forEach(function (tl) { return tl.stretchStartingKeyframe = true; });
                subTimelines.append(element, instruction.timelines);
                var tuple = { instruction: instruction, player: player, element: element };
                queuedInstructions.push(tuple);
                instruction.queriedElements.forEach(
                // tslint:disable-next-line:no-shadowed-variable
                function (element) { return shared_1.getOrSetAsInMap(queriedElements, element, []).push(player); });
                // tslint:disable-next-line:no-shadowed-variable
                instruction.preStyleProps.forEach(function (stringMap, element) {
                    var props = Object.keys(stringMap);
                    if (props.length) {
                        var setVal_1 = allPreStyleElements.get(element);
                        if (!setVal_1) {
                            allPreStyleElements.set(element, setVal_1 = new Set());
                        }
                        props.forEach(function (prop) { return setVal_1.add(prop); });
                    }
                });
                // tslint:disable-next-line:no-shadowed-variable
                instruction.postStyleProps.forEach(function (stringMap, element) {
                    var props = Object.keys(stringMap);
                    var setVal = allPostStyleElements.get(element);
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set());
                    }
                    props.forEach(function (prop) { return setVal.add(prop); });
                });
            });
        }
        // these can only be detected here since we have a map of all the elements
        // that have animations attached to them...
        var enterNodesWithoutAnimations = [];
        for (var i = 0; i < allEnterNodes.length; i++) {
            var element = allEnterNodes[i];
            if (!subTimelines.has(element)) {
                enterNodesWithoutAnimations.push(element);
            }
        }
        var allPreviousPlayersMap = new Map();
        var sortedParentElements = [];
        queuedInstructions.forEach(function (entry) {
            var element = entry.element;
            if (subTimelines.has(element)) {
                sortedParentElements.unshift(element);
                _this._beforeAnimationBuildOverride(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });
        skippedPlayers.forEach(function (player) {
            var element = player.element;
            var previousPlayers = _this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(function (prevPlayer) { shared_1.getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer); });
        });
        allPreviousPlayersMap.forEach(function (players) { return players.forEach(function (player) { return player.destroy(); }); });
        // PRE STAGE: fill the ! styles
        var preStylesMap = allPreStyleElements.size ?
            cloakAndComputeStyles(this.driver, enterNodesWithoutAnimations, allPreStyleElements, animations_1.ɵPRE_STYLE) :
            new Map();
        // POST STAGE: fill the * styles
        var postStylesMap = cloakAndComputeStyles(this.driver, leaveNodesWithoutAnimations, allPostStyleElements, animations_1.AUTO_STYLE);
        var rootPlayers = [];
        var subPlayers = [];
        queuedInstructions.forEach(function (entry) {
            var element = entry.element, player = entry.player, instruction = entry.instruction;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                var innerPlayer = _this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
                player.setRealPlayer(innerPlayer);
                var parentHasPriority = null;
                for (var i = 0; i < sortedParentElements.length; i++) {
                    var parent_1 = sortedParentElements[i];
                    if (parent_1 === element) {
                        break;
                    }
                    if (_this.driver.containsElement(parent_1, element)) {
                        parentHasPriority = parent_1;
                        break;
                    }
                }
                if (parentHasPriority) {
                    var parentPlayers = _this.playersByElement.get(parentHasPriority);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = shared_1.optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                }
                else {
                    rootPlayers.push(player);
                }
            }
            else {
                eraseStylesOverride(element, instruction.fromStyles);
                player.onDestroy(function () { return setStylesOverride(element, instruction.toStyles); });
                subPlayers.push(player);
            }
        });
        subPlayers.forEach(function (player) {
            var playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                var innerPlayer = shared_1.optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });
        // the reason why we don"t actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(function (player) {
            if (player.parentPlayer) {
                player.parentPlayer.onDestroy(function () { return player.destroy(); });
            }
            else {
                player.destroy();
            }
        });
        // run through all of the queued removals and see if they
        // were picked up by a query. If not then perform the removal
        // operation right away unless a parent animation is ongoing.
        for (var i = 0; i < allLeaveNodes.length; i++) {
            var element = allLeaveNodes[i];
            var details = element[transition_animation_engine_1.REMOVAL_FLAG];
            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation) {
                continue;
            }
            var players = [];
            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                var queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push.apply(players, queriedPlayerResults);
                }
                var queriedInnerElements = this.driver.query(element, util_1.NG_ANIMATING_SELECTOR, true);
                for (var j = 0; j < queriedInnerElements.length; j++) {
                    var queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push.apply(players, queriedPlayers);
                    }
                }
            }
            if (players.length) {
                removeNodesAfterAnimationDone(this, element, players);
            }
            else {
                this.processLeaveNode(element);
            }
        }
        rootPlayers.forEach(function (player) {
            _this.players.push(player);
            player.onDone(function () {
                player.destroy();
                var index = _this.players.indexOf(player);
                _this.players.splice(index, 1);
            });
            player.play();
        });
        allEnterNodes.forEach(function (element) { return removeClass(element, util_1.ENTER_CLASSNAME); });
        return rootPlayers;
    };
    NSTransitionAnimationEngine.prototype.elementContainsData = function (namespaceId, element) {
        var containsData = false;
        var details = element[transition_animation_engine_1.REMOVAL_FLAG];
        if (details && details.setForRemoval) {
            containsData = true;
        }
        if (this.playersByElement.has(element)) {
            containsData = true;
        }
        if (this.playersByQueriedElement.has(element)) {
            containsData = true;
        }
        if (this.statesByElement.has(element)) {
            containsData = true;
        }
        return this._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    };
    NSTransitionAnimationEngine.prototype._beforeAnimationBuildOverride = function (namespaceId, instruction, allPreviousPlayersMap) {
        var _this = this;
        // it"s important to do this step before destroying the players
        // so that the onDone callback below won"t fire before this
        eraseStylesOverride(instruction.element, instruction.fromStyles);
        var triggerName = instruction.triggerName;
        var rootElement = instruction.element;
        // when a removal animation occurs, ALL previous players are collected
        // and destroyed (even if they are outside of the current namespace)
        var targetNameSpaceId = instruction.isRemovalTransition ? undefined : namespaceId;
        var targetTriggerName = instruction.isRemovalTransition ? undefined : triggerName;
        instruction.timelines.map(function (timelineInstruction) {
            var element = timelineInstruction.element;
            var isQueriedElement = element !== rootElement;
            var players = shared_1.getOrSetAsInMap(allPreviousPlayersMap, element, []);
            var previousPlayers = _this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(function (player) {
                var realPlayer = player.getRealPlayer();
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                players.push(player);
            });
        });
    };
    return NSTransitionAnimationEngine;
}(transition_animation_engine_1.TransitionAnimationEngine));
exports.NSTransitionAnimationEngine = NSTransitionAnimationEngine;
function cloakElement(element, value) {
    var oldValue = element.style.display;
    element.style.display = value != null ? value : "none";
    return oldValue;
}
function cloakAndComputeStyles(driver, elements, elementPropsMap, defaultStyle) {
    var cloakVals = elements.map(function (element) { return cloakElement(element); });
    var valuesMap = new Map();
    elementPropsMap.forEach(function (props, element) {
        var styles = {};
        props.forEach(function (prop) {
            styles[prop] = driver.computeStyle(element, prop, defaultStyle);
        });
        valuesMap.set(element, styles);
    });
    elements.forEach(function (element, i) { return cloakElement(element, cloakVals[i]); });
    return valuesMap;
}
/*
Since the Angular renderer code will return a collection of inserted
nodes in all areas of a DOM tree, it"s up to this algorithm to figure
out which nodes are roots.
By placing all nodes into a set and traversing upwards to the edge,
the recursive code can figure out if a clean path from the DOM node
to the edge container is clear. If no other node is detected in the
set then it is a root element.
This algorithm also keeps track of all nodes along the path so that
if other sibling nodes are also tracked then the lookup process can
skip a lot of steps in between and avoid traversing the entire tree
multiple times to the edge.
 */
function createIsRootFilterFn(nodes) {
    var nodeSet = new Set(nodes);
    var knownRootContainer = new Set();
    var isRoot;
    isRoot = function (node) {
        if (!node) {
            return true;
        }
        if (nodeSet.has(node.parentNode)) {
            return false;
        }
        if (knownRootContainer.has(node.parentNode)) {
            return true;
        }
        if (isRoot(node.parentNode)) {
            knownRootContainer.add(node);
            return true;
        }
        return false;
    };
    return isRoot;
}
var CLASSES_CACHE_KEY = "$$classes";
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        var classes = element[CLASSES_CACHE_KEY];
        if (!classes) {
            classes = element[CLASSES_CACHE_KEY] = {};
        }
        classes[className] = true;
    }
}
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        var classes = element[CLASSES_CACHE_KEY];
        if (classes) {
            delete classes[className];
        }
    }
}
function removeNodesAfterAnimationDone(engine, element, players) {
    shared_1.optimizeGroupPlayer(players).onDone(function () { return engine.processLeaveNode(element); });
}
//# sourceMappingURL=transition-animation-engine.js.map