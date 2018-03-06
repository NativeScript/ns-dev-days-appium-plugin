import { AppiumDriver } from "nativescript-dev-appium";
import { assert } from "chai";
import { masip } from "./home";

const title = "Details";
const masipPlayerDetails = "masipPlayerDetails";

export class Details {

    constructor(private _driver: AppiumDriver) { }

    loaded = async () => {
        const lblTitle = await this._driver.findElementByText(title);
        assert.isTrue(await lblTitle.isDisplayed());
        console.log(title + " loaded!");
    }

    assertPlayerMasipIsDisplayed = async () => {
        const player = await this._driver.findElementByText(masip);
        assert.isTrue(await player.isDisplayed(), `${masip} is NOT displayed!`);
    }

    assertPlayerMasipScreen = async () => {
        const areDetailsCorrect = await this._driver.compareScreen(masipPlayerDetails);
        assert.isTrue(areDetailsCorrect, `Image does NOT match! Please, refer to ${masipPlayerDetails} image.`);
    }
}
