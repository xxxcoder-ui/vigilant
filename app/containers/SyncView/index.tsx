import { GlobalActions } from 'actions'
import { Button, Icon, Progress } from 'antd'
import { Box, ButtonWithAdornment, DragContiner, Text } from 'components/atoms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect, RouteComponentProps, withRouter } from 'react-router'
import { ConsensusRootReducer } from 'reducers/consensus'
import { createStructuredSelector } from 'reselect'
import { selectConsensus } from 'selectors'
import { Flex } from 'components/atoms/Flex'
import { StyledIcon } from 'components/atoms/StyledIcon'

interface StateProps {
  consensus: ConsensusRootReducer.State
}

class SyncView extends React.Component<StateProps & DispatchProp & RouteComponentProps, {}> {
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
    const { consensus } = this.props
    if (consensus.synced) {
      return <Redirect to="/" />
    }
    const chooseBigger = consensus.height > 185801 ? consensus.height : 185801
    const syncPercentage = Math.ceil((consensus.height / (chooseBigger + 5)) * 100)
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
              <StyledIcon type="loading" style={{ fontSize: 14 }} spin />
            </Box>
            <Box mx={2} width={1 / 3} style={{ textAlign: 'center' }}>
              <Text is="p" color="mid-gray" fontSize={3}>
                ScPrime is currently syncing with the network
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
            <Box pt={4}>
              <Button.Group>
                <ButtonWithAdornment
                  onClick={this.routeDashboard}
                  type="ghost"
                  before
                  iconType="right"
                >
                  Go to Dashboard
                </ButtonWithAdornment>
              </Button.Group>
            </Box>
          </Flex>
        </Flex>
      </DragContiner>
    )
  }
}

export default connect(
  createStructuredSelector({
    consensus: selectConsensus
  })
)(withRouter(SyncView))
