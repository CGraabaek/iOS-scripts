const backgroundColor = new Color("#1C1C1E", 1)

let drawContext = new DrawContext();

drawContext.size = new Size(600, 400)
drawContext.opaque = false

let w = new ListWidget()
w.backgroundColor = backgroundColor
w.setPadding(10, 10, 10, 10)

let row = w.addStack()
let fatsImg = SFSymbol.named("flame.fill")

// line seperator 
drawLine(10, 10, 590, 210, 2, Color.orange())
w.backgroundImage = drawContext.getImage()
w.backgroundImage.size = new Size(600, 200)
w.presentMedium()

// w.presentLarge()


// functions

function drawText(text, fontSize, x, y, color = Color.black()) {
    drawContext.setFont(Font.boldSystemFont(fontSize))
    drawContext.setTextColor(color)
    drawContext.drawText(new String(text).toString(), new Point(x, y))
}

function drawLine(x1, y1, x2, y2, width, color) {
    const path = new Path()
    path.move(new Point(x1, y1))
    path.addLine(new Point(x2, y2))
    drawContext.addPath(path)
    drawContext.setStrokeColor(color)
    drawContext.setLineWidth(width)
    drawContext.strokePath()
}