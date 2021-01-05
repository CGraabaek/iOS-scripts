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
const FONT = new Font("Menlo", 12);
const FONTLARGE = new Font("Menlo", 18);

const url = `https://stats-api.grayriver.dk/today`

async function getStats() {
    try {
        console.log("fetching data...");
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
    widget.backgroundColor = DARKBLUE;
    widget.url = url;
    const title = widget.addText(`Today`);
    title.font = FONTLARGE;
    title.textColor = DARKGREEN;

    const stats = await getStats();
    console.log(stats);
    console.log(stats.result.length);

    const stack = widget.addStack();
    stack.layoutVertically();

    const text = stack.addText(`☕️  ${stats.result.length}`);
    text.font = FONT;
    text.textColor = YELLOW;
    text.shadowColor = DARKYELLOW;
    text.shadowRadius = 1.2;


    // for (let i = 0; i < leaders.length; i++) {
    //     const text = stack.addText(
    //         `${i + 1}) ${leaders[i].score.padEnd(4, " ")}   ${leaders[i].stars.padStart(2, " ")} ⭐️    ${leaders[i].name}`
    //     );
    //     text.font = FONT;
    //     text.textColor = YELLOW;
    //     text.shadowColor = DARKYELLOW;
    //     text.shadowRadius = 1.2;
    // }
    return widget;
}


const widget = await createWidget();
// be nice to mr iPhone and only update every hour
const refreshAfter = new Date(new Date().getTime() + 1 * 60 * 60000);
widget.refreshAfterDate = refreshAfter;
const formatter = new DateFormatter();
formatter.dateFormat = "yyyy-MM-dd HH:mm";
console.log(`refresh after ${formatter.string(refreshAfter)}`);

Script.setWidget(widget);
Script.complete();