import { AppiumDriver, createDriver, SearchOptions, SwipeDirection } from "nativescript-dev-appium";
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

    it("should find an element by text", async () => {
        const terStegenPlayer = await driver.findElementByText("A. Iniesta");
        const masipPlayer = await driver.scrollToElement(SwipeDirection.down,
            () => driver.findElementByText("Masip", SearchOptions.contains),
            await terStegenPlayer.location(),
            400);
        await masipPlayer.tap();
        const isDisplayMessageCorrect = await driver.compareScreen("massipPlayerDetails.png", 10, 0.2);
        assert.isTrue(isDisplayMessageCorrect, "Look at massipPlayerDetails.png");
    });

    it("should find an element by type", async () => {
        const mascherano = await driver.findElementByText("Jordi Alba");
        const terStegen = "Ter Stegen";
        const terStegenPlayer = await driver.scrollToElement(SwipeDirection.up,
            () => driver.findElementByText(terStegen),
            await mascherano.location(),
            400);
        await terStegenPlayer.tap();
        const label = await driver.findElementByText(terStegen);
        assert.isTrue(await label.isDisplayed());
    });
});