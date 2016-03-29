/* global Peer */
const gui = require('nw.gui')
const uuid = require('node-uuid')
const peerConfig = require('./peerConfig')
const mediaConfig = {
  audio: false,
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      chromeMediaSourceId: 'screen:0',
      maxWidth: 960,
      maxHeight: 540,
      maxFrameRate: 60,
    }
  }
}

const peerId = uuid()
const peer = new Peer(peerId, peerConfig)

peer.on('open', function (id) {
  console.log('peer onOpen', id)
})


btnJoin.addEventListener('click', function () {
  const targetId = txtTargetId.value.trim()
  gui.Window.open(`./remote.html?targetId=${targetId}`, {
    width: 1000,
    height: 600,
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
