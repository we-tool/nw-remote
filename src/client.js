/* global Peer */
const gui = require('nw.gui')
const robot = require('robotjs')
const uuid = require('node-uuid')
const fixMacMenu = require('./util').fixMacMenu
const peerConfig = require('./util').peerConfig

gui.Screen.Init()
gui.Window.get().focus()

const mediaConfig = {
  audio: false,
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      // fixme: multi-screen chooseDesktopMedia
      // https://github.com/nwjs/nw.js/wiki/Screen#screenchoosedesktopmedia-array-of-desktopcapturesourcetype-sources-function-callback
      // chromeMediaSourceId: 'screen:0',
      chromeMediaSourceId: `screen:${gui.Screen.screens[0].id}`,
      maxWidth: 960,
      maxHeight: 540,
      maxFrameRate: 60,
    }
  }
}

gui.Window.get().on('closed', function () {
  gui.App.quit()
})

fixMacMenu(gui)


const peerId = uuid()
const peer = new Peer(peerId, peerConfig)

peer.on('open', function (id) {
  console.log('peer onOpen', id)
})

peer.on('connection', function (conn) {
  conn.on('open', function () {
    console.log('conn onOpen')
  })

  conn.on('data', function (data) {
    console.log('conn onData', data)
    if (data.mouse) {
      // 仅适用于"全屏"桌面分享
      const x = Math.round(data.x / data.width * screen.width)
      const y = Math.round(data.y / data.height * screen.height)
      const button = { '1': 'left', '2': 'middle', '3': 'right' }[data.which]
      robot.moveMouse(x, y)
      robot.mouseToggle(data.mouse, button)
      console.log('robot moveMouse', x, y)
      console.log('robot mouseToggle', data.mouse, button)
    }
  })
})


btnJoin.addEventListener('click', function () {
  const targetId = txtTargetId.value.trim()
  gui.Window.open(`./remote.html?targetId=${targetId}`, {
    width: 1000,
    height: 620,
  })
})

btnShare.addEventListener('click', function () {
  navigator.webkitGetUserMedia(mediaConfig, function (stream) {
    console.log('getUserMedia', stream)
    txtHostId.textContent = `HostId: ${peerId}`
    peer.on('call', function (call) {
      console.log('peer onCall')
      call.answer(stream)
    })
  }, function (err) {
    console.error('getUserMedia', err)
  })
})
