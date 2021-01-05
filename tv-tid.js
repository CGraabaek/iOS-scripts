/**
 * https://talk.automators.fm/uploads/default/original/2X/8/84d8fc39e630e12b0492eae7ddc4118fe6910b96.jpeg 
 * https://talk.automators.fm/t/widget-examples/7994/124
 * */

let date = new Date()
let y = ""+date.getFullYear()
let m = ""+(date.getMonth() + 1)
let d = ""+date.getDate()
let dateStr = y+"-"+zeroPrefix(m)+"-"+zeroPrefix(d)
let siriArgs = args.siriShortcutArguments
let channelId = siriArgs.channel
let channelIds = []
if (channelId != null) {
  channelIds = [channelId]
} else {
  channelIds = [
    "1", // DR1
    "3", // TV2
    "2", // DR2
    "10155" // DR3
  ]
}
let channels = channelIds
  .map(e => "ch="+e)
  .join("&")
  let baseURL = "https://tvtid-api.api.tv2.dk/api/tvtid/v1/epg/dayviews"
let url = baseURL+"/"+dateStr+"?"+channels
let r = new Request(url)
let json = await r.loadJSON()
var s = {}
for (channel of json) {
  let id = channel["id"]
  let prgs = channel["programs"]
  let prg = prgs.find(filterProgram)
  s[id] = prg
}

// let widget = createWidget(s)
// await widget.presentMedium()

if (config.runsWithSiri) {
  let table = prettySchedule(s)
  table.present()
  if (channelId != null) {
    let prg = s[channelId]
    let title = prg.title
    Speech.speak(
      "There's currently \""
      + title + "\" on "
      + channelTitle(channelId) + ".")
  } else {
    Speech.speak("Here's what's currently on TV.")
  }
} else if (config.runsInWidget) {
  let widget = createWidget(s)
  Script.setWidget(widget)
  Script.complete()
} else {
  let table = prettySchedule(s)
  await table.present()
}

function createWidget(s) {
  log(Object.keys(s))
  let channelIds = Object.keys(s)
  let g = new LinearGradient()
  g.locations = [0, 1]
  g.colors = [
    new Color("#081040"),
    new Color("#0a1860")
  ]
  let w = new ListWidget()
  w.backgroundGradient = g
  w.setPadding(0, 15, 0, 15)
  let l = channelIds.length
  for (var i = 0; i < l; i++) {
    let id = channelIds[i]
    let prg = s[id]
    if (prg) {
      let subtitle = ""
        + formattedTime(prg["start"])
        + " - "
        + formattedTime(prg["stop"])
      let title = prg["title"]
      let image = channelImage(id)
      let titleStack = w.addStack()
      titleStack.layoutHorizontally()
      titleStack.centerAlignContent()
      if (image != null) {
        let wimage = titleStack.addImage(image)
        wimage.imageSize = new Size(41, 13)
        titleStack.addSpacer(5)
      }
      let wtitle = titleStack.addText(title)
      wtitle.font = Font.mediumSystemFont(15)
      wtitle.textOpacity = 1
      wtitle.textColor = Color.white()
      wtitle.lineLimit = 1
      w.addSpacer(2)
      let wsubtitle = w.addText(subtitle)
      wsubtitle.font = Font.regularSystemFont(13)
      wsubtitle.textOpacity = 0.7
      wsubtitle.textColor = Color.white()
    } else {
      // Channel isn't showing anything
      let title = channelTitle(id)
      let wtitle = w.addText(title)
      wtitle.textSize = 13
      wtitle.textOpacity = 0.7
      wtitle.textColor = Color.white()
      let wsubtitle = w.addText("😴")
      wsubtitle.textSize = 15
    }
    if (i < l - 1) {
      w.addSpacer(10)
    }
  }
  return w
}

function prettySchedule(s) {
  let table = new UITable()
  let channelIds = Object.keys(s)
  let l = channelIds.length
  for (var i = 0; i < l; i++) {
    let row = new UITableRow()
    let id = channelIds[i]
    let prg = s[id]
    let channelCell = row.addText(channelTitle(id))
    let titleCell
    let timeCell
    if (prg) {
      titleCell = row.addText(prg["title"])
      timeCell = row.addText(formattedTime(prg["start"]))
    } else {
      // Channel isn't showing anything
      titleCell = row.addText("😴")
      timeCell = row.addText("")
    }
    channelCell.widthWeight = 15
    titleCell.widthWeight = 70
    timeCell.widthWeight = 15
    table.addRow(row)
  }
  return table
}

function formattedTime(t) {
  let d = new Date(t * 1000)
  return ""
    + zeroPrefix(d.getHours().toString())
    + ":"
    + zeroPrefix(d.getMinutes().toString())
}

function channelTitle(id) {
  if (id == 1) {
    return "DR1"
  } else if (id == 2) {
    return "DR2"
  } else if (id == 3) {
    return "TV 2"
  } else if (id == 10155) {
    return "DR3"
  } else {
    return "UNKNOWN"
  }
}

function channelImage(id) {
  let imageName = channelImageName(id)
  let fm = FileManager.iCloud()
  let dir = fm.documentsDirectory()
  let filePath = fm.joinPath(dir, "imgs/channels/" + imageName)
  return fm.readImage(filePath)
}

function channelImageName(id) {
  if (id == 1) {
    return "dr1.png"
  } else if (id == 2) {
    return "dr2.png"
  } else if (id == 3) {
    return "tv2.png"
  } else if (id == 10155) {
    return "dr3.png"
  } else {
    return null
  }
}

function filterProgram(prg) {
  let time = new Date().getTime() / 1000
  let start = prg["start"]
  let stop = prg["stop"]
  return time >= start && time <= stop
}

function zeroPrefix(str) {
  if (str.length == 1) {
    return "0"+str
  } else {
    return str
  }
}