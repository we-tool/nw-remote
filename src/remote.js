/* global Peer */
const gui = require('nw.gui')
const uuid = require('node-uuid')
const fixMacMenu = require('./util').fixMacMenu
const bindHotkeys = require('./util').bindHotkeys
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

const host = location.search.match(/[?&]host=([^&]+)/)[1]
const port = +location.search.match(/[?&]port=([^&]+)/)[1]
const targetId = location.search.match(/[?&]targetId=([^&]+)/)[1]
const peerId = uuid()
const peer = new Peer(peerId, { host: host, port: port })
const conn = peer.connect(targetId)

conn.on('open', function () {
  console.log('conn onOpen')
})

txtHostPort.textContent = `${host}:${port}`
txtTargetId.textContent = `TargetId: ${targetId}`

fixMacMenu(gui)
// bindHotkeys(window) // fixme: 冲突


navigator.webkitGetUserMedia(mediaConfig, function (stream) {
  console.log('getUserMedia', stream)
  const call = peer.call(targetId, stream)

  // fixme: 应付偶发的onStream不触发
  // 原因不明 服务器原因? 5秒自动刷新重试
  const reloadTimer = setTimeout(function () {
    location.reload()
  }, 10000)

  call.on('stream', function (stream) {
    clearTimeout(reloadTimer)
    console.log('call onStream', stream)
    const url = URL.createObjectURL(stream)
    vidScreen.src = url
    console.log('video url', url)
  })
}, function (err) {
  console.error('getUserMedia', err)
})


// vidScreen上监听keydown无效
// vidScreen.addEventListener('mousedown', function (e) {
window.addEventListener('keydown', function (e) {
  const data = {
    keyCode: e.keyCode,
    meta: e.metaKey,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
  }
  console.log('conn send', JSON.stringify(data))
  conn.send(data)
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

