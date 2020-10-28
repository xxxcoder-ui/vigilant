import { Button } from 'antd'
import { Box, ButtonWithAdornment, Card as AtomCard, CardHeader, Text } from 'components/atoms'
import { Stat } from 'components/Card'
import { ConsensusModel, GatewayModel } from 'models'
import * as React from 'react'
import { connect } from 'react-redux'
import { Flex } from 'rebass'
import { createStructuredSelector } from 'reselect'
import { selectActiveHostCount, selectConsensus, selectGateway } from 'selectors'

// import { RequirePriceData } from 'components/RequireData'
const { shell } = require('electron')

interface StateProps {
  // price: number
  gateway: GatewayModel.GetwayGET
  consensus: ConsensusModel.ConsensusGETResponse
  activeHostCount: number
}

class Dashboard extends React.Component<StateProps, {}> {
  openDocs = () => {
    shell.openExternal('https://sia.tech/docs/')
  }
  render() {
    const { consensus, gateway, activeHostCount } = this.props
    const peers = gateway.peers.length
    return (
      <div>
        <Box>
          <Flex justifyContent="space-between" alignItems="baseline">
            <CardHeader>Overview</CardHeader>
          </Flex>
          <Flex>
            <Stat
              content={consensus.height.toLocaleString('en-US')}
              title="Block Height"
              width={1 / 3}
            />
            <Stat content={peers} title="Connected Peers" width={1 / 3} />
            <Stat content={activeHostCount} title="Active Hosts" width={1 / 3} />
          </Flex>
        </Box>
        {/*<Box m={2} pt={2}>
          <AtomCard>
            <Flex justifyContent="center" alignItems="center">
              <Flex alignItems="center" justifyContent="center" flexDirection="column" py={4}>
                <Flex alignItems="center" justifyContent="center" flexDirection="column" pb={3}>
                  <Text is="div" fontSize="28px">
                    Build on ScPrime
                  </Text>
                  <Box width={3 / 5} style={{ textAlign: 'center' }}>
                    <Text is="div" fontSize={2} py={2} fontWeight={400}>
                      ScPrime is building the best business-class storage solution. Explore the API
                      to build alternate interfaces and access the network.
                    </Text>
                  </Box>
                </Flex>
                <Box>
                  <Button.Group>
                    <ButtonWithAdornment onClick={this.openDocs} before iconType="build">
                      Explore the API
                    </ButtonWithAdornment>
                  </Button.Group>
                </Box>
              </Flex>
            </Flex>
          </AtomCard>
        </Box>*/}
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  consensus: selectConsensus,
  gateway: selectGateway,
  activeHostCount: selectActiveHostCount
})

export default connect(mapStateToProps)(Dashboard)
