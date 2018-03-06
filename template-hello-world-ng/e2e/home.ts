import { AppiumDriver, Direction, SearchOptions } from "nativescript-dev-appium";
import { Players } from "./players";
import { assert } from "chai";

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

    findPlayer = async (playerName: Players, scrollDirection: Direction = Direction.down, searchOptions: SearchOptions = SearchOptions.contains) => {
        const player = await (await this.players).scrollTo(
            scrollDirection,
            () => this._driver.findElementByText(playerName, searchOptions));
        return player;
    }

    tapOnPlayer = async (playerName: Players) => {
        const player = await this.findPlayer(playerName);
        await player.tap();
    }
}
