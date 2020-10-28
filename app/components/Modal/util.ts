import defaultConfig from 'config'
import * as path from 'path'

let pty: any;

try {
  pty = require('electron').remote.require('node-pty-prebuilt-multiarch')
} catch(e) {
  console.log('Require Pty Err: ' , e)
}

// const pty = require('electron').remote.require('node-pty-prebuilt-multiarch')

const isWindows = process.platform === 'win32'

// find the dirname for siac instead of the direct binary path
const siacBasePath = path.dirname(defaultConfig.siac.path)

// use the bin name (usually siac), but can be set in the config.json file
const siacBinName = isWindows
  ? defaultConfig.siac.path
  : `./${path.basename(defaultConfig.siac.path)}`

export const createShell = (command = '') => {
  let args = command.split(' ')
  if (args[0] === 'spc' || args[0] === './spc' || args[0] === './spc.exe') {
    args = [...args.splice(1)]
  }
  var term = pty.spawn(siacBinName, args, {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    // use base path as cwd so arv0 is siac
    cwd: siacBasePath,
    env: process.env
  })

  term.pause()
  return term
}
