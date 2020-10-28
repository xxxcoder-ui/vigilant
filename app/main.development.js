const { app, BrowserWindow, Menu, shell, Tray, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state')
const defaultConfig = require('./config')
const path = require('path')
const fs = require('fs')

let menu
let template
// tray
let appIcon = null
// main window process
let mainWindow = null
// Useful dynamic env constants
const isDev = process.env.NODE_ENV === 'development'
const isDarwin = process.platform === 'darwin'
const isWindows = process.platform === 'win32'
const isLinux = process.platform === 'linux'

if (isDev) {
  require('electron-debug')() // eslint-disable-line global-require
  const p = path.join(__dirname, '..', 'app', 'node_modules') // eslint-disable-line
  require('module').globalPaths.push(p) // eslint-disable-line
}

app.on('window-all-closed', () => {
  app.quit()
})

const installExtensions = () => {
  if (isDev) {
    const installer = require('electron-devtools-installer') // eslint-disable-line global-require
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)))
  }

  return Promise.resolve([])
}

const windowConfig = isDarwin
  ? {
      frame: false,
      titleBarStyle: 'hiddenInset'
    }
  : {}

app.on('ready', () =>
  installExtensions().then(() => {
    // Keep the window state for app relaunch
    let mainWindowState = windowStateKeeper({
      defaultWidth: 1200,
      defaultHeight: 780
    })
    // Setup the browser window and create the app
    const browserWindowConfig = Object.assign({}, windowConfig, {
      show: false,
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      autoHideMenuBar: true,
      title: 'ScPrime Wallet'
      // skipTaskbar: true
    })
    mainWindow = new BrowserWindow(browserWindowConfig)
    mainWindowState.manage(mainWindow)

    ipcMain.on('shutdown-app', () => {
      mainWindow.siadShutdown = true
      app.quit()
    })

    // renderer can send a quit request that allows the main process to safely
    // shutdown.
    ipcMain.on('force-quit-request', () => {
      mainWindow.isQuitting = true
      app.quit()
    })

    mainWindow.on('close', e => {
      // if isQuitting not set to true, minimize to system tray.
      if (!mainWindow.isQuitting) {
        e.preventDefault()
        if (isDarwin) {
          app.dock.hide()
        }
        mainWindow.hide()
        return false
        // if siad is shutdown, this flag will be true. we can quit safely.
      } else if (mainWindow.siadShutdown) {
        return true
        // we can't quit yet, siad is not shutdown. send an ipc event to
        // renderer so the shutdown process can start.
      } else {
        e.preventDefault()
        mainWindow.webContents.send('shutdown-siad', true)
      }
    })

    // Setup close to tray settings for both minimize and close events.
    mainWindow.on('minimize', e => {
      // Hide the icon from the Mac Dock. Darwin specific feature.
      if (isDarwin) {
        app.dock.hide()
      }
      // https://electronjs.org/docs/api/tray Linux limitations, so we'll just
      // minimize instead of attempting to go to system tray.
      if (isLinux) {
        return true
      }
      mainWindow.hide()
      return false
    })

    mainWindow.loadURL(`file://${__dirname}/app.html`)

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.show()
      mainWindow.focus()
    })

    const iconName = isDarwin ? 'trayTemplate.png' : 'trayWin.png'
    const iconPath = isDev
      ? path.join(process.cwd(), 'tray', iconName)
      : path.join(process.resourcesPath, 'tray', iconName)

    appIcon = new Tray(iconPath)
    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: function() {
          if (isDarwin) {
            app.dock.show()
          }
          mainWindow.show()
        }
      },
      {
        label: 'Quit',
        click: function() {
          mainWindow.isQuitting = true
          app.quit()
        }
      }
    ])

    appIcon.on('double-click', () => {
      mainWindow.show()
      mainWindow.focus()
    })

    appIcon.setToolTip('ScPrime-UI syncs the daemon in the background.')
    appIcon.setContextMenu(trayContextMenu)

    if (isDev || defaultConfig.debugMode) {
      mainWindow.openDevTools()
      mainWindow.webContents.on('context-menu', (e, props) => {
        const { x, y } = props

        Menu.buildFromTemplate([
          {
            label: 'Inspect element',
            click() {
              mainWindow.inspectElement(x, y)
            }
          }
        ]).popup(mainWindow)
      })
    }

    if (isDarwin) {
      template = [
        {
          label: 'ScPrime-UI',
          submenu: [
            {
              label: 'About ScPrime-UI',
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
              click() {
                mainWindow.isQuitting = true
                app.quit()
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
          submenu: isDev
            ? [
                {
                  label: 'Reload',
                  accelerator: 'Command+R',
                  click() {
                    mainWindow.webContents.reload()
                  }
                },
                {
                  label: 'Toggle Full Screen',
                  accelerator: 'Ctrl+Command+F',
                  click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen())
                  }
                }
              ]
            : [
                {
                  label: 'Toggle Developer Tools',
                  accelerator: 'Command+Shift+I',
                  click() {
                    mainWindow.toggleDevTools()
                  }
                },
                {
                  label: 'Toggle Full Screen',
                  accelerator: 'Ctrl+Command+F',
                  click() {
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
              click() {
                shell.openExternal('http://electron.atom.io')
              }
            },
            {
              label: 'Documentation',
              click() {
                shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
              }
            },
            {
              label: 'Community Discussions',
              click() {
                shell.openExternal('https://discuss.atom.io/c/electron')
              }
            },
            {
              label: 'Search Issues',
              click() {
                shell.openExternal('https://github.com/atom/electron/issues')
              }
            }
          ]
        }
      ]

      menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
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
              click() {
                mainWindow.close()
              }
            }
          ]
        },
        {
          label: '&View',
          submenu: isDev
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click() {
                    mainWindow.webContents.reload()
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen())
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen())
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click() {
                    mainWindow.toggleDevTools()
                  }
                }
              ]
        },
        {
          label: 'Help',
          submenu: [
            {
              label: 'Learn More',
              click() {
                shell.openExternal('http://electron.atom.io')
              }
            },
            {
              label: 'Documentation',
              click() {
                shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
              }
            },
            {
              label: 'Community Discussions',
              click() {
                shell.openExternal('https://discuss.atom.io/c/electron')
              }
            },
            {
              label: 'Search Issues',
              click() {
                shell.openExternal('https://github.com/atom/electron/issues')
              }
            }
          ]
        }
      ]
      menu = Menu.buildFromTemplate(template)
      mainWindow.setMenu(menu)
    }
  })
)
