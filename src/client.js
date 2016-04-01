/* global Peer */
'use strict'
const gui = require('nw.gui')
const robot = require('robotjs')
const vkey = require('vkey')
const uuid = require('node-uuid')
const fixMacMenu = require('./util').fixMacMenu
const peerConfig = require('./util').peerConfig

gui.Screen.Init()
gui.Window.get().focus()


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
    console.log('conn onData', JSON.stringify(data))
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
    if (data.keyCode) {
      let k = vkey[data.keyCode].toLowerCase()
      if (k === '<space>') k = ' '
      const modifiers = []
      if (data.meta) modifiers.push('command')
      if (data.ctrl) modifiers.push('control')
      if (data.alt) modifiers.push('alt')
      if (data.shift) modifiers.push('shift')
      if (k[0] !== '<') {
        console.log('typed ' + k + ' ' + JSON.stringify(modifiers))
        if (modifiers[0]) robot.keyTap(k, modifiers[0])
        else robot.keyTap(k)
      } else {
        if (k === '<enter>') robot.keyTap('enter')
        else if (k === '<backspace>') robot.keyTap('backspace')
        else if (k === '<up>') robot.keyTap('up')
        else if (k === '<down>') robot.keyTap('down')
        else if (k === '<left>') robot.keyTap('left')
        else if (k === '<right>') robot.keyTap('right')
        else if (k === '<delete>') robot.keyTap('delete')
        else if (k === '<home>') robot.keyTap('home')
        else if (k === '<end>') robot.keyTap('end')
        else if (k === '<page-up>') robot.keyTap('pageup')
        else if (k === '<page-down>') robot.keyTap('pagedown')
        else console.log('did not type ' + k)
      }
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
  gui.Screen.chooseDesktopMedia(['screen'], function (streamId) {
    console.log('chooseDesktopMedia', streamId)
    const mediaConfig = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          // fixme: multi-screen chooseDesktopMedia
          // https://github.com/nwjs/nw.js/wiki/Screen#screenchoosedesktopmedia-array-of-desktopcapturesourcetype-sources-function-callback
          // chromeMediaSourceId: 'screen:0',
          // chromeMediaSourceId: `screen:${gui.Screen.screens[0].id}`,
          chromeMediaSourceId: streamId,
          maxWidth: 1920, // fixme: 更确切的maxWidth/Height
          maxHeight: 1080,
          maxFrameRate: 60,
        }
      }
    }
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
})
