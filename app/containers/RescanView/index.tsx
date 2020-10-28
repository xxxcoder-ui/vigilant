import { GlobalActions } from 'actions'
import { Icon, Progress } from 'antd'
import { Box, DragContiner, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { WalletModel } from 'models'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect, RouteComponentProps, withRouter } from 'react-router'
import { ConsensusRootReducer } from 'reducers/consensus'
import { createStructuredSelector } from 'reselect'
import { selectConsensus, selectWalletSummary } from 'selectors'

interface StateProps {
  consensus: ConsensusRootReducer.State
  wallet: WalletModel.WalletGET
}

class RescanView extends React.Component<StateProps & DispatchProp & RouteComponentProps, {}> {
  componentDidMount() {
    this.props.dispatch(GlobalActions.startPolling())
  }
  componentWillUnmount() {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  routeDashboard = () => {
    this.props.history.push('/')
  }
  render() {
    const { consensus, wallet } = this.props
    if (!wallet.rescanning) {
      return <Redirect to="/" />
    }
    const chooseBigger = consensus.height > 185801 ? consensus.height : 185801
    const syncPercentage = Math.ceil((wallet.height / (chooseBigger + 5)) * 100)
    return (
      <DragContiner>
        <Flex height="100vh" width="100%" justifyContent="center" alignItems="center" bg="white">
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
          >
            <Box width={1 / 3} style={{ textAlign: 'center' }} pb={2}>
              <Icon type="loading" style={{ fontSize: 14 }} spin />
            </Box>
            <Box mx={2} width={1 / 3} style={{ textAlign: 'center' }}>
              <Text is="p" color="mid-gray" fontSize={3}>
                Please wait, we are building an index of your wallet
              </Text>
            </Box>
            <Box mx={2} width={1 / 3}>
              <Progress
                showInfo={false}
                strokeColor="#2074ee"
                percent={syncPercentage}
                status="active"
              />
            </Box>
            <Box style={{ textAlign: 'center' }}>
              <Text color="silver">{wallet.height} Blocks Scanned</Text>
            </Box>
          </Flex>
        </Flex>
      </DragContiner>
    )
  }
}

export default connect(
  createStructuredSelector({
    consensus: selectConsensus,
    wallet: selectWalletSummary
  })
)(withRouter(RescanView))
