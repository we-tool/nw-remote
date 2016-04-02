# nw-remote 远程协助

受maxogden大神的[screencat](https://github.com/maxogden/screencat)启发，  
它基于Electron，我基于NW.js创作


## 主要工具/依赖

- [robotjs](https://github.com/octalmage/robotjs)，用于操控鼠标/键盘
- 自行搭建一个[peerjs-server](https://github.com/peers/peerjs-server)，用于WebRTC
- [NW.js](https://github.com/nwjs/nw.js)，用Web写桌面端应用
- [nwjs](https://github.com/egoist/nwjs)，方便的命令行工具


## 开发/运行

```plain
$ npm install -g nwjs
$ nw install 0.12.3
```

```plain
$ cd nw-remote
$ npm install
$ npm run rebuild
$ nw .
```
