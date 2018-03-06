import { AppiumDriver } from "nativescript-dev-appium";
import { assert } from "chai";

const title = "Details";

export class Details {

    constructor(private _driver: AppiumDriver) { }

    loaded = async () => {
        const lblTitle = await this._driver.findElementByText(title);
        assert.isTrue(await lblTitle.isDisplayed());
        console.log(title + " loaded!");
    }

    assertPlayerIsDisplayed = async (playerName) => {
        const player = await this._driver.findElementByText(playerName);
        assert.isTrue(await player.isDisplayed(), `${playerName} is NOT displayed!`);
    }

    assertPlayerMasipScreen = async (playerName) => {
        const areDetailsCorrect = await this._driver.compareScreen(playerName);
        assert.isTrue(areDetailsCorrect, `Image does NOT match! Please, refer to ${playerName} image.`);
    }
}
