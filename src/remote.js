/* global Peer */
const uuid = require('node-uuid')
const mediaConfig = require('./mediaConfig')
const peerConfig = require('./peerConfig')

const peerId = uuid()
const peer = new Peer(peerId, peerConfig)

const targetId = location.search.match(/[?&]targetId=([\w\-]+)/)[1]
txtTargetId.textContent = `TargetId: ${targetId}`


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

