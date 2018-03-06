import { AppiumDriver } from "nativescript-dev-appium";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";
import { Players } from "./players";
import { assert } from "chai";

const title = "Details";

export class Details {

    constructor(private _driver: AppiumDriver) { }

    loaded = async () => {
        const lblTitle = await this._driver.findElementByText(title);
        assert.isTrue(await lblTitle.isDisplayed());
        console.log(title + " loaded!");
    }

    assertPlayerIsDisplayed = async (playerName: Players) => {
        const player = await this._driver.findElementByText(playerName);
        assert.isTrue(await player.isDisplayed(), `${playerName} is NOT displayed!`);
    }

    assertPlayerScreen = async (playerName: Players) => {
        const imageName = playerName.toLowerCase() + "PlayerDetails";
        const areDetailsCorrect = await this._driver.compareScreen(imageName, 3, 10, ImageOptions.pixel);
        assert.isTrue(areDetailsCorrect, `Image does NOT match! Please, refer to ${imageName} image.`);
    }
}
