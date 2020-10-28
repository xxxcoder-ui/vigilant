import { GlobalActions, WalletActions } from 'actions'
import { siad } from 'api/siad'
import Wordmark from 'assets/svg/wordmark.svg'
import AppHeader from 'components/AppHeader'
import { Box, DragContiner, SVGBox } from 'components/atoms'
import { RequireConsensusData } from 'components/RequireData'
import { MainSidebar, SidebarItem } from 'components/Sidebar'
import Dashboard from 'containers/Dashboard'
import Host from 'containers/Host'
import Renter from 'containers/Renter'
import Wallet from 'containers/Wallet'
import { WalletModel } from 'models'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { UIReducer } from 'reducers/ui'
import { selectSiadState, selectWalletSummary, selectIsRenterLoaded } from 'selectors'
import { IsLoadedHOC } from 'components/IsLoadedHOC/IsLoadedHOC'

const routes: SidebarItem[] = [
  {
    title: 'Dashboard',
    iconType: 'dashboard',
    path: ''
  },
  {
    title: 'Wallet',
    iconType: 'wallet',
    path: 'wallet'
  },
  {
    title: 'Rent',
    iconType: 'file',
    path: 'renter'
  },
  {
    title: 'Host',
    iconType: 'database',
    path: 'host'
  }
]

interface Props {
  pathname: any
  wallet: WalletModel.WalletGET
}

interface StateProps {
  siad: UIReducer.SiadState
}

class MainView extends React.Component<
  Props & DispatchProp & StateProps & RouteComponentProps,
  {}
> {
  componentDidMount = async () => {
    if (await siad.isRunning()) {
      this.props.dispatch(GlobalActions.startPolling())
      this.props.dispatch(GlobalActions.startSiadPolling())
      this.props.dispatch(WalletActions.startPolling())
    }
  }
  componentWillUnmount() {
    this.props.dispatch(GlobalActions.stopPolling())
    this.props.dispatch(WalletActions.stopPolling())
  }
  render() {
    const { wallet, siad, location, isRenterLoaded } = this.props
    if (!siad.isActive) {
      return <Redirect to="/offline" />
    }
    if (wallet.rescanning) {
      return <Redirect to="/scanning" />
    }
    if (!wallet.unlocked) {
      return <Redirect to="/protected" />
    }
    return (
      <DragContiner>
        <Box px={20} pt={5} width="240px" bg="sidebar-bg" style={{ flexShrink: 0 }}>
          <SVGBox height="40px">
            <Wordmark viewBox="0 0 97 58" />
          </SVGBox>
          <Box mt={4}>
            <Box pt={2}>
              <MainSidebar routes={routes} activePath={location.pathname} />
            </Box>
          </Box>
        </Box>
        <Box width={1} style={{ height: '100vh' }} bg="bg">
          <RequireConsensusData>
            <AppHeader />
          </RequireConsensusData>
          <Box
            mt="64px"
            height="calc(100% - 64px)"
            width="calc(100vw - 240px)"
            style={{ overflow: 'auto' }}
            p={4}
          >
            <Switch>
              <Route exact path="/wallet" component={Wallet} />
              <Route path="/renter" component={Renter} />
              <Route path="/host" component={Host} />
              <Route path="/" component={Dashboard} />
            </Switch>
          </Box>
        </Box>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  pathname: state.router.location.pathname,
  wallet: selectWalletSummary(state),
  siad: selectSiadState(state),
  isRenterLoaded: selectIsRenterLoaded(state)
})

export default connect(mapStateToProps)(withRouter(MainView))
