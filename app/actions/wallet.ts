import actionCreatorFactory from 'typescript-fsa'
import { DashboardModel, WalletModel, APIModel } from 'models'

const walletActionsCreator = actionCreatorFactory('wallet')

export namespace WalletActions {
  export const startPolling = walletActionsCreator<void>('START_POLL')
  export const stopPolling = walletActionsCreator<void>('STOP_POLL')
  export const requestInitialData = walletActionsCreator<void>('INITIALIZE')

  export const getWallet = walletActionsCreator.async<void, WalletModel.WalletGET, APIModel.Error>(
    'GET_WALLET'
  )

  export const getReceiveAddresses = walletActionsCreator.async<
    void,
    WalletModel.AddressesGETResponse,
    APIModel.Error
  >('RECEIVE_ADDRESS')

  export const generateReceiveAddress = walletActionsCreator.async<
    void,
    WalletModel.AddressGETResponse,
    APIModel.Error
  >('NEW_RECEIVE_ADDRESS')

  // Not sure if we should include the startheight and endheight params here.
  // Right now Sia-UI just queries for all the transactions at once, but there
  // are obvious scalability issues that will exist of power-users (aka.
  // exchanges). We would need to include lazy-loading pagination for this to
  // make sense.
  export const getTransactions = walletActionsCreator.async<
    {
      sinceHeight?: number
      count: number
    },
    WalletModel.TransactionsGETResponse,
    APIModel.Error
  >('GET_TRANSACTIONS')

  export const getTxFromId = walletActionsCreator.async<
    string,
    WalletModel.TransactionGETIdResponse,
    APIModel.Error
  >('GET_TX_ID')

  export const createSiacoinTransaction = walletActionsCreator.async<
    WalletModel.SiacoinsPOST,
    WalletModel.SiacoinsPOSTResponse,
    APIModel.Error
  >('CREATE_SC_TX')

  export const createSiafundTransaction = walletActionsCreator.async<
    WalletModel.SiafundsPOST,
    WalletModel.SiafundsPOSTResponse,
    APIModel.Error
  >('CREATE_SF_TX')

  export const changePassword = walletActionsCreator.async<
    WalletModel.ChangePasswordPOST,
    void,
    APIModel.Error
  >('CHANGE_PASSWORD')

  export const getWalletSeeds = walletActionsCreator.async<
    // WalletModel.SeedsGET,
    void,
    WalletModel.SeedsGETResponse,
    APIModel.Error
  >('GET_WALLET_SEEDS')

  export const sweepSeed = walletActionsCreator.async<
    WalletModel.SeedsGET,
    WalletModel.SeedsGETResponse,
    APIModel.Error
  >('SWEEP_SEED')

  export const initFromSeed = walletActionsCreator.async<
    { primaryseed: string },
    void,
    APIModel.Error
  >('INIT_FROM_SEED')

  export const broadcastedTransactionDetails = walletActionsCreator<
    WalletModel.ProcessedTransaction[]
  >('BCAST_TX_DETAILS')

  export const resetTransactionDetails = walletActionsCreator<void>('RESET_TX')

  export const lockWallet = walletActionsCreator.async<void, void, APIModel.Error>('LOCK_WALLET')

  export const unlockWallet = walletActionsCreator.async<
    WalletModel.UnlockPOST,
    void,
    APIModel.Error
  >('UNLOCK_WALLET')

  export const resetForm = walletActionsCreator<void>('RESET_FORMS')

  export const createNewWallet = walletActionsCreator.async<
    WalletModel.InitPOST,
    WalletModel.InitPOSTResponse,
    APIModel.Error
  >('CREATE_NEW_WALLET')

  export const clearSeed = walletActionsCreator<void>('CLEAR_WALLET')
}
