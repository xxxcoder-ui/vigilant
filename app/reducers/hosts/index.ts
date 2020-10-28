import { HostActions } from 'actions'
import { HostModel } from 'models'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export namespace HostReducer {
  export interface State {
    activeHosts: HostModel.Host[]
    host: HostModel.HostGET | null
    folders: HostModel.StorageFolder[]
  }

  const initialState: State = {
    activeHosts: [],
    host: null,
    folders: []
  }

  export const Reducer = reducerWithInitialState(initialState)
    .case(HostActions.getActiveHosts.done, (state, payload) => {
      return {
        ...state,
        ...{
          activeHosts: payload.result.hosts ? payload.result.hosts : []
        }
      }
    })
    .case(HostActions.getHostStorage.done, (state, payload) => {
      return {
        ...state,
        ...{
          folders: payload.result.folders || []
        }
      }
    })
    .case(HostActions.getHostConfig.done, (state, payload) => {
      return {
        ...state,
        ...{
          host: payload.result
        }
      }
    })
}
