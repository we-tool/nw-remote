/* global Peer */
const gui = require('nw.gui')
const uuid = require('node-uuid')
const fixMacMenu = require('./util').fixMacMenu
const peerConfig = require('./util').peerConfig
const isWin32 = require('./util').isWin32

gui.Screen.Init()
gui.Window.get().focus()

const screenId = isWin32 ? 0 : gui.Screen.screens[0].id // random screen
const mediaConfig = {
  audio: false,
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      // chromeMediaSourceId: 'screen:0',
      chromeMediaSourceId: `screen:${screenId}`,
      maxWidth: 1,
      maxHeight: 1,
      maxFrameRate: 1, // minimum
    }
  }
}

const targetId = location.search.match(/[?&]targetId=([\w\-]+)/)[1]
const peerId = uuid()
const peer = new Peer(peerId, peerConfig)
const conn = peer.connect(targetId)

conn.on('open', function () {
  console.log('conn onOpen')
})

txtTargetId.textContent = `TargetId: ${targetId}`

fixMacMenu(gui)


navigator.webkitGetUserMedia(mediaConfig, function (stream) {
  console.log('getUserMedia', stream)
  const call = peer.call(targetId, stream)
  call.on('stream', function (stream) {
    console.log('call onStream', stream)
    const url = URL.createObjectURL(stream)
    vidScreen.src = url
    console.log('video url', url)
  })
}, function (err) {
  console.error('getUserMedia', err)
})


vidScreen.addEventListener('mousedown', function (e) {
  const data = getMouseData(e)
  data.mouse = 'down'
  data.which = e.which
  console.log('conn send', JSON.stringify(data))
  conn.send(data)
})
vidScreen.addEventListener('mouseup', function (e) {
  const data = getMouseData(e)
  data.mouse = 'up'
  data.which = e.which
  console.log('conn send', JSON.stringify(data))
  conn.send(data)
})

function getMouseData(e) {
  const data = {}
  const rect = vidScreen.getBoundingClientRect()
  data.width = rect.width
  data.height = rect.height
  data.x = e.clientX - rect.left
  data.y = e.clientY - rect.top
  return data
}

