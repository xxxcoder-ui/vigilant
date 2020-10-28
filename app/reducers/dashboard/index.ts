import { GlobalActions } from 'actions'
import { workers } from 'cluster'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export interface GlobalStatPoint {
  time: string
  network_hashrate: number
  pool_hashrate: number
  workers: number
  network_difficulty: number
  coin_price: number
  btc_price: number
}

export namespace DashboardRootReducer {
  export interface State {
    priceUsd: number
  }

  const InitialState: State = {
    priceUsd: 0
  }

  export const Reducer = reducerWithInitialState(InitialState).case(
    GlobalActions.fetchPriceStats.done,
    (state, payload) => {
      return { ...state, priceUsd: payload.result.market_data.current_price.usd }
    }
  )
}
