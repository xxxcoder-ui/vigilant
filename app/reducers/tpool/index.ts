import { TpoolActions } from 'actions'
import { TpoolModel } from 'models'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export namespace TpoolRootReducer {
  export type State = TpoolModel.FeeGETResponse

  const InitialSummaryState: State = {
    maximum: '0',
    minimum: '0'
  }

  export const Reducer = reducerWithInitialState(InitialSummaryState).case(
    TpoolActions.getFee.done,
    (state, payload) => {
      return {
        ...state,
        ...payload.result
      }
    }
  )
}
