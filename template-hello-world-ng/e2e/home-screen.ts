import { AppiumDriver, Direction, SearchOptions } from "nativescript-dev-appium";

export class HomeScreen {
    constructor(private _driver: AppiumDriver) {
    }

    get players() {
        return this._driver.findElementByClassName(this._driver.locators.listView);
    }

    async findPlayer(playerName: string, scrollDirection: Direction = Direction.down, searchOptions: SearchOptions = SearchOptions.contains) {
        const player = await (await this.players).scrollTo(
            Direction.up,
            () => this._driver.findElementByText(playerName, searchOptions));

        return player;
    }
}