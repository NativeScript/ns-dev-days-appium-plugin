import { AppiumDriver, createDriver, SearchOptions, Direction } from "nativescript-dev-appium";
import { assert } from "chai";

describe("scenario simple", () => {
    const defaultWaitTime = 5000;
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logScreenshoot(this.currentTest.title);
        }

        await driver.navBack();
    });

    it("scroll to last player and verify details", async () => {
        const listView = await driver.findElementByClassName(driver.locators.listView);
        const masipPlayer = await listView.scrollToElement(
            Direction.down,
            () => driver.findElementByText("Masip", SearchOptions.contains));
        await masipPlayer.tap();
        const isDisplayMessageCorrect = await driver.compareScreen("masipPlayerDetails.png", 10, 0.4);
        assert.isTrue(isDisplayMessageCorrect, "Look at masipPlayerDetails.png");
    });

    it("should find an element by type", async () => {
        const listView = await driver.findElementByClassName(driver.locators.listView);
        
        const terStegen = "Ter Stegen";
        const terStegenPlayer = await listView.scrollToElement(
            Direction.up,
            () => driver.findElementByText(terStegen, SearchOptions.contains));

        await terStegenPlayer.tap();
        const label = await driver.findElementByText(terStegen);
        assert.isTrue(await label.isDisplayed());
    });
});