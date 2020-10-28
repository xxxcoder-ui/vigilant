import { WalletActions } from 'actions'
import { Bar, HeaderBox } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { HeaderButton } from 'components/atoms/HeaderButton'
import { AboutModal, TerminalModal } from 'components/Modal'
import { SettingsModal } from 'components/Modal/Settings'
import SynchronizeStatus from 'components/SynchronizeStatus'
import { ConsensusModel } from 'models'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectConsensus } from 'selectors'

interface StateProps {
  consensus: ConsensusModel.ConsensusGETResponse
}

class AppHeader extends React.Component<StateProps & DispatchProp, {}> {
  state = { visible: false, terminalVisible: false, settingVisible: false }
  lockWallet = () => {
    this.props.dispatch(WalletActions.lockWallet.started())
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  showTerminalModal = () => {
    this.setState({
      terminalVisible: true
    })
  }

  showSettingsModal = () => {
    this.setState({
      settingVisible: true
    })
  }

  handleOk = () => {
    this.setState({
      visible: false
    })
  }
  handleTerminalOk = () => {
    this.setState({
      terminalVisible: false
    })
  }
  handleSettingOk = () => {
    this.setState({
      settingVisible: false
    })
  }
  render() {
    const { consensus } = this.props
    return (
      <React.Fragment>
        <HeaderBox px={3} height={2} justifyContent="space-between" alignItems="center">
          <Flex justifyContent="center" alignItems="center">
            <HeaderButton
              handleClick={this.lockWallet}
              iconType="lock"
              tooltipTitle="Lock"
            />
            <Bar />
            <HeaderButton
              handleClick={this.showModal}
              iconType="info-circle"
              tooltipTitle="About"
            />
            <Bar />
            <HeaderButton
              handleClick={this.showTerminalModal}
              iconType="right-square"
              tooltipTitle="Terminal"
            />
            <Bar />
            <HeaderButton
              handleClick={this.showSettingsModal}
              iconType="setting"
              tooltipTitle="Settings"
            />
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <SynchronizeStatus {...consensus} />
          </Flex>
        </HeaderBox>
        <AboutModal visible={this.state.visible} onOk={this.handleOk} />
        <TerminalModal visible={this.state.terminalVisible} onOk={this.handleTerminalOk} />
        <SettingsModal visible={this.state.settingVisible} onOk={this.handleSettingOk} />
      </React.Fragment>
    )
  }
}
const mapStateToProps = createStructuredSelector({
  consensus: selectConsensus
})

export default connect(mapStateToProps)(AppHeader)
