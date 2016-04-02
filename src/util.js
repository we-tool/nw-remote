
exports.isWin32 = process.platform === 'win32'


// https://github.com/peers/peerjs-server
// exports.peerConfig = {
//   host: 'localhost',
//   port: 9000,
// }


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

exports.bindHotkeys = function bindHotkeys(window) {
  window.addEventListener('keydown', function (e) {
    // Cmd/Ctrl+W
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 87) {
      return window.close()
    }
    // Cmd/Ctrl+R
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 82) {
      return window.location.reload()
    }
  })
}
