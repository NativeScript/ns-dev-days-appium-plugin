import { AppiumDriver, Direction, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

export const masip = "Masip";
const umtiti = "Umtiti";
const title = "My App";

export class Home {

    constructor(private _driver: AppiumDriver) { }

    get players() {
        return this._driver.findElementByClassName(this._driver.locators.listView);
    }

    loaded = async () => {
        const lblTitle = await this._driver.findElementByText(title);
        assert.isTrue(await lblTitle.isDisplayed());
        console.log(title + " loaded!");
    }

    findPlayer = async (playerName: string, scrollDirection: Direction = Direction.down, searchOptions: SearchOptions = SearchOptions.contains) => {
        const player = await (await this.players).scrollTo(
            scrollDirection,
            () => this._driver.findElementByText(playerName, searchOptions));
        return player;
    }

    tapOnPlayerMasip = async () => {
        const playerMasip = await this.findPlayer(masip);
        await playerMasip.tap();
    }
}
