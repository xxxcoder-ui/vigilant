import fs from 'graceful-fs'
import Path from 'path'
import { app } from 'electron'
import { version } from '../../package.json'
import semver from 'semver'

const defaultSpdPath = Path.join(
  __dirname,
  '../SiaPrime/' + (process.platform === 'win32' ? 'spd.exe' : 'spd')
)

// The default settings
const defaultConfig = {
  homePlugin: 'Overview',
  spd: {
    path: defaultSpdPath,
    datadir: Path.join(app.getPath('userData'), './siaprime'),
    rpcaddr: ':4281',
    hostaddr: ':4282',
    detached: false,
    address: '127.0.0.1:4280'
  },
  closeToTray: Boolean(
    process.platform === 'win32' || process.platform === 'darwin'
  ),
  width: 1024,
  height: 768,
  x: 100,
  y: 100,
  version: version
}

/**
 * Holds all config.json related logic
 * @module configManager
 */
export default function configManager (filepath) {
  let config

  try {
    const data = fs.readFileSync(filepath)
    config = JSON.parse(data)
  } catch (err) {
    config = defaultConfig
  }

  // always use the default siad path after an upgrade
  if (typeof config.version === 'undefined') {
    config.version = version
    config.spd.path = defaultSpdPath
  } else if (semver.lt(config.version, version)) {
    config.version = version
    config.spd.path = defaultSpdPath
  }

  // fill out default values if config is incomplete
  config = Object.assign(defaultConfig, config)

  /**
   * Gets or sets a config attribute
   * @param {object} key - key to get or set
   * @param {object} value - value to set config[key] as
   */
  config.attr = function (key, value) {
    if (value !== undefined) {
      config[key] = value
    }
    if (config[key] === undefined) {
      config[key] = null
    }
    return config[key]
  }

  /**
   * Writes the current config to defaultConfigPath
   * @param {string} path - UI's defaultConfigPath
   */
  config.save = function () {
    fs.writeFileSync(filepath, JSON.stringify(config, null, '\t'))
  }

  /**
   * Sets config to what it was on disk
   */
  config.reset = function () {
    config = configManager(filepath)
  }

  // expose the default siad path
  config.defaultSpdPath = defaultSpdPath

  // Save to disk immediately when loaded
  try {
    config.save()
  } catch (err) {
    console.error('couldnt save config.json: ' + err.toString())
  }

  // Return the config object with the above 3 member functions
  return config
}
