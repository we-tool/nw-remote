
// https://github.com/peers/peerjs-server
exports.peerConfig = {
  host: 'localhost',
  port: 9000,
}


// 解决: Cut/Copy/Paste hotkeys doesn't work on Mac
// https://github.com/nwjs/nw.js/issues/1955
exports.fixMacMenu = function fixMacMenu(gui) {
  if (process.platform === 'darwin') {
    const mb = new gui.Menu({ type: 'menubar' })
    mb.createMacBuiltin('RoboPaint', {
      hideEdit: false,
      hideWindow: true,
    })
    gui.Window.get().menu = mb
  }
}
