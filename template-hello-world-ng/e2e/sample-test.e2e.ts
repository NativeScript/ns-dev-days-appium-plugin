import { AppiumDriver, createDriver, SearchOptions, Direction } from "nativescript-dev-appium";
import { assert } from "chai";
import { HomeScreen } from "./home-screen";
import { DetailsPage } from "./details-page";

describe("scenario simple", () => {
    let driver: AppiumDriver,
        homeScreen: HomeScreen,
        detailsPage: DetailsPage;

    before(async () => {
        driver = await createDriver();
        homeScreen = new HomeScreen(driver);
        detailsPage = new DetailsPage(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logScreenshot(this.currentTest.title);
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

        const isDisplayInformationCorrect = await driver.compareScreen("masipPlayerDetails.png", 10, 0.01);
        assert.isTrue(isDisplayInformationCorrect, "Look at masipPlayerDetails.png");
    });

    it("should find an element by type", async () => {
        const terStegen = "Ter Stegen";
        const terStegenPlayer = await homeScreen.findPlayer(terStegen);

        const sergio = "Sergio";
        const sergionPlayer = await homeScreen.findPlayer(sergio, Direction.down, SearchOptions.contains);

        await terStegenPlayer.tap();
        sergionPlayer.waitForExistNot(2);

        await detailsPage.assertPlayerNameIsDisplayed(terStegen);
    });
});