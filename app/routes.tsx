import OfflineView from 'containers/OfflineView'
import Onboarding from 'containers/Onboarding'
import ProtectedView from 'containers/ProtectedView'
import RescanView from 'containers/RescanView'
import SyncView from 'containers/SyncView'
import * as React from 'react'
import { Route, Switch } from 'react-router'
import { hot } from 'react-hot-loader/root'

import App from './containers/App'
import MainView from './containers/MainView'
import SetupView from 'containers/ProtectedView/SetupView'
import RestoreWallet from 'containers/RestoreWallet'

class Routes extends React.Component<{}, {}> {
  render() {
    return (
      <App>
        <Switch>
          <Route exact path="/protected" component={ProtectedView} />
          <Route exact path="/offline" component={OfflineView} />
          <Route exact path="/syncing" component={SyncView} />
          <Route exact path="/scanning" component={RescanView} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/restorewallet" component={RestoreWallet} />
          <Route path="/setup" component={SetupView} />
          <Route path="/" component={MainView} />
        </Switch>
      </App>
    )
  }
}

export default hot(Routes)
