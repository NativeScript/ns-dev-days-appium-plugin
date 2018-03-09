# ns-dev-days-appium-plugin

The official demos of the [nativescript-dev-appium](https://github.com/NativeScript/nativescript-dev-appium#nativescript-dev-appium) plugin from the [NativeScript Developer Day 2017](http://developerday.nativescript.org/).

> A video record of the session could be watched [here](https://www.youtube.com/watch?v=LjgIM4pvhsQ).

### This repositories contains:
- template-hello-world-ts - a NativeScript project with TypeScript based on the [Hello World template for TypeScript](https://github.com/NativeScript/template-hello-world-ts).
- template-hello-world-ng - a NativeScript project with Angular and TypeScript based on the [Hello World template for Angular](https://github.com/NativeScript/template-hello-world-ng).

### These tests demonstrate:
- [template-hello-world-ts/e2e](https://github.com/NativeScript/ns-dev-days-appium-plugin/blob/master/template-hello-world-ts/e2e/) - *nativescript-dev-appium* basics: configurations, find strategies, locators, actions.
- [template-hello-world-ng/e2e](https://github.com/NativeScript/ns-dev-days-appium-plugin/blob/master/template-hello-world-ng/e2e/) - the page object pattern with *nativescript-dev-appium*.

### Steps to start demo:

```shell
cd template-hello-world-ts  # or template-hello-world-ng
npm install
tns build android  # or ios
npm run e2e -- --runType android23 --reuseDevice  # or sim.iPhoneX.iOS110
```

> Note: make sure you have set the correct *platformName*, *platformVersion* and *deviceName* values in the `e2e/config/appium.capabilities.json` file for the configuration you execute.
