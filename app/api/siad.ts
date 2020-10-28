import defaultConfig from 'config'

import { Client } from 'sia-typescript'
import { siadLogger } from 'utils/logger'
import { reduxStore } from 'containers/Root'
import { GlobalActions } from 'actions'
import { ChildProcess } from 'child_process'

export interface SiadConfig {
  path: string
  datadir: string
  rpcaddr: string
  hostaddr: string
  detached: boolean
  address: string
}

export let globalSiadProcess: any = null

export const setGlobalSiadProcess = p => {
  globalSiadProcess = p
}

export const getGlobalSiadProcess = (): ChildProcess => {
  return globalSiadProcess
}

export const siad = new Client({
  dataDirectory: defaultConfig.siad.datadir
})

export const initSiad = () => {
  const p = siad.launch(defaultConfig.siad.path)
  return p
}

export const launchSiad = () => {
  return new Promise((resolve, reject) => {
    const p = initSiad()
    p.stdout.on('data', data => {
      const log = data.toString()
      reduxStore.dispatch(GlobalActions.siadAppendLog(log))
      siadLogger.info(log)
    })
    p.stderr.on('data', data => {
      const log = data.toString()
      reduxStore.dispatch(GlobalActions.siadAppendErr(log))
      siadLogger.error(log)
    })
    const timeout = setTimeout(() => {
      clearInterval(pollLoaded)
      resolve(false)
    }, 20000)
    const pollLoaded = setInterval(() => {
      if (siad.isRunning()) {
        clearInterval(pollLoaded)
        clearInterval(timeout)
        resolve(p)
      }
    }, 2000)
  })
}
