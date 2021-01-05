const IMAGE_NAME = "IMAGE_NAME"
const NAME = "NAME"
const URL = "URL"

const actions1 = [
  newAction(
    "Text Gro",
    "whatsapp.png",
    "sms://PHONE-NUMBER"
  ),
  newAction(
    "Inbox",
    "things.PNG",
    "things:///add?show-quick-entry=true&use-clipboard=replace-title"
  )
]
const actions2 = [
  newAction(
    "New Mail",
    "spark.png",
    "readdle-spark://compose"
  ),
  newAction(
    "Hack",
    "slack.png",
    "slack://channel?team=TPK2S68PN&id=CPWLL7J0P"
  )
]

let g = new LinearGradient()
g.locations = [0, 1]
g.colors = [
  new Color("#37474f"),
  new Color("#455a64")
]

let w = new ListWidget()
w.backgroundGradient = g
w.setPadding(0, 10, 0, 10)
w.addSpacer()
addRow(w, actions1)
w.addSpacer()
addRow(w, actions2)
w.addSpacer()
w.presentMedium()

function addRow(w, actions) {
  let s = w.addStack()
  for (let i = 0; i < actions.length; i++) {
    let a = actions[i]
    let image = getImage(a[IMAGE_NAME])
    let name = a[NAME]
    let container = s.addStack()
    container.layoutHorizontally()
    container.centerAlignContent()
    container.url = a[URL]
    container.addSpacer()
    
    let wimg = container.addImage(image)
    wimg.imageSize = new Size(50, 50)
    wimg.cornerRadius = 11
    container.addSpacer(8)

    let wname = container.addText(name)
    wname.font = Font.semiboldRoundedSystemFont(17)
    wname.textColor = Color.white()
    
    if (i < actions.length - 1) {
      container.addSpacer()
    }
    container.addSpacer()
  }
}

function newAction(name, imageName, url) {
  return {
    IMAGE_NAME: imageName,
    NAME: name,
    URL: url
  }
}

function getImage(imageName) {
  let fm = FileManager.iCloud()
  let dir = fm.documentsDirectory()
  let filePath = fm.joinPath(dir, "/imgs/launcher/" + imageName)
  return fm.readImage(filePath)
}