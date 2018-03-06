import { AppiumDriver, createDriver, SearchOptions, Direction } from "nativescript-dev-appium";
import { assert } from "chai";
import { Home } from "./home";
import { Details } from "./details";

describe("template-hello-world-ng scenario", () => {
    let driver: AppiumDriver,
        details: Details,
        home: Home;

    before(async () => {
        driver = await createDriver();
        details = new Details(driver);
        home = new Home(driver);
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logPageSource(this.currentTest.title);
            await driver.logScreenshot(this.currentTest.title);
        }
        await driver.navBack();
    });

    after(async () => {
        await driver.quit();
    });

    it("should swipe to the last player and verify his details", async () => {
        await home.loaded();
        await home.tapOnPlayerMasip();

        await details.loaded();
        await details.assertPlayerMasipIsDisplayed();
        await details.assertPlayerMasipScreen();
    });
});