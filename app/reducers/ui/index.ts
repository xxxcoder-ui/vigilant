import { WalletActions, GlobalActions, GatewayActions, RenterActions } from 'actions'
import { combineReducers } from 'redux'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export namespace UIReducer {
  export interface State {
    unlockForm: UnlockFormState
    siad: SiadState
    changePassword: ChangePasswordState
    initFromSeed: InitFromSeedState
    rentStorage: ErrorState
    refreshFileManager: boolean
  }

  export interface SiadState {
    isInternal: boolean
    isActive: boolean
    isFinishedLoading: boolean | null
    loading: boolean
    stderr: string[]
    stdout: string[]
  }

  export interface UnlockFormState {
    validateStatus: string
    help?: string
    loading: boolean
  }

  export interface InitFromSeedState {
    error: string
    loading: boolean
    done: boolean
  }

  export interface ErrorState {
    error: string
  }

  export interface ChangePasswordState {
    error: string
    success: boolean
    loading: boolean
  }

  const InitialUnlockState = {
    validateStatus: '',
    help: '',
    loading: false
  }

  const InitialSiadState: SiadState = {
    isInternal: true,
    isActive: false,
    isFinishedLoading: null,
    loading: false,
    stdout: [],
    stderr: []
  }

  const InitialChangePasswordState = {
    error: '',
    success: false,
    loading: false
  }

  const InitialInitFromSeedState: InitFromSeedState = {
    error: '',
    loading: false,
    done: false
  }

  const InitialRentStorageState: ErrorState = {
    error: ''
  }

  const RenterStorageReducer = reducerWithInitialState(InitialRentStorageState)
    .case(RenterActions.getFeeEstimates.done, () => ({
      error: ''
    }))
    .case(RenterActions.getFeeEstimates.failed, (state, payload) => ({
      error: payload.error.message
    }))

  const UnlockFormReducer = reducerWithInitialState(InitialUnlockState)
    .case(WalletActions.resetForm, (state, payload) => InitialUnlockState)
    .case(WalletActions.unlockWallet.failed, (_, payload) => {
      // We should really have status messages for this, and not rely on string matching.
      const errorMessage = payload.error.message
      let help: any = null
      if (errorMessage.includes('provided encryption key is incorrect')) {
        help = 'Provided password is incorrect'
      } else if (errorMessage.includes('ESOCKETTIMEDOUT')) {
        help = 'API Timed Out. Please try again.'
      } else {
        help = errorMessage
      }
      return {
        validateStatus: 'error',
        help,
        loading: false
      }
    })
    .case(WalletActions.unlockWallet.started, (state, _) => ({ ...state, loading: true }))
    .case(WalletActions.unlockWallet.done, () => InitialUnlockState)

  const InitFromSeedReducer = reducerWithInitialState(InitialInitFromSeedState)
    .case(WalletActions.initFromSeed.started, () => ({
      error: '',
      loading: true,
      done: false
    }))
    .case(WalletActions.initFromSeed.failed, (state, payload) => ({
      loading: false,
      error: payload.error.message,
      done: false
    }))
    .case(WalletActions.initFromSeed.done, (state, payload) => ({
      loading: false,
      error: '',
      done: true
    }))

  const SiadReducer = reducerWithInitialState(InitialSiadState)
    .case(GlobalActions.siadLoaded, (state, _) => {
      return {
        ...state,
        isActive: true,
        loading: false
      }
    })
    .case(GlobalActions.siadOffline, (state, _) => {
      return {
        ...state,
        isActive: false,
        loading: false
      }
    })
    .case(GlobalActions.siadLoading, (state, _) => {
      return {
        ...state,
        isActive: false,
        loading: true
      }
    })
    .case(GlobalActions.setSiadOrigin, (state, payload) => {
      return {
        ...state,
        isInternal: payload.isInternal
      }
    })
    .case(GatewayActions.fetchGateway.failed, (state, payload) => {
      return {
        ...state,
        isFinishedLoading: false
      }
    })
    .case(GatewayActions.fetchGateway.done, (state, payload) => ({
      ...state,
      isFinishedLoading: true
    }))
    .case(GlobalActions.siadAppendLog, (state, payload) => ({
      ...state,
      stdout: [...state.stdout, payload]
    }))
    .case(GlobalActions.siadAppendErr, (state, payload) => ({
      ...state,
      stderr: [...state.stderr, payload]
    }))

  const ChangePasswordReducer = reducerWithInitialState(InitialChangePasswordState)
    .case(WalletActions.changePassword.started, () => ({
      error: '',
      success: false,
      loading: true
    }))
    .case(WalletActions.changePassword.done, () => ({
      error: '',
      success: true,
      loading: false
    }))
    .case(WalletActions.changePassword.failed, (state, payload) => ({
      error: payload.error.message,
      success: false,
      loading: false
    }))

  const FileManagerReducer = reducerWithInitialState(false).case(
    GlobalActions.refreshFileManager,
    (state, payload) => payload
  )

  export const Reducer = combineReducers<State>({
    unlockForm: UnlockFormReducer,
    siad: SiadReducer,
    changePassword: ChangePasswordReducer,
    initFromSeed: InitFromSeedReducer,
    rentStorage: RenterStorageReducer,
    refreshFileManager: FileManagerReducer
  })
}
