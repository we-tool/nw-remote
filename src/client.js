/* global Peer */
const gui = require('nw.gui')
const uuid = require('node-uuid')
const mediaConfig = require('./mediaConfig')
const peerConfig = require('./peerConfig')

const peerId = uuid()
const peer = new Peer(peerId, peerConfig)

peer.on('open', function (id) {
  console.log('peer onOpen', id)
})


btnJoin.addEventListener('click', function () {
  const targetId = txtTargetId.value.trim()
  gui.Window.open(`./remote.html?targetId=${targetId}`, {
    width: 960,
    height: 540,
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
