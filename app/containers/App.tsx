import { GlobalActions } from 'actions'
import { launchSiad, siad, setGlobalSiadProcess, getGlobalSiadProcess } from 'api/siad'
import { ChildProcess } from 'child_process'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import { ipcRenderer } from 'electron'

import MetropolisBold from '../assets/fonts/Metropolis-Bold.otf'
import MetropolisMedium from '../assets/fonts/Metropolis-Medium.otf'
import MetropolisRegular from '../assets/fonts/Metropolis-Regular.ttf'
import { themeGet } from 'styled-system'

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Metropolis";
    src: url('${MetropolisRegular}');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Metropolis";
    src: url('${MetropolisMedium}');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: "Metropolis";
    src: url('${MetropolisBold}');
    font-weight: 800;
    font-style: normal;
  }

    /* total width */
  ::-webkit-scrollbar {
      background-color:${themeGet('colors.scrollbar-bg')};
      width:16px
  }

  /* background of the scrollbar except button or resizer */
  ::-webkit-scrollbar-track {
      background-color:${themeGet('colors.scrollbar-bg')};
  }

  /* scrollbar itself */
  ::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:4px solid ${themeGet('colors.scrollbar-bg')};
  }

  /* set button(top and bottom of the scrollbar) */
  ::-webkit-scrollbar-button {display:none}
  ::-webkit-scrollbar {     
        background-color: #fff;
        width: .8em
  }

  /* set tooltip styling */
  .ant-tooltip-inner{
    background: ${themeGet('colors.tooltip-bg')} !important;
    color: ${themeGet('colors.tooltip-text')} !important;
  }
  .ant-tooltip-placement-leftTop .ant-tooltip-arrow {
    border-left-color: ${themeGet('colors.tooltip-bg')} !important;
  }
  .ant-tooltip-placement-bottom .ant-tooltip-arrow {
    border-bottom-color: ${themeGet('colors.tooltip-bg')} !important;
  }
  .ant-tooltip-placement-right .ant-tooltip-arrow {
    border-right-color: ${themeGet('colors.tooltip-bg')} !important;
  }
  .ant-tooltip-placement-left .ant-tooltip-arrow {
    border-left-color: ${themeGet('colors.tooltip-bg')} !important;
  }

  /* Notification */
  & .ant-notification-notice {
    background: ${themeGet('colors.notify-bg')} !important;
  }
  .ant-notification-notice-message, .ant-notification-notice-description, .ant-notification-notice-close {
    color: ${themeGet('colors.text')} !important;
  }

  /* Modal */
  .ant-modal-content {
    background: ${themeGet('colors.white')} !important;
  }

  .ant-modal-confirm-content, .ant-modal-confirm-title {
    color: ${themeGet('colors.text')} !important;
  }

  .ant-modal-confirm-warning .ant-modal-confirm-body > .anticon, .ant-modal-confirm-confirm .ant-modal-confirm-body > .anticon {
    color: ${themeGet('colors.sia-green')} !important;
  }

  /* Dropdown */
  .ant-dropdown-menu-item-divider {
    background: ${themeGet('colors.dropdown-border')} !important;
  }
  .ant-dropdown-menu {
    background: ${themeGet('colors.dropdown-bg')} !important;
  }
  .ant-dropdown-menu-item:hover {
      background: ${themeGet('colors.dropdown-bg')} !important;
  }
  .ant-dropdown-menu-item > a, .ant-dropdown-menu-submenu-title > a {
    color: ${themeGet('colors.text')} !important;
    &:hover {
      color: ${themeGet('colors.text-subdued')} !important;
    }
  }
  .ant-dropdown-menu-item {
    color: ${themeGet('colors.text')} !important;

  }
  .ant-table-filter-dropdown-btns {
    background: ${themeGet('colors.dropdown-bg')} !important;
    border-top-color: ${themeGet('colors.dropdown-border')} !important;
  }
  .ant-btn[disabled] {
    background: ${themeGet('colors.dropdown-bg', 'initial')} !important;
    border: ${themeGet('colors.dropdown-border', 'initial')} !important;
    color: ${themeGet('colors.text-subdued')} !important;
  }
`

ipcRenderer.on('shutdown-siad', async () => {
  const globalSiadProcess = getGlobalSiadProcess()
  if (globalSiadProcess) {
    await siad.daemonStop()

    let counter = 0
    // start a counter loop to test if Sia is still running.
    setInterval(() => {
      // if counter reaches 10 seconds, kill the process
      if (counter > 19) {
        globalSiadProcess.kill()
        ipcRenderer.send('shutdown-app', true)
      }
      // otherwise check to see if it's still running. if it is not running
      // anymore, then we can safely shutdown the app.
      if (!siad.isRunning()) {
        ipcRenderer.send('shutdown-app', true)
      }
      counter += 1
    }, 500)
  } else {
    ipcRenderer.send('shutdown-app', true)
  }
})

class App extends React.Component<DispatchProp> {
  componentDidMount = async () => {
    const { dispatch } = this.props
    const isRunning = await siad.isRunning()
    dispatch(GlobalActions.startPolling())
    // If not running, we'll try to launch siad ourselves
    setTimeout(async () => {
      if (!isRunning) {
        dispatch(GlobalActions.siadLoading())
        try {
          const loadedProcess: any = await launchSiad()
          if (loadedProcess) {
            setGlobalSiadProcess(loadedProcess)
            dispatch(GlobalActions.setSiadOrigin({ isInternal: true }))
            dispatch(GlobalActions.siadLoaded())
          } else {
            dispatch(GlobalActions.siadOffline())
          }
        } catch (e) {
          dispatch(GlobalActions.siadOffline())
          GlobalActions.notification({
            type: 'open',
            title: 'Daemon Initialization Error',
            message: e.toString()
          })
        }
      } else {
        dispatch(GlobalActions.setSiadOrigin({ isInternal: false }))
        dispatch(GlobalActions.siadLoaded())
      }
    }, 3000)
  }
  render() {
    return (
      <React.Fragment>
        <div>{this.props.children}</div>
      </React.Fragment>
    )
  }
}

export default connect()(App)
