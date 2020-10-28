import BigNumber from 'bignumber.js'

export namespace WalletModel {
  /*
    GET
  */

  // GET /wallet
  export interface WalletGET {
    encrypted: boolean
    height: number
    rescanning: boolean
    unlocked: boolean
    confirmedsiacoinbalance: number
    unconfirmedoutgoingsiacoins: number
    unconfirmedincomingsiacoins: number
    siacoinclaimbalance: number
    siafundbalance: string
    dustthreshold: number
  }

  // GET /wallet/address
  export interface AddressGETResponse {
    address: string
  }

  // GET  /wallet/addressee
  export interface AddressesGETResponse {
    addresses: string[]
  }

  // GET /wallet/transactions
  export interface TransactionsGET {
    startheight: number
    endheight: number
  }

  // GET /wallet/seeds
  export interface SeedsGET {
    dictionary?: string
    seed: string
  }

  // GET /wallet/transaction/:id
  export interface TransactionGETid {
    transaction: ProcessedTransaction
  }

  /*
    POST
  */

  // POST /wallet/init
  export interface InitPOST {
    encryptionpassword?: string
    dictionary?: string
    force?: boolean
  }

  // POST /wallet/init/seed
  export interface InitSeedPOST {
    encryptionpassword: string
    seed: string
    dictionary?: string
    force?: boolean
  }

  // POST /wallet/siacoins
  export interface SiacoinsPOST {
    amount: number
    destination: string
  }

  // POST /wallet/siafunds
  export interface SiafundsPOST {
    amount: number
    destination: string
  }

  // POST /wallet/sweep
  export interface SweepPOST {
    dictionary?: string
    seed: string
  }

  // POST /wallet/unlock
  export interface UnlockPOST {
    encryptionpassword: string
  }

  // POST /wallet/changepassword
  export interface ChangePasswordPOST {
    encryptionpassword: string
    newpassword: string
  }

  /*
    RESPONSE
  */

  // RESPONSE /wallet/sweep/seed
  export interface SweepPOSTResponse {
    coins: number
    funds: number
  }

  // RESPONSE /wallet/siafunds
  export interface SiafundsPOSTResponse {
    transactionids: string[]
  }

  // RESPONSE /wallet/transactions
  export interface TransactionsGETResponse {
    sinceHeight?: number
    confirmedtransactions: ProcessedTransaction[]
    unconfirmedtransactions: ProcessedTransaction[]
  }

  // RESPONSE /wallet/init
  export interface InitPOSTResponse {
    primaryseed: string
  }

  // RESPONSE /wallet/transaction/:id
  export type TransactionGETIdResponse = ProcessedTransaction

  // RESPONSE /wallet/siacoins
  export interface SiacoinsPOSTResponse {
    transactionids: string[]
  }

  // RESPONSE /wallet/seeds
  export interface SeedsGETResponse {
    primaryseed: string
    addressesremaining: number
    allseeds: string[]
  }

  // ...

  export interface TransactionsGETaddr {
    confirmedtransactions: ProcessedTransaction[]
    unconfirmedtransactions: ProcessedTransaction[]
  }

  export interface VerifyAddressGET {
    valid: boolean
  }

  export interface ProcessedTransaction {
    transaction: Transaction
    transactionid: string
    confirmationheight: number
    confirmationtimestamp: number
    inputs: ProcessedInput[]
    outputs: ProcessedOutput[]
  }

  // we require the value to be SIACOIN and SIAFUND to match coin calculation either
  // from daemon or one of our packages
  //TODO: change to match SCPRIME(COIN|FUND) for price calcuation.
  export enum TransactionTypes {
    SCPRIMECOIN = 'SIACOIN',
    SCPRIMEFUND = 'SIAFUND',
    CONTRACT = 'CONTRACT',
    PROOF = 'PROOF',
    REVISION = 'REVISION',
    BLOCK = 'BLOCK',
    DEFRAG = 'DEFRAG',
    SETUP = 'SETUP'
  }

  export const TransactionTypesList = Object.keys(TransactionTypes).map(x => TransactionTypes[x])

  export enum CurrencyTypes {
    SC = 'SCP',
    SF = 'SPF'
  }

  export interface SiaPublicKey {
    algorithm: string
    key: string
  }
  // Private interfaces

  interface UnlockConditions {
    timelock: number
    publickeys: SiaPublicKey[]
    signaturesrequre: number
  }

  interface SiacoinInput {
    parentid: string
    unlockconditions: UnlockConditions
  }

  interface SiacoinOutput {
    value: number
    unlockhash: string
  }

  interface FileContract {
    filesize: number
    filemerkleroot: string
    windowstart: number
    windowend: number
    payout: number
    validproofoutputs: SiacoinOutput[]
    missedproofoutputs: SiacoinOutput[]
    unlockhash: string
    revisionnumber: number
  }

  interface FileContractRevision {
    parentid: string
    unlockconditions: UnlockConditions
    newrevisionnumber: number
    newfilesize: number
    newfilemerkleroot: string
    newwindowstart: number
    newwindowend: number
    newvalidproofouputs: SiacoinOutput[]
    newmissedproofoutputs: SiacoinOutput[]
    newunlockhash: string
  }

  interface StorageProof {
    parentid: string
    segment: string
    hashset: string
  }

  interface SiafundOutput {
    parentid: string
    unlockconditions: UnlockConditions
    claimunlockhash: string
  }

  interface SiafundInput {
    parentid: string
    unlockconditions: UnlockConditions
    claimunlockhash: string
  }

  interface CoveredFields {
    wholetransaction: boolean
    siacoininputs: number[]
    siacoinoutputs: number[]
    filecontracts: number[]
    filecontractsrevisions: number[]
    storageproofs: number[]
    siafundinputs: number[]
    siafundoutputs: number[]
    minerfees: number[]
    arbitrarydata: number[]
    transactionsignatures: number[]
  }

  interface TransactionSignature {
    parentid: string
    publickeyindex: number
    timelock: number
    coveredfields: CoveredFields
    signature: string
  }

  interface Transaction {
    siacoininputs: SiacoinInput[]
    siacoinoutputs: SiacoinOutput[]
    filecontracts: FileContract[]
    filecontractrevisions: FileContractRevision[]
    storageproofs: StorageProof[]
    siafundinputs: SiafundInput[]
    siafundsoutputs: SiafundOutput[]
    minerfees: number[]
    arbtrarydata: string
    transactionsignatures: TransactionSignature[]
  }

  export interface ProcessedInput {
    parentid: string
    fundtype: string
    walletaddress: boolean
    relatedaddress: string
    value: number
  }

  export interface ProcessedOutput {
    id: string
    fundtype: string
    maturityheight: number
    walletaddress: boolean
    relatedaddress: string
    value: number
  }
}
