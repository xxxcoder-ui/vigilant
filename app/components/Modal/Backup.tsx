import { Button, Icon, Modal } from 'antd'
import { Box, Text } from 'components/atoms'
import { RequireSeedData } from 'components/RequireData'
import { clipboard } from 'electron'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'
import { StyledModal } from 'components/atoms/StyledModal'
import { StyledButton } from 'components/atoms/StyledButton'

interface AboutModalProps {
  visible: boolean
  onOk?(): void
}

interface StateProps {
  seed: WalletRootReducer.SeedState
}

class BM extends React.Component<AboutModalProps & StateProps & DispatchProp, {}> {
  handleCopy = () => {
    clipboard.writeText(this.props.seed.primaryseed)
    if (this.props.onOk) {
      this.props.onOk()
    }
  }
  render() {
    return (
      <div>
        <RequireSeedData>
          <StyledModal
            title="Seed Backup"
            visible={this.props.visible}
            onCancel={this.props.onOk}
            onOk={this.props.onOk}
            footer={[
              <Button key="copy" type="dashed" onClick={this.handleCopy}>
                <Icon type="copy" />
              </Button>,
              <StyledButton key="submit" type="default" onClick={this.props.onOk}>
                OK
              </StyledButton>
            ]}
          >
            <Flex>
              <Box>
                <Text>{this.props.seed.primaryseed}</Text>
              </Box>
            </Flex>
          </StyledModal>
        </RequireSeedData>
      </div>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state)
})

export const BackupModel = connect(mapStateToProps)(BM)
