import { RouterState } from 'connected-react-router'
import { combineReducers } from 'redux'

import { ConsensusRootReducer } from './consensus'
import { GatewayReducer } from './gateway'
import { HostReducer } from './hosts'
import { RenterReducer } from './renter'
import { TpoolRootReducer } from './tpool'
import { UIReducer } from './ui'
import { WalletRootReducer } from './wallet'

// import { routerReducer as routing } from 'react-router-redux'
const rootReducer = combineReducers<Omit<IndexState, 'router'>>({
  wallet: WalletRootReducer.Reducer,
  // dashboard: DashboardRootReducer.Reducer,
  tpool: TpoolRootReducer.Reducer,
  consensus: ConsensusRootReducer.Reducer,
  ui: UIReducer.Reducer,
  gateway: GatewayReducer.Reducer,
  host: HostReducer.Reducer,
  renter: RenterReducer.Reducer
})

export interface IndexState {
  // dashboard: DashboardRootReducer.State
  gateway: GatewayReducer.State
  wallet: WalletRootReducer.State
  tpool: TpoolRootReducer.State
  consensus: ConsensusRootReducer.State
  router: RouterState
  ui: UIReducer.State
  host: HostReducer.State
  renter: RenterReducer.State
}

export default rootReducer
