// pluginapi.js: ScPrime-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
import * as Siad from '../../js/siaprime.js'
import { remote } from 'electron'
import React from 'react'
import DisabledPlugin from './disabledplugin.js'
import Path from 'path'

const os = require('os')
const dialog = remote.dialog
const mainWindow = remote.getCurrentWindow()
const config = remote.getGlobal('config')
const siadConfig = config.spd
const fs = remote.require('fs')
let disabled = false

const sleep = (ms = 0) => new Promise(r => setTimeout(r, ms))

window.onload = async function () {
  // ReactDOM needs a DOM in order to be imported,
  // but the DOM is not available until the plugin has loaded.
  // therefore, we have to global require it inside the window.onload event.

  /* eslint-disable global-require */
  const ReactDOM = require('react-dom')
  /* eslint-enable global-require */

  let startSiad = () => {}

  const renderSiadCrashlog = () => {
    // load the error log and display it in the disabled plugin
    let errorMsg = 'Spd exited unexpectedly for an unknown reason.'
    try {
      errorMsg = fs.readFileSync(
        Path.join(siadConfig.datadir, 'spd-output.log'),
        { encoding: 'utf-8' }
      )
    } catch (e) {
      console.error('error reading error log: ' + e.toString())
    }

    document.body.innerHTML =
      '<div style="width:100%;height:100%;" id="crashdiv"></div>'
    ReactDOM.render(
      <DisabledPlugin errorMsg={errorMsg} startSiad={startSiad} />,
      document.getElementById('crashdiv')
    )
  }

  startSiad = () => {
    const siadProcess = Siad.launch(siadConfig.path, {
      'siaprime-directory': siadConfig.datadir,
      'rpc-addr': siadConfig.rpcaddr,
      'host-addr': siadConfig.hostaddr,
      'api-addr': siadConfig.address,
      modules: 'cghrtw'
    })
    siadProcess.on('error', renderSiadCrashlog)
    siadProcess.on('close', renderSiadCrashlog)
    siadProcess.on('exit', renderSiadCrashlog)
    window.siadProcess = siadProcess
  }
  // Continuously check (every 2000ms) if siad is running.
  // If siad is not running, disable the plugin by mounting
  // the `DisabledPlugin` component in the DOM's body.
  // If siad is running and the plugin has been disabled,
  // reload the plugin.
  while (true) {
    const running = await Siad.isRunning(siadConfig.address)
    if (running && disabled) {
      disabled = false
      window.location.reload()
    }
    if (!running && !disabled) {
      disabled = true
      renderSiadCrashlog()
    }
    await sleep(2000)
  }
}

// Get the Sia API Password from disk
const getSiaPassword = () => {
  let configPath
  switch (process.platform) {
    case 'win32':
      configPath = Path.join(process.env.LOCALAPPDATA, 'SiaPrime')
      break
    case 'darwin':
      configPath = Path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'SiaPrime'
      )
      break
    default:
      configPath = Path.join(os.homedir(), '.siaprime')
  }
  const pass =
    process.env.SIAPRIME_API_PASSWORD ||
    fs
      .readFileSync(Path.join(configPath, 'apipassword'))
      .toString()
      .trim()

  return pass || ''
}

const defaultPassword = getSiaPassword()

window.SiaAPI = {
  call: function (url, callback) {
    const basicAuth = `:${defaultPassword}@${siadConfig.address}`
    Siad.call(basicAuth, url)
      .then(res => callback(null, res))
      .catch(err => callback(err, null))
  },
  config: config,
  hastingsToSiacoins: Siad.hastingsToSiacoins,
  siacoinsToHastings: Siad.siacoinsToHastings,
  openFile: options => dialog.showOpenDialog(mainWindow, options),
  saveFile: options => dialog.showSaveDialog(mainWindow, options),
  showMessage: options => dialog.showMessageBox(mainWindow, options),
  showError: options => dialog.showErrorBox(options.title, options.content)
}
