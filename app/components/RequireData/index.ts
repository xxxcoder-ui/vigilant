import { ConsensusActions, WalletActions } from 'actions'
import { isEmpty } from 'lodash'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { AnyAction } from 'redux'
import { createStructuredSelector, Selector } from 'reselect'
import { selectConsensus, selectSeedState, selectWalletSummary } from 'selectors'

interface RequireDataProps<T> {
  data: T
}

const RequireDataEnhancer = (actionCreator: () => AnyAction, emptyCheck?: string) =>
  class RequireData extends React.Component<RequireDataProps<any> & DispatchProp, {}> {
    emptyCheck = () => {
      const empty = emptyCheck ? !this.props.data[emptyCheck] : isEmpty(this.props.data)
      if (empty) {
        this.props.dispatch(actionCreator())
      }
    }
    componentDidMount() {
      this.emptyCheck()
    }
    UNSAFE_componentWillUpdate() {
      this.emptyCheck()
    }
    render() {
      const empty = emptyCheck ? !this.props.data[emptyCheck] : isEmpty(this.props.data)
      return empty ? null : this.props.children
    }
  }

const DataEnhancerFactory = (
  selector: Selector<any, any>,
  action: () => AnyAction,
  emptyCheck?: string
) => connect(createStructuredSelector({ data: selector }))(RequireDataEnhancer(action, emptyCheck))

// export const RequirePriceData = DataEnhancerFactory(
//   selectDashboard,
//   GlobalActions.requestPriceStats,
//   'priceUsd'
// )

export const RequireWalletData = DataEnhancerFactory(
  selectWalletSummary,
  WalletActions.requestInitialData,
  'height'
)

export const RequireSeedData = DataEnhancerFactory(
  selectSeedState,
  WalletActions.getWalletSeeds.started,
  'primaryseed'
)

export const RequireConsensusData = DataEnhancerFactory(
  selectConsensus,
  ConsensusActions.fetchConsensus.started,
  'difficulty'
)
