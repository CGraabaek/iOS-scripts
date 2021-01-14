/*
 *  Steps:
 *    1. Install the iOS [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) app.
 *    2. Import/Copy this script into it.
 *    3. Set up a home-screen widget with the script!
 */

const COLOR_CONFIG = {
    PS: {
        color: '#1a237e',
    },
    WHITE: {
        color: '#FFFFFF',
    }
};

const FONT = new Font("Menlo", 15);
const FONTLARGE = new Font("Menlo", 22);

const base_url = `http://212.60.123.150:8008/status`

// Text size for field data information
const TEXT_SIZE = 10;

// Spacing between lines of text of field data
const TEXT_SPACING = 4;

// Text size for the header text. Ex: "Daily Log for Fri, Nov 6"
const DATE_TEXT_SIZE = 12;

// Spacing below the header text
const DATE_TEXT_SPACING = 10;

// Vertical padding between columns
const VERTICAL_TEXT_SPACING = 10;

// Vertical padding between columns of data grid
const VERTICAL_DATA_GRID_SPACING = 10;

// Whether or not to use a background image for the widget (if false, use gradient color)
const TITLE_TEXT_SPACING = 20;

async function getStock() {
    try {
        console.log(`fetching data for url ${base_url}"`);
        const request = new Request(base_url);

        const response = await request.loadJSON();
        return response;
    } catch (error) {
        console.error(`error fetching json from ${base_url}: ${JSON.stringify(error)}`);
    }
}

function createWidget(data) {
    // console.log(`Creating widget with data: ${JSON.stringify(data)}`);

    // Widget
    const widget = new ListWidget();
    const bgColor = new LinearGradient();
    bgColor.colors = [new Color("#96c93d"), new Color("#00b09b")];
    bgColor.locations = [0.0, 1.0];
    widget.backgroundGradient = bgColor;
    widget.setPadding(10, 10, 10, 10);

    // Main stack
    const stack = widget.addStack();
    stack.layoutVertically();

    // Top stack
    const topStack = stack.addStack();
    topStack.layoutHorizontally();

    // Get last update time
    const timeFormatter = new DateFormatter();
    timeFormatter.locale = "da";
    timeFormatter.useNoDateStyle();
    timeFormatter.useShortTimeStyle();

    const dateTextLine = topStack.addText(`PS5 STOCK ${timeFormatter.string(new Date())}`);
    dateTextLine.textColor = new Color("#FFFFFF")
    dateTextLine.font = new Font('Menlo-Bold', DATE_TEXT_SIZE);
    topStack.addSpacer(TITLE_TEXT_SPACING);

    // Horizontal spacer under date string
    stack.addSpacer(DATE_TEXT_SPACING);

    var merge = [];
    for (var item in data) {
        const storeIndex = merge.findIndex(vendor => vendor.store === data[item].store);

        if (storeIndex != -1) {
            merge[storeIndex].products.push({
                label: data[item].product_name,
                stock: data[item].stock,
            })
        } else {
            var chunk = {
                store: data[item].store,
                products: [{
                    label: data[item].product_name,
                    stock: data[item].stock,
                }]
            }
            merge.push(chunk);
        }
    }

    // Main bottom stack
    // Data will be added column by column
    const bottomStack = stack.addStack();
    bottomStack.layoutHorizontally();

    // Field label column
    addColumnToStack(bottomStack, [{ value: '' }]
        .concat(merge
            .map(field => ({
                value: field.store,
                color: COLOR_CONFIG["WHITE"].color,
            }))));

    bottomStack.addSpacer(VERTICAL_TEXT_SPACING);
    
    // Get types
    var types = ["Digital", "Standard"];

    // One column per type
    types.forEach(type => {
        const columnData = [];

        // First cell: date label
        columnData.push({
            value: type,
            isBold: true,
            align: 'center',
        });

        merge.forEach(vendor => {
            vendor.products.forEach(product => {
                if (product.label == type && vendor.store != "") {
                    columnData.push({
                        value: product.stock == "På lager" ? '✅' : '❌', 
                        isBold: true,
                        align: 'center'
                    });
                }
            })
        })

        addColumnToStack(bottomStack, columnData);
        bottomStack.addSpacer(VERTICAL_DATA_GRID_SPACING);
    });

    // Vertical spacing between data grid column and completion percentage
    bottomStack.addSpacer(VERTICAL_TEXT_SPACING);
    return widget;
}

function addColumnToStack(stack, columnData) {
    // console.log(`columnData: ${JSON.stringify(columnData)}`);
    const column = stack.addStack();
    column.layoutVertically();
    column.spacing = VERTICAL_TEXT_SPACING;
    columnData.forEach(cd => addCellToColumn(column, cd));
}

function addCellToColumn(column, data) {
    const cell = column.addStack();
    cell.layoutVertically();
    addTextToStack(cell, data);
}

function addTextToStack(stack, data) {
    // console.log(`addTextToStack, data: ${JSON.stringify(data)}`);
    const { value, color, isBold, align } = data;

    const textLine = stack.addText(value);

    textLine.font = new Font(`Menlo${isBold ? '-Bold' : ''}`, TEXT_SIZE);

    if (color) {
        textLine.textColor = new Color(color);
    }

    if (align === 'center') {
        textLine.centerAlignText();
    } else if (align === 'right') {
        textLine.rightAlignText();
    } else {
        textLine.leftAlignText();
    }
}

const stock = await getStock();
var data = Object.keys(stock).map((key) => stock[key]);

// Create widget with data
const widget = createWidget(data);

// Set widget
// Script.setWidget(widget);
widget.presentLarge()
Script.complete();