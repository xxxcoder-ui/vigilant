import { WalletActions } from 'actions'
import { Button, Steps } from 'antd'
import { Box, DragContiner } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { UIReducer } from 'reducers/ui'
import { WalletRootReducer } from 'reducers/wallet'
import { selectInitFromSeedState, selectSeedState } from 'selectors'

import { PasteSeedView } from './PasteSeedView'
import { ScanningView } from './ScanningView'

const { Step } = Steps

interface State {
  step: number
  seed: string
}

interface StateProps {
  seed: WalletRootReducer.SeedState
  initSeed: UIReducer.InitFromSeedState
}

type Props = RouteComponentProps & StateProps & DispatchProp

class RestoreWallet extends React.Component<Props, State> {
  seedForm: any
  state = {
    step: 0,
    seed: ''
  }

  nextStep = () => {
    if (this.state.step === 0) {
      this.props.dispatch(
        WalletActions.initFromSeed.started({
          primaryseed: this.state.seed
        })
      )
    }
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
  handleSeedInput = e => {
    this.setState({
      seed: e.target.value
    })
  }
  done = () => {
    this.props.history.push('/protected')
  }
  render() {
    const { step } = this.state
    const { initSeed } = this.props
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
            <Steps current={step}>
              <Step title="Input Seed" />
              <Step title="Scan Blockchain" />
            </Steps>
            <Box mt={4} height="450px">
              {step === 0 && <PasteSeedView onChange={this.handleSeedInput} />}
              {step === 1 && <ScanningView />}
            </Box>
            <Flex justifyContent="space-between">
              <Button.Group>
                {step !== 0 && (
                  <Button
                    disabled={initSeed.loading || initSeed.done}
                    type="ghost"
                    size="large"
                    onClick={this.prevStep}
                  >
                    Try Again
                  </Button>
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
                  <Button disabled={!initSeed.done} size="large" onClick={this.done} type="primary">
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
  seed: selectSeedState(state),
  initSeed: selectInitFromSeedState(state)
})

export default connect(mapStateToProps)(withRouter(RestoreWallet))
