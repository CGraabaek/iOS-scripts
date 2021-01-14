const YELLOW = new Color("#ffffcc");
const DARKYELLOW = new Color("#f5dd0a");
const DARKBLUE = new Color("#19193b");
const DARKGREEN = new Color("#0f6922");
const WHITE = new Color("#FFFFFF");
const FONT = new Font("Menlo", 15);
const FONTLARGE = new Font("Menlo", 22);

const customBackgroundColor1_dark = '#3e00fa'; // if bgColorMode CUSTOM together with adaptToLightOrDarkMode = true is used, the light and dark custom values are used depending on the active mode
const customBackgroundColor2_dark = '#7a04d4';

let drawContext = new DrawContext();
drawContext.size = new Size(600, 400)
drawContext.opaque = false

async function createWidget() {
    const widget = new ListWidget();
    widget.spacing = 4;
    widget.setPadding(10, 10, 10, 10)
    widget.backgroundGradient = createLinearGradient(customBackgroundColor1_dark, customBackgroundColor2_dark);
    
    const title = widget.addText(`Today`);
    title.font = FONTLARGE;
    title.textColor = WHITE;

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
    drawLine(10, 210, 590, 210, 2, Color.orange())
    return widget;
}

function drawLine(x1, y1, x2, y2, width, color){
    const path = new Path()
    path.move(new Point(x1, y1))
    path.addLine(new Point(x2, y2))
    drawContext.addPath(path)
    drawContext.setStrokeColor(color)
    drawContext.setLineWidth(width)
    drawContext.strokePath()
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