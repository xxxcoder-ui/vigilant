import { HeaderBox } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { HeaderButton } from 'components/atoms/HeaderButton'
import { AboutModal } from 'components/Modal'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'

class LoadingScreenHeader extends React.Component<DispatchProp, {}> {
  state = { visible: false, terminalVisible: false }
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    return (
      <React.Fragment>
        <HeaderBox px={3} height={2} justifyContent="flex-end" alignItems="center">
          <Flex justifyContent="center" alignItems="center">
            <HeaderButton
              handleClick={this.showModal}
              iconType="info-circle"
              tooltipTitle="About"
            />
          </Flex>
        </HeaderBox>
        <AboutModal visible={this.state.visible} onOk={this.handleOk} />
      </React.Fragment>
    )
  }
}

export default connect()(LoadingScreenHeader)
