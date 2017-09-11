Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var file_system_1 = require("tns-core-modules/file-system");
var SEPARATOR = "#";
var NSModuleFactoryLoader = (function () {
    function NSModuleFactoryLoader(compiler, ngModuleLoader) {
        this.compiler = compiler;
        this.ngModuleLoader = ngModuleLoader;
        this.offlineMode = compiler instanceof core_1.Compiler;
    }
    NSModuleFactoryLoader.prototype.load = function (path) {
        return this.offlineMode ?
            this.ngModuleLoader.load(path) :
            this.loadAndCompile(path);
    };
    NSModuleFactoryLoader.prototype.loadAndCompile = function (path) {
        var module = requireModule(path);
        return Promise.resolve(this.compiler.compileModuleAsync(module));
    };
    NSModuleFactoryLoader = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [core_1.Compiler,
            core_1.SystemJsNgModuleLoader])
    ], NSModuleFactoryLoader);
    return NSModuleFactoryLoader;
}());
exports.NSModuleFactoryLoader = NSModuleFactoryLoader;
function requireModule(path) {
    var _a = splitPath(path), modulePath = _a.modulePath, exportName = _a.exportName;
    var loadedModule = global.require(modulePath)[exportName];
    checkNotEmpty(loadedModule, modulePath, exportName);
    return loadedModule;
}
function splitPath(path) {
    var _a = path.split(SEPARATOR), relativeModulePath = _a[0], _b = _a[1], exportName = _b === void 0 ? "default" : _b;
    var absoluteModulePath = getAbsolutePath(relativeModulePath);
    return { modulePath: absoluteModulePath, exportName: exportName };
}
function getAbsolutePath(relativePath) {
    var projectPath = file_system_1.knownFolders.currentApp().path;
    var absolutePath = file_system_1.path.join(projectPath, relativePath);
    return file_system_1.path.normalize(absolutePath);
}
function checkNotEmpty(value, modulePath, exportName) {
    if (!value) {
        throw new Error("Cannot find '" + exportName + "' in '" + modulePath + "'");
    }
}
//# sourceMappingURL=ns-module-factory-loader.js.map