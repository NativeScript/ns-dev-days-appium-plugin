Object.defineProperty(exports, "__esModule", { value: true });
// Always import platform-common first - because polyfills
var platform_common_1 = require("./platform-common");
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
// Work around a TS bug requiring an imports of
// InjectionToken, ViewEncapsulation and MissingTranslationStrategy
// without using them
if (global.___TS_UNUSED) {
    (function () { return core_1.InjectionToken; })();
    (function () { return core_1.ViewEncapsulation; })();
    (function () { return core_1.MissingTranslationStrategy; })();
}
// Register DOM adapter, if possible. Dynamic platform only!
require("./dom-adapter");
var schema_registry_1 = require("./schema-registry");
var resource_loader_1 = require("./resource-loader");
exports.NS_COMPILER_PROVIDERS = [
    compiler_1.COMPILER_PROVIDERS,
    {
        provide: core_1.COMPILER_OPTIONS,
        useValue: {
            providers: [
                { provide: compiler_1.ResourceLoader, useClass: resource_loader_1.FileSystemResourceLoader },
                { provide: compiler_1.ElementSchemaRegistry, useClass: schema_registry_1.NativeScriptElementSchemaRegistry },
            ]
        },
        multi: true
    },
];
// Dynamic platform
var _platformNativeScriptDynamic = core_1.createPlatformFactory(compiler_1.platformCoreDynamic, "nativeScriptDynamic", platform_common_1.COMMON_PROVIDERS.concat(exports.NS_COMPILER_PROVIDERS));
function platformNativeScriptDynamic(options, extraProviders) {
    // Return raw platform to advanced users only if explicitly requested
    if (options && options.bootInExistingPage === true) {
        return _platformNativeScriptDynamic(extraProviders);
    }
    else {
        return new platform_common_1.NativeScriptPlatformRef(_platformNativeScriptDynamic(extraProviders), options);
    }
}
exports.platformNativeScriptDynamic = platformNativeScriptDynamic;
//# sourceMappingURL=platform.js.map