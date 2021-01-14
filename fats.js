const backgroundColor = new Color("#1C1C1E", 1)

let drawContext = new DrawContext();

drawContext.size = new Size(600, 400)
drawContext.opaque = false

let w = new ListWidget()
w.backgroundColor = backgroundColor
w.setPadding(10, 10, 10, 10)

let row = w.addStack()
let fatsImg = SFSymbol.named("flame.fill")

let fatsTotal = 12;
let proteinTotal = 78;
let carbsTotal = 12;
let calTotal = 20;
let waterTotal = 20;
let workoutType = "test"
let activeEnergy = 180;
console.log(item)

// convert to percentage

let fatsPerent = ((fatsTotal * 4) / calTotal) * 100
let proteinPerent = ((proteinTotal * 4) / calTotal) * 100
let carbsPerent = ((carbsTotal * 4) / calTotal) * 100


let fatsY = 100 + (400 * (fatsPerent / 100))
let proteinY = 200 - (130 * (proteinPerent / 100))
let carbY = 200 - (130 * (carbsPerent / 100))

// bar length
let x = 200
let length = 200

let carbStr = "Carbohydrates"
let proteinStr = "Protein"
let fatStr = "Fats"
let calStr = "Calories"
let waterStr = "Water"


// protein progress bar
drawText(proteinStr, 18, strX(proteinStr), 96, Color.white())
drawProgerss(x, 110, x + length, 110, 25, Color.red(), backgroundColor, (x - 10) + (length) * (proteinPerent / 100))
drawText(`${proteinPerent.toFixed(2)} %`, 18, x + length + 20, 96, Color.white())

// carbs progress bar
drawText("Carbohydrates", 18, 50, 132, Color.white())
drawProgerss(x, 145, x + length, 145, 25, Color.blue(), backgroundColor, (x - 10) + (length) * (carbsPerent / 100))
drawText(`${carbsPerent.toFixed(2)} %`, 18, x + length + 20, 135, Color.white())

// fats progress bar
drawText("Fats", 18, 140, 170, Color.white())
drawProgerss(x, 180, x + length, 180, 25, Color.orange(), backgroundColor, (x - 10) + (length) * (fatsPerent / 100))
drawText(`${fatsPerent.toFixed(2)} %`, 18, x + length + 20, 170, Color.white())

// calories / burned text
drawText("Calories", 14, 40, 225, Color.white())
drawText(`${calTotal.toFixed(2)} kCal`, 14, 40, 245, Color.white())
drawText("Calories Burned", 14, 40, 275, Color.white())
drawText(`${activeEnergy}`, 14, 40, 295, Color.white())

// water / fats text
drawText("Water", 14, 240, 225, Color.white())
drawText(`${waterTotal.toFixed(2)} oz`, 14, 240, 245, Color.white())
drawText("Fats", 14, 240, 275, Color.white())
drawText(`${fatsTotal.toFixed(2)} grams`, 14, 240, 295, Color.white())


// carb / protein text
drawText("Carbohydrates", 14, 440, 225, Color.white())
drawText(`${carbsTotal.toFixed(2)} grams`, 14, 440, 245, Color.white())
drawText("Protein", 14, 440, 275, Color.white())
drawText(`${proteinTotal.toFixed(2)} grams`, 14, 440, 295, Color.white())

// line seperator 
drawLine(10, 210, 590, 210, 2, Color.orange())
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

function drawProgerss(x1, y1, x2, y2, width, color, indicatorColor, iX) {

    const path = new Path()
    path.move(new Point(x1, y1))
    path.addLine(new Point(x2, y2))
    drawContext.addPath(path)
    drawContext.setStrokeColor(color)
    drawContext.setLineWidth(width)
    drawContext.strokePath()

    // left end of line
    drawContext.setFillColor(color)
    drawContext.fillEllipse(new Rect(x1 - 10, y1 - 12, width - 1, width - 1))
    // right end line
    drawContext.fillEllipse(new Rect(x2 - 10, y1 - 12, width - 1, width - 1))


    // progress

    drawContext.setFillColor(indicatorColor)
    drawContext.fillEllipse(new Rect(iX, y1 - 11, width - 3, width - 3))

}


function strX(string) {

    console.log(x - (carbStr.length * 10.77) - 10)

    let stringX = x - (string.length * 10.77) - 10

    return stringX

}
