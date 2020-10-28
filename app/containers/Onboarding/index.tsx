import { GlobalActions, WalletActions } from 'actions'
import { Button, Steps } from 'antd'
import { Box, DragContiner } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'

import { GenerateSeedView } from './GenerateSeedView'
import { VerifySeedView } from './VerifySeedView'
import { StyledSteps } from 'components/atoms/StyledSteps'
import { StyledButton } from 'components/atoms/StyledButton'

const { Step } = Steps

interface State {
  step: number
  seedCheckValid: boolean
}

interface StateProps {
  seed: WalletRootReducer.SeedState
}

type Props = RouteComponentProps & StateProps & DispatchProp

class Onboarding extends React.Component<Props, State> {
  seedForm: any
  state = {
    step: 0,
    seedCheckValid: false
  }

  nextStep = () => {
    this.setState({
      step: this.state.step += 1
    })
  }
  prevStep = () => {
    this.setState({
      step: this.state.step -= 1
    })
  }
  routeTo = (path: string) => () => {
    this.props.history.push(path)
  }
  done = () => {
    const { seedCheckValid } = this.state
    if (seedCheckValid) {
      // this.props.dispatch(WalletActions.clearSeed())
      this.props.dispatch(
        WalletActions.unlockWallet.started({
          encryptionpassword: this.props.seed.primaryseed
        })
      )
      this.props.dispatch(GlobalActions.startPolling())
      this.props.dispatch(WalletActions.startPolling())
      this.props.history.push('/protected')
    }
  }
  handleSeedCheck = (v: boolean) => {
    this.setState({
      seedCheckValid: v
    })
  }
  render() {
    const { step } = this.state
    const { seed } = this.props
    const { primaryseed } = seed
    // TODO should show loading and error states
    return (
      <DragContiner>
        <Flex
          justifyContent="center"
          flexDirection="column"
          bg="bg"
          height="100vh"
          width="100%"
          p={4}
        >
          <Box mx={5}>
            <StyledSteps current={step}>
              <Step title="Generated Seed" />
              <Step title="Verify Seed" />
              {/* <Step title="Set Password" /> */}
            </StyledSteps>
            <Box mt={4} height="450px">
              {step === 0 && <GenerateSeedView seed={primaryseed} />}
              {step === 1 && (
                <VerifySeedView seed={primaryseed} setAllValid={this.handleSeedCheck} />
              )}
              {/* {step === 2 && <Text>Coming soon... still under construction...</Text>} */}
            </Box>
            <Flex justifyContent="space-between">
              <Button.Group>
                {step !== 0 && (
                  <StyledButton type="ghost" size="large" onClick={this.prevStep}>
                    Previous
                  </StyledButton>
                )}
              </Button.Group>
              {step < 1 && (
                <Button.Group>
                  <Button size="large" onClick={this.nextStep} type="primary">
                    Next
                  </Button>
                </Button.Group>
              )}
              {step === 1 && (
                <Button.Group>
                  <Button size="large" onClick={this.done} type="primary">
                    Done
                  </Button>
                </Button.Group>
              )}
            </Flex>
          </Box>
        </Flex>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state)
})

export default connect(mapStateToProps)(withRouter(Onboarding))
