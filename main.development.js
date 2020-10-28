var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this
        }),
      g
    )
    function verb(n) {
      return function(v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
System.register('config', ['path', 'electron'], function(exports_1, context_1) {
  'use strict'
  var path, electron_1, defaultSiaPath, defaultConfig
  var __moduleName = context_1 && context_1.id
  return {
    setters: [
      function(path_1) {
        path = path_1
      },
      function(electron_1_1) {
        electron_1 = electron_1_1
      }
    ],
    execute: function() {
      // Setup the default path for Siad
      defaultSiaPath = path.join(
        __dirname,
        '../binaries/' + (process.platform === 'win32' ? 'spd.exe' : 'spd')
      )
      // Default config
      exports_1(
        'defaultConfig',
        (defaultConfig = {
          siad: {
            path: defaultSiaPath,
            datadir: path.join(electron_1.app.getPath('userData'), './siaprime'),
            rpcaddr: ':4281',
            hostaddr: ':4282',
            detchaed: false,
            address: '127.0.0.1:4280'
          }
        })
      )
      // export const configManager = {}
    }
  }
})
System.register('utils/siadProcess', ['fs', 'config', 'sia.js'], function(exports_2, context_2) {
  'use strict'
  var _this, fs_1, config_1, Sia, w, siadConfig, checkSiaPath, initSiad, sleep, shutdown
  _this = this
  var __moduleName = context_2 && context_2.id
  return {
    setters: [
      function(fs_1_1) {
        fs_1 = fs_1_1
      },
      function(config_1_1) {
        config_1 = config_1_1
      },
      function(Sia_1) {
        Sia = Sia_1
      }
    ],
    execute: function() {
      w = window
      siadConfig = config_1.defaultConfig.siad
      // checkSiaPath validates config's Sia path.  returns a promise that is
      // resolved with `true` if siadConfig.path exists or `false` if it does not
      // exist.
      checkSiaPath = function() {
        return new Promise(function(resolve) {
          fs_1.stat(siadConfig.path, function(err) {
            if (!err) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      }
      exports_2(
        'initSiad',
        (initSiad = function() {
          return __awaiter(_this, void 0, void 0, function() {
            var running, siadProcess
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  try {
                    fs_1.statSync(siadConfig.datadir)
                  } catch (e) {
                    fs_1.mkdirSync(siadConfig.datadir)
                  }
                  return [4 /*yield*/, Sia.isRunning(siadConfig.address)]
                case 1:
                  running = _a.sent()
                  if (running) {
                    return [2 /*return*/]
                  }
                  return [4 /*yield*/, checkSiaPath()]
                case 2:
                  if (!_a.sent()) {
                    // do nothing but return
                    console.log('siaprime path failed')
                    return [2 /*return*/]
                  }
                  try {
                    siadProcess = Sia.launch(siadConfig.path, {
                      'sia-directory': siadConfig.datadir,
                      'rpc-addr': siadConfig.rpcaddr,
                      'host-addr': siadConfig.hostaddr,
                      'api-addr': siadConfig.address,
                      modules: 'cghrtw'
                    })
                    siadProcess.on('error', function(e) {
                      console.log('spd process err', e)
                    })
                    siadProcess.on('close', function(e) {
                      console.log('spd unexpected close', e)
                    })
                    siadProcess.on('exit', function(e) {
                      console.log('spd unexpected exit', e)
                    })
                    w.siadProcess = siadProcess
                  } catch (e) {
                    console.log('error launching spd ', e)
                  }
                  return [2 /*return*/]
              }
            })
          })
        })
      )
      sleep = function(ms) {
        if (ms === void 0) {
          ms = 0
        }
        return new Promise(function(r) {
          return setTimeout(r, ms)
        })
      }
      exports_2(
        'shutdown',
        (shutdown = function() {
          return __awaiter(_this, void 0, void 0, function() {
            var running
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(typeof w.siadProcess !== 'undefined')) return [3 /*break*/, 3]
                  setTimeout(function() {
                    return w.siadProcess.kill('SIGKILL')
                  }, 15000)
                  Sia.call(siadConfig.address, '/daemon/stop')
                  running = function(pid) {
                    try {
                      process.kill(pid, 0)
                      return true
                    } catch (e) {
                      return false
                    }
                  }
                  _a.label = 1
                case 1:
                  if (!running(w.siadProcess.pid)) return [3 /*break*/, 3]
                  return [4 /*yield*/, sleep(200)]
                case 2:
                  _a.sent()
                  return [3 /*break*/, 1]
                case 3:
                  return [2 /*return*/]
              }
            })
          })
        })
      )
    }
  }
})
System.register('main.development', ['electron', 'utils/siadProcess'], function(
  exports_3,
  context_3
) {
  'use strict'
  var _this, electron_2, siadProcess_1, menu, template, mainWindow, installExtensions
  _this = this
  var __moduleName = context_3 && context_3.id
  return {
    setters: [
      function(electron_2_1) {
        electron_2 = electron_2_1
      },
      function(siadProcess_1_1) {
        siadProcess_1 = siadProcess_1_1
      }
    ],
    execute: function() {
      mainWindow = null
      if (process.env.NODE_ENV === 'production') {
        var sourceMapSupport = require('source-map-support') // eslint-disable-line
        sourceMapSupport.install()
      }
      if (process.env.NODE_ENV === 'development') {
        require('electron-debug')() // eslint-disable-line global-require
        var path = require('path') // eslint-disable-line
        var p = path.join(__dirname, '..', 'app', 'node_modules') // eslint-disable-line
        require('module').globalPaths.push(p) // eslint-disable-line
      }
      electron_2.app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') electron_2.app.quit()
      })
      installExtensions = function() {
        if (process.env.NODE_ENV === 'development') {
          var installer_1 = require('electron-devtools-installer') // eslint-disable-line global-require
          var extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
          var forceDownload_1 = !!process.env.UPGRADE_EXTENSIONS
          return Promise.all(
            extensions.map(function(name) {
              return installer_1['default'](installer_1[name], forceDownload_1)
            })
          )
        }
        return Promise.resolve([])
      }
      electron_2.app.on('ready', function() {
        return installExtensions().then(function() {
          siadProcess_1.initSiad()
          mainWindow = new electron_2.BrowserWindow({
            show: false,
            width: 1150,
            height: 800,
            frame: false,
            titleBarStyle: 'hiddenInset',
            autoHideMenuBar: true
          })
          mainWindow.loadURL('file://' + __dirname + '/app.html')
          mainWindow.webContents.on('did-finish-load', function() {
            mainWindow.show()
            mainWindow.focus()
          })
          mainWindow.on('closed', function() {
            return __awaiter(_this, void 0, void 0, function() {
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4 /*yield*/, siadProcess_1.shutdown()]
                  case 1:
                    _a.sent()
                    mainWindow.destroy()
                    electron_2.app.quit()
                    return [2 /*return*/]
                }
              })
            })
          })
          if (process.env.NODE_ENV === 'development') {
            mainWindow.openDevTools()
            mainWindow.webContents.on('context-menu', function(e, props) {
              var x = props.x,
                y = props.y
              electron_2.Menu.buildFromTemplate([
                {
                  label: 'Inspect element',
                  click: function() {
                    mainWindow.inspectElement(x, y)
                  }
                }
              ]).popup(mainWindow)
            })
          }
          if (process.platform === 'darwin') {
            template = [
              {
                label: 'SiaPrime-UI',
                submenu: [
                  {
                    label: 'About SiaPrime-UI',
                    selector: 'orderFrontStandardAboutPanel:'
                  },
                  {
                    type: 'separator'
                  },
                  {
                    label: 'Services',
                    submenu: []
                  },
                  {
                    type: 'separator'
                  },
                  {
                    label: 'Hide ElectronReact',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                  },
                  {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                  },
                  {
                    label: 'Show All',
                    selector: 'unhideAllApplications:'
                  },
                  {
                    type: 'separator'
                  },
                  {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function() {
                      electron_2.app.quit()
                    }
                  }
                ]
              },
              {
                label: 'Edit',
                submenu: [
                  {
                    label: 'Undo',
                    accelerator: 'Command+Z',
                    selector: 'undo:'
                  },
                  {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:'
                  },
                  {
                    type: 'separator'
                  },
                  {
                    label: 'Cut',
                    accelerator: 'Command+X',
                    selector: 'cut:'
                  },
                  {
                    label: 'Copy',
                    accelerator: 'Command+C',
                    selector: 'copy:'
                  },
                  {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:'
                  },
                  {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:'
                  }
                ]
              },
              {
                label: 'View',
                submenu:
                  process.env.NODE_ENV === 'development'
                    ? [
                        {
                          label: 'Reload',
                          accelerator: 'Command+R',
                          click: function() {
                            mainWindow.webContents.reload()
                          }
                        },
                        {
                          label: 'Toggle Full Screen',
                          accelerator: 'Ctrl+Command+F',
                          click: function() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                          }
                        }
                      ]
                    : [
                        {
                          label: 'Toggle Developer Tools',
                          accelerator: 'Alt+Command+I',
                          click: function() {
                            mainWindow.toggleDevTools()
                          }
                        },
                        {
                          label: 'Toggle Full Screen',
                          accelerator: 'Ctrl+Command+F',
                          click: function() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                          }
                        }
                      ]
              },
              {
                label: 'Window',
                submenu: [
                  {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                  },
                  {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                  },
                  {
                    type: 'separator'
                  },
                  {
                    label: 'Bring All to Front',
                    selector: 'arrangeInFront:'
                  }
                ]
              },
              {
                label: 'Help',
                submenu: [
                  {
                    label: 'Learn More',
                    click: function() {
                      electron_2.shell.openExternal('http://electron.atom.io')
                    }
                  },
                  {
                    label: 'Documentation',
                    click: function() {
                      electron_2.shell.openExternal(
                        'https://github.com/atom/electron/tree/master/docs#readme'
                      )
                    }
                  },
                  {
                    label: 'Community Discussions',
                    click: function() {
                      electron_2.shell.openExternal('https://discuss.atom.io/c/electron')
                    }
                  },
                  {
                    label: 'Search Issues',
                    click: function() {
                      electron_2.shell.openExternal('https://github.com/atom/electron/issues')
                    }
                  }
                ]
              }
            ]
            menu = electron_2.Menu.buildFromTemplate(template)
            electron_2.Menu.setApplicationMenu(menu)
          } else {
            template = [
              {
                label: '&File',
                submenu: [
                  {
                    label: '&Open',
                    accelerator: 'Ctrl+O'
                  },
                  {
                    label: '&Close',
                    accelerator: 'Ctrl+W',
                    click: function() {
                      mainWindow.close()
                    }
                  }
                ]
              },
              {
                label: '&View',
                submenu:
                  process.env.NODE_ENV === 'development'
                    ? [
                        {
                          label: '&Reload',
                          accelerator: 'Ctrl+R',
                          click: function() {
                            mainWindow.webContents.reload()
                          }
                        },
                        {
                          label: 'Toggle &Full Screen',
                          accelerator: 'F11',
                          click: function() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                          }
                        },
                        {
                          label: 'Toggle &Developer Tools',
                          accelerator: 'Alt+Ctrl+I',
                          click: function() {
                            mainWindow.toggleDevTools()
                          }
                        }
                      ]
                    : [
                        {
                          label: 'Toggle &Full Screen',
                          accelerator: 'F11',
                          click: function() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen())
                          }
                        }
                      ]
              },
              {
                label: 'Help',
                submenu: [
                  {
                    label: 'Learn More',
                    click: function() {
                      electron_2.shell.openExternal('http://electron.atom.io')
                    }
                  },
                  {
                    label: 'Documentation',
                    click: function() {
                      electron_2.shell.openExternal(
                        'https://github.com/atom/electron/tree/master/docs#readme'
                      )
                    }
                  },
                  {
                    label: 'Community Discussions',
                    click: function() {
                      electron_2.shell.openExternal('https://discuss.atom.io/c/electron')
                    }
                  },
                  {
                    label: 'Search Issues',
                    click: function() {
                      electron_2.shell.openExternal('https://github.com/atom/electron/issues')
                    }
                  }
                ]
              }
            ]
            menu = electron_2.Menu.buildFromTemplate(template)
            mainWindow.setMenu(menu)
          }
        })
      })
    }
  }
})
