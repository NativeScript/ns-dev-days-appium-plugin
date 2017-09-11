Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("tns-core-modules/trace");
exports.animationsTraceCategory = "ns-animations";
exports.rendererTraceCategory = "ns-renderer";
exports.routerTraceCategory = "ns-router";
exports.listViewTraceCategory = "ns-list-view";
function animationsLog(message) {
    trace_1.write(message, exports.animationsTraceCategory);
}
exports.animationsLog = animationsLog;
function rendererLog(msg) {
    trace_1.write(msg, exports.rendererTraceCategory);
}
exports.rendererLog = rendererLog;
function rendererError(message) {
    trace_1.write(message, exports.rendererTraceCategory, trace_1.messageType.error);
}
exports.rendererError = rendererError;
function routerLog(message) {
    trace_1.write(message, exports.routerTraceCategory);
}
exports.routerLog = routerLog;
function styleError(message) {
    trace_1.write(message, trace_1.categories.Style, trace_1.messageType.error);
}
exports.styleError = styleError;
function listViewLog(message) {
    trace_1.write(message, exports.listViewTraceCategory);
}
exports.listViewLog = listViewLog;
function listViewError(message) {
    trace_1.write(message, exports.listViewTraceCategory, trace_1.messageType.error);
}
exports.listViewError = listViewError;
//# sourceMappingURL=trace.js.map