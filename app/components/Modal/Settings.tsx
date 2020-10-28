import { Button, Modal, Switch, Divider, Card } from 'antd'
import Wordmark from 'assets/svg/draco.svg'
import { Box, SVGBox, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import defaultConfig from 'config'
import { shell, remote, ipcRenderer } from 'electron'
import * as React from 'react'
import { TextInput } from 'components/Forms/Inputs'
import { merge } from 'lodash'
import { StyledModal } from 'components/atoms/StyledModal'
import { StyledCard } from 'components/atoms/StyledCard'
import { useSiadUIState } from 'hooks/reduxHooks'
import { getGlobalSiadProcess, siad } from 'api/siad'
const { app, getCurrentWindow } = remote
const fs = remote.require('fs')
const child_process = require('child_process')

interface SettingModalprops {
  visible: boolean
  onOk?(): void
}

const SettingItem = ({ title, render }) => {
  return (
    <Box px={4} height={60}>
      <Flex height="100%" alignItems="center">
        <Box width={1 / 3}>
          <Text fontSize={2}>{title}</Text>
        </Box>
        <Box width={2 / 3} ml="auto">
          {render}
        </Box>
      </Flex>
    </Box>
  )
}

export const SettingsModal: React.SFC<SettingModalprops> = ({ onOk, visible }) => {
  const [config, setConfig] = React.useState(defaultConfig)
  const onReset = React.useCallback(() => {
    setConfig(defaultConfig)
  }, [defaultConfig])

  const siadState = useSiadUIState()
  const onSave = React.useCallback(() => {
    const newConfig = merge(defaultConfig, config)
    try {
      fs.writeFileSync(defaultConfig.userConfigPath, JSON.stringify(newConfig, null, 4))

      if (process.env.NODE_ENV === 'development') {
        getCurrentWindow().reload()
      } else {
        if (!process.env.APPIMAGE) {
          const globalSiadProcess = getGlobalSiadProcess()
          if (globalSiadProcess) {
            siad.daemonStop()
            let counter = 0
            // start a counter loop to test if Sia is still running.
            setInterval(() => {
              // if counter reaches 10 seconds, kill the process
              if (counter > 19) {
                globalSiadProcess.kill()
                app.relaunch()
                app.exit(0)
              }
              // otherwise check to see if it's still running. if it is not running
              // anymore, then we can safely shutdown the app.
              if (!siad.isRunning()) {
                app.relaunch()
                app.exit(0)
              }
              counter += 1
            }, 100)
          } else {
            app.relaunch()
            app.exit(0)
          }
        } else {
          // https://github.com/electron-userland/electron-builder/issues/1727
          // Since AppImage doesn't work with relaunch due to its tmp mounting,
          // we are opting to use some bash magic to help relaunch Sia-UI when
          // settings are udpated.
          // This process works by sending a safe shutdown request to the main
          // process, which triggers a shutdown of siad and subsequently the UI.
          // The child process watches for the complete shutdown of the UI,
          // before starting up an instance of itself again.
          const currentFile = process.env.APPIMAGE
          if (currentFile) {
            const currentFileEsc = currentFile.replace(/'/g, "'\\''")
            const cmd = `( exec '${currentFileEsc}' ) & disown $!`
            child_process.spawn(
              '/bin/bash',
              ['-c', `while ps ${process.pid} >/dev/null 2>&1; do sleep 0.1; done; ${cmd}`],
              { detached: true }
            )
            ipcRenderer.send('force-quit-request')
          }
        }
      }
    } catch (err) {}
    if (onOk) {
      onOk()
    }
  }, [defaultConfig, config])

  return (
    <div>
      <StyledModal
        bodyStyle={{
          padding: 0
        }}
        title="ScPrime-UI Settings"
        visible={visible}
        onOk={onOk}
        onCancel={onOk}
        closable={true}
        footer={[
          <Button key="reset" type="dashed" onClick={onReset}>
            Reset
          </Button>,
          <Button key="save" type="primary" onClick={onSave}>
            Save
          </Button>
        ]}
      >
        {!siadState.isInternal && (
          <Box>
            <StyledCard bordered={false}>
              Please note that you are currently using an external instance of ScPrime and some
              of these settings may not apply.
            </StyledCard>
          </Box>
        )}
        <Box overflow="auto" py={2}>
          <SettingItem
            title="Dark Mode"
            render={
              <Switch
                checked={config.darkMode}
                onChange={c => setConfig({ ...config, darkMode: c })}
              />
            }
          />
          <SettingItem
            title="Debug Mode"
            render={
              <Switch
                checked={config.debugMode}
                onChange={c => setConfig({ ...config, debugMode: c })}
              />
            }
          />
          <SettingItem
            title="Data Directory"
            render={
              <TextInput
                id="consensusPath"
                value={config.siad.datadir}
                onChange={e =>
                  setConfig({ ...config, siad: { ...config.siad, datadir: e.target.value } })
                }
              />
            }
          />
          <SettingItem
            title="Use Custom spd"
            render={
              <Switch
                checked={config.siad.useCustomBinary}
                onChange={c =>
                  setConfig({ ...config, siad: { ...config.siad, useCustomBinary: c } })
                }
              />
            }
          />
          {config.siad.useCustomBinary && (
            <SettingItem
              title="Daemon Path"
              render={
                <TextInput
                  id="daemonPath"
                  value={config.siad.path}
                  onChange={e =>
                    setConfig({ ...config, siad: { ...config.siad, path: e.target.value } })
                  }
                />
              }
            />
          )}
          <SettingItem
            title="Use Custom spc"
            render={
              <Switch
                checked={config.siac.useCustomBinary}
                onChange={c =>
                  setConfig({ ...config, siac: { ...config.siac, useCustomBinary: c } })
                }
              />
            }
          />
          {config.siac.useCustomBinary && (
            <SettingItem
              title="Client Path"
              render={
                <TextInput
                  id="clientPath"
                  value={config.siac.path}
                  onChange={e =>
                    setConfig({ ...config, siac: { ...config.siac, path: e.target.value } })
                  }
                />
              }
            />
          )}
          <SettingItem
            title="Log Path"
            render={
              <TextInput
                id="logPath"
                value={config.logPath}
                onChange={e => setConfig({ ...config, logPath: e.target.value })}
              />
            }
          />
        </Box>
      </StyledModal>
    </div>
  )
}
