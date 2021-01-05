/*
 *  Steps:
 *    1. Install the iOS [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) app.
 *    2. Set your leaderboard ID and session cookie below.
 *    3. Import/Copy this script into it.
 *    4. Set up a home-screen widget with the script!
 */

const YELLOW = new Color("#ffffcc");
const DARKYELLOW = new Color("#f5dd0a");
const DARKBLUE = new Color("#19193b");
const DARKGREEN = new Color("#0f6922");
const WHITE = new Color("#FFFFFF");
const FONT = new Font("Menlo", 15);
const FONTLARGE = new Font("Menlo", 22);

const customBackgroundColor1_light = '#3e00fa'; // if bgColorMode CUSTOM is used a LinearGradient is created from customBackgroundColor1_light and customBackgroundColor2_light
const customBackgroundColor2_light = '#7a04d4'; // you can use your own colors here; they are saved in the configuration
const customBackgroundColor1_dark = '#3e00fa'; // if bgColorMode CUSTOM together with adaptToLightOrDarkMode = true is used, the light and dark custom values are used depending on the active mode
const customBackgroundColor2_dark = '#7a04d4';
const purpleBgGradient_light = createLinearGradient('#421367', '#481367');
const purpleBgGradient_dark = createLinearGradient('#250b3b', '#320d47');

const base_url = `https://stats-api.grayriver.dk/today`

async function getStats(collection) {
    let url = base_url;
    if (collection) {
        url += "?collection=" + collection;
    }
    try {
        console.log(`fetching data for url ${url}"`);
        const request = new Request(url);

        const response = await request.loadJSON();
        return response;
    } catch (error) {
        console.error(`error fetching json from ${url}: ${JSON.stringify(error)}`);
    }
}


async function createWidget() {
    const widget = new ListWidget();
    widget.spacing = 4;
    widget.setPadding(10, 15, 15, 10);
    widget.backgroundGradient = createLinearGradient(customBackgroundColor1_dark, customBackgroundColor2_dark);

    const title = widget.addText(`Today`);
    title.font = FONTLARGE;
    title.textColor = WHITE;

    const coffeeStats = await getStats('coffee');
    const sodaStats = await getStats('soda');
    const beerStats = await getStats('beer');
    const poopStats = await getStats('poop');

    const stack = widget.addStack();
    stack.layoutVertically();

    // Line 0 - Last Login
    const timeFormatter = new DateFormatter();
    timeFormatter.locale = "da";
    timeFormatter.useNoDateStyle();
    timeFormatter.useShortTimeStyle();

    const lastLoginLine = stack.addText(`${timeFormatter.string(new Date())}`);
    lastLoginLine.textColor = Color.white();
    lastLoginLine.textOpacity = 0.7;
    lastLoginLine.font = new Font("Menlo", 10);


    const coffeeCount = stack.addText(`☕️ | ${coffeeStats.result.length}`);
    coffeeCount.font = FONT;
    coffeeCount.textColor = WHITE;
    const sodaCount = stack.addText(`🍺 | ${beerStats.result.length}`);
    sodaCount.font = FONT;
    sodaCount.textColor = WHITE;
    const text3 = stack.addText(`🥤 | ${sodaStats.result.length}`);
    text3.font = FONT;
    text3.textColor = WHITE;
    const text4 = stack.addText(`💩 | ${poopStats.result.length}`);
    text4.font = FONT;
    text4.textColor = WHITE;

    return widget;
}

function createLinearGradient(color1, color2) {
    const gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color(color1), new Color(color2)];
    return gradient;
}

const widget = await createWidget();

Script.setWidget(widget);
Script.complete();