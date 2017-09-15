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

    it("swipe to last player and verify details", async () => {
        await driver.swipe(500, 20, 150);
        await driver.swipe(500, 20, 150);
        await driver.swipe(500, 20, 150);
        await driver.swipe(500, 20, 150);
        await driver.swipe(500, 20, 150);
        const masipPlayer = await driver.findElementByText("Masip", SearchOptions.contains);
        const umtitiPLayer = await driver.findElementByText("Umtiti", SearchOptions.exact);
        await masipPlayer.tap();
        await umtitiPLayer.waitForExistNot(2);

        const isDisplayInformationCorrect = await driver.compareScreen("masipPlayerDetails.png", 10, 0.4);
        assert.isTrue(isDisplayInformationCorrect, "Look at masipPlayerDetails.png");
    });

    it("should find an element by type", async () => {
        const listView = await driver.findElementByClassName(driver.locators.listView);

        const terStegen = "Ter Stegen";
        const terStegenPlayer = await listView.scrollToElement(
            Direction.up,
            () => driver.findElementByText(terStegen, SearchOptions.contains));

        const sergionPlayer = await driver.findElementByText("Sergio", SearchOptions.contains);
        await terStegenPlayer.tap();
        sergionPlayer.waitForExistNot(2);

        const terStegenInfo = await driver.findElementByText(terStegen);
        assert.isTrue(await terStegenInfo.isDisplayed());
    });
});