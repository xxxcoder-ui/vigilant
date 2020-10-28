import { GlobalActions, WalletActions } from 'actions'
import { Button, Form, Input, Tooltip } from 'antd'
import Wordmark from 'assets/svg/wordmark.svg'
import LockScreenHeader from 'components/AppHeader/LockScreenHeader'
import { Box, defaultFieldState, DragContiner, FormItemProps, SVGBox, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { TransitionFade } from 'components/GSAP/TransitionFade'
import { TransitionSiaOnlySpin } from 'components/GSAP/TransitionSiaSpinner'
import { WalletModel } from 'models'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect } from 'react-router'
import { TransitionGroup } from 'react-transition-group'
import { IndexState } from 'reducers'
import { ConsensusRootReducer } from 'reducers/consensus'
import { UIReducer } from 'reducers/ui'
import { WalletRootReducer } from 'reducers/wallet'
import { selectConsensus, selectSeedState, selectSiadState, selectWalletSummary } from 'selectors'

interface State {
  password: FormItemProps
  setStage: string
  loadingAnimEntered: boolean
}

interface StateProps {
  wallet: WalletModel.WalletGET
  unlockFormHelp: UIReducer.UnlockFormState
  siad: UIReducer.SiadState
  seed: WalletRootReducer.SeedState
  consensus: ConsensusRootReducer.State
}

type Props = StateProps & DispatchProp

class ProtectedView extends React.Component<Props, State> {
  state = {
    password: defaultFieldState,
    setStage: '',
    loadingAnimEntered: false
  }
  componentDidMount() {
    this.props.dispatch(WalletActions.resetForm())
    this.props.dispatch(WalletActions.startPolling())
    this.props.dispatch(GlobalActions.startPolling())
  }
  handleLogin = () => {
    const { password } = this.state
    this.props.dispatch(
      WalletActions.unlockWallet.started({
        encryptionpassword: password.value as any
      })
    )
  }
  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.setState({
      ...this.state.password,
      ...{
        password: {
          value
        }
      }
    } as any)
  }
  handleFinishedLoading = () => {
    const { wallet, consensus } = this.props
    let stage = ''
    if (wallet.unlocked) {
      stage = '/'
    }
    if (wallet.unlocked && !consensus.synced) {
      stage = '/syncing'
    }
    if (wallet.rescanning) {
      stage = '/scanning'
    }
    if (!wallet.encrypted) {
      stage = '/setup'
    }
    this.setState({
      setStage: stage
    })
  }
  toggleLoadingAnimEntered = (v: boolean) => () => {
    this.setState({
      loadingAnimEntered: v
    })
  }

  render() {
    const { wallet, unlockFormHelp, siad, seed, consensus } = this.props
    if (!wallet.encrypted) {
      return <Redirect to="/setup" />
    }
    if (!siad.isActive) {
      return <Redirect to="/offline" />
    }
    if (wallet.rescanning) {
      return <Redirect to="/scanning" />
    }
    if (this.state.setStage) {
      return <Redirect to={this.state.setStage} />
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
        >
          <TransitionGroup>
            {this.state.loadingAnimEntered || unlockFormHelp.loading ? (
              <TransitionFade
                key="loading"
                onEntered={this.toggleLoadingAnimEntered(false)}
                onExited={this.handleFinishedLoading}
              >
                <Box position="fixed" left="45%" top="40%">
                  <Flex justifyContent="center" flexDirection="column" alignItems="center">
                    <TransitionSiaOnlySpin width={100} height={100} in />
                    <Box py={4}>
                      <Text color="mid-gray">Logging In</Text>
                    </Box>
                  </Flex>
                </Box>
              </TransitionFade>
            ) : (
              !wallet.unlocked && (
                <TransitionFade onExiting={this.toggleLoadingAnimEntered(true)} key="form">
                  <Flex width="300px" pt={3} flexDirection="column">
                    <Flex justifyContent="center" alignItems="center" flexDirection="column" pb={4}>
                      <Flex alignItems="center" justifyContent="center">
                        <SVGBox height="40px">
                          <Wordmark viewBox="0 0 97 58" />
                        </SVGBox>
                      </Flex>
                    </Flex>
                    <Form.Item
                      hasFeedback
                      help={unlockFormHelp.help}
                      validateStatus={unlockFormHelp.validateStatus as any}
                    >
                      <Tooltip
                        placement="left"
                        title="If you are a new user or are restoring from your seed, your password is your seed."
                      >
                        <Input
                          onPressEnter={this.handleLogin}
                          onChange={this.handleInput}
                          placeholder="Enter Your Password or Seed"
                          type="password"
                          name="password"
                          value={this.state.password.value}
                          size="large"
                        />
                      </Tooltip>
                    </Form.Item>
                    <Button onClick={this.handleLogin} type="primary" size="large">
                      Unlock
                    </Button>
                  </Flex>
                </TransitionFade>
              )
            )}
          </TransitionGroup>
        </Flex>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  wallet: selectWalletSummary(state),
  unlockFormHelp: state.ui.unlockForm,
  siad: selectSiadState(state),
  seed: selectSeedState(state),
  consensus: selectConsensus(state)
})

export default connect(mapStateToProps)(ProtectedView)
