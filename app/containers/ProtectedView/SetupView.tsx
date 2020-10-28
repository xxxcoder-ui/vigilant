import { WalletActions, GlobalActions } from 'actions'
import { Button, Modal } from 'antd'
import { Box, ButtonWithAdornment, DragContiner, Text } from 'components/atoms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter, Redirect } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState, selectWalletSummary, selectSiadState, selectConsensus } from 'selectors'
import { Flex } from 'components/atoms/Flex'
import { WalletModel, ConsensusModel } from 'models'
import { UIReducer } from 'reducers/ui'
import LockScreenHeader from 'components/AppHeader/LockScreenHeader'
import { StyledButtonGroup } from 'components/atoms/StyledButton'

interface StateProps {
  seed: WalletRootReducer.SeedState
  wallet: WalletModel.WalletGET
  siad: UIReducer.SiadState
  consensus: ConsensusModel.ConsensusGETResponse
}

type Props = RouteComponentProps & DispatchProp & StateProps

const confirm = Modal.info

function showConfirm() {
  confirm({
    title: 'Please Wait for ScPrime-UI to Sync',
    content:
      'ScPrime-UI must be fully synced with the network in order to restore your wallet. Sync status is displayed in the upper-right corner.',
    onOk() {}
  })
}

class SetupView extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  routeTo = (path: string) => () => {
    this.props.history.push(path)
  }
  generateWallet = () => {
    const { seed } = this.props
    if (!seed.primaryseed) {
      this.props.dispatch(WalletActions.createNewWallet.started({}))
    }
    this.props.history.push('/onboarding')
  }
  restoreFromSeed = () => {
    this.props.history.push('/restorewallet')
  }
  render() {
    const { wallet, siad, consensus } = this.props
    if (wallet.unlocked) {
      return <Redirect to="/" />
    }
    if (wallet.encrypted) {
      return <Redirect to="/protected" />
    }
    if (!siad.isActive) {
      return <Redirect to="/offline" />
    }
    return (
      <DragContiner>
        <LockScreenHeader />
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          bg="bg"
          height="100vh"
          width="100%"
          p={4}
        >
          <Box>
            <Text color="mid-gray" fontWeight={400} fontSize={6}>
              Welcome to ScPrime
            </Text>
          </Box>
          <Flex width="300px" my={3} style={{ textAlign: 'center' }}>
            <Text fontSize={3} color="mid-gray">
              Would you like to create a new wallet or restore your wallet from a seed?
            </Text>
          </Flex>
          <Box pt={3}>
            <StyledButtonGroup>
              <ButtonWithAdornment
                onClick={this.generateWallet}
                before
                size="large"
                iconType="wallet"
                type="primary"
              >
                Create new wallet
              </ButtonWithAdornment>
              <ButtonWithAdornment
                onClick={consensus.synced ? this.restoreFromSeed : showConfirm}
                size="large"
                after
                iconType="right"
              >
                Restore from seed
              </ButtonWithAdornment>
            </StyledButtonGroup>
          </Box>
        </Flex>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state),
  wallet: selectWalletSummary(state),
  siad: selectSiadState(state),
  consensus: selectConsensus(state)
})

export default connect(mapStateToProps)(withRouter(SetupView))
