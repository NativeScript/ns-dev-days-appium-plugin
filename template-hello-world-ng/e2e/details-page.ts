import { AppiumDriver } from "nativescript-dev-appium";
import { assert } from "chai";

export class DetailsPage {
    constructor(private _driver: AppiumDriver) { }

    async assertPlayerNameIsDisplayed(playerName){
        const player = await this._driver.findElementByText(playerName);
        assert.isTrue(await player.isDisplayed());
    }
}