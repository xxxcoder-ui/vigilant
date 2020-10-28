import * as React from 'react'
import styled from 'styled-components'
import { FileManager, FileNavigator } from '../vendor/react-filemanager/client'
import connectorNodeV1 from 'sia-opus-connector'
import { Modal } from 'antd'
import { Box } from 'components/atoms'
import { shell } from 'electron'
import { notification } from 'antd'
import { connect } from 'react-redux'
import { IndexState } from 'reducers'
import { GlobalActions } from 'actions'
const { dialog } = require('electron').remote

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  siaClientConfig: {}
}

const ThemedManager = styled(FileManager)`
  border: 0 !important;
  border-radius: 4px !important;
  box-shadow: ${(props: any) => props.theme.boxShadow[0]} !important;
  .oc-fm--list-view__row--selected {
    position: relative;
    background-color: ${props => props.theme.colors['light-gray']} !important;
    color: ${props => props.theme.colors['mid-gray']} !important;
    border-bottom-color: transparent;
  }
`

class fManager extends React.Component {
  poll: any = null
  forceRefresh: any = null
  uploadHandler = uploadType => {
    let paths: any = []
    if (uploadType === 'file') {
      paths = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
      })
    } else {
      paths = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
    }
    connectorNodeV1.emitter.emit('uploadpath', paths)
  }
  downloadHandler = (filename: string) => {
    const paths = dialog.showSaveDialog({
      title: 'Save File As',
      defaultPath: filename
    })
    connectorNodeV1.emitter.emit('downloadpath', paths)
  }
  componentWillReceiveProps(nextProps) {
    // checks if the redux state to request a refresh has changed. if so,
    // attempt a refresh of the filemanager component
    if (nextProps.refreshFileManager && this.forceRefresh) {
      this.forceRefresh()
      this.props.dispatch(GlobalActions.refreshFileManager(false))
    }
  }
  componentWillMount() {
    connectorNodeV1.emitter.on('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.on('downloadrequestpath', this.downloadHandler)
    connectorNodeV1.emitter.on('notification', this.notificationHandler)
    setTimeout(() => {
      connectorNodeV1.emitter.emit('startuploadpoll')
      connectorNodeV1.emitter.emit('startdownloadpoll')
    }, 3000)
    this.poll = setInterval(() => {
      connectorNodeV1.emitter.emit('startuploadpoll')
      connectorNodeV1.emitter.emit('startdownloadpoll')
    }, 10000)
  }
  componentWillUnmount() {
    connectorNodeV1.emitter.removeListener('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.removeListener('downloadrequestpath', this.downloadHandler)
    connectorNodeV1.emitter.removeListener('notification', this.notificationHandler)
    connectorNodeV1.emitter.removeAllListeners()
    clearInterval(this.poll)
  }
  notificationHandler = description => {
    const descriptionString = '' + description
    notification.open({
      message: 'File Manager',
      description: description.error ? description.error.message : descriptionString
    })
  }

  render() {
    return (
      <div style={{ height: 'calc(100vh - 300px)' }}>
        <ThemedManager>
          <FileNavigator
            // this passes the filenav ref back to the parent component so the api
            // is exposed. kind of an anti-pattern, but this will have to do for
            // now.
            forceRefresh={fr => {
              this.forceRefresh = fr
            }}
            id="filemanager-1"
            initialResourceId="root"
            api={connectorNodeV1.api}
            apiOptions={apiOptions}
            capabilities={connectorNodeV1.capabilities}
            listViewLayout={connectorNodeV1.listViewLayout}
            viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
          />
        </ThemedManager>
      </div>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  refreshFileManager: state.ui.refreshFileManager
})

export default connect(mapStateToProps)(fManager)
