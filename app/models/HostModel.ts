import { WalletModel } from './WalletModel'

export namespace HostModel {
  export interface Host {
    acceptingcontracts: boolean
    maxdownloadbatchsize: number
    maxduration: number
    maxrevisebatchsize: number
    netaddress: string
    remainingstorage: number
    sectorsize: number
    totalstorage: number
    unlockhash: string
    windowsize: number
    publickey: WalletModel.SiaPublicKey
    publickeystring: string
  }
  export interface hostdbActiveGET {
    hosts: Host[]
  }

  export interface HostGET {
    externalsettings: {
      acceptingcontracts: boolean
      maxdownloadbatchsize: number
      maxduration: number
      maxrevisionbatchsize: number
      netaddress: string
      remainingstorage: number
      sectorsize: number
      totalstorage: number
      unlockhash: string
      windowsize: number
      collateral: string
      maxcollateral: string
      contractprice: string
      downloadbandwidthprice: string
      storageprice: string
      uploadbandwidthprice: string
      revisionnumber: number
      version: string
    }
    financialmetrics: {
      contractcount: number
      contractcompensation: string
      potentialcontractcompensation: string
      lockedstoragecollateral: string
      lostrevenue: string
      loststoragecollateral: string
      potentialstoragerevenue: string
      riskedstoragecollateral: string
      storagerevenue: string
      transactionfeeexpenses: string
      downloadbandwidthrevenue: string
      potentialdownloadbandwidthrevenue: string
      potentialuploadbandwidthrevenue: string
      uploadbandwidthrevenue: string
    }
    internalsettings: {
      acceptingcontracts: boolean
      maxdownloadbatchsize: number
      maxduration: number
      maxrevisebatchsize: number
      netaddress: string
      windowsize: number
      collateral: string
      collateralbudget: string
      maxcollateral: string
      mincontractprice: string
      mindownloadbandwidthprice: string
      minstorageprice: string
      minuploadbandwidthprice: string
    }
    networkmetrics: {
      downloadcalls: number
      errorcalls: number
      formcontractcalls: number
      renewcalls: number
      revisecalls: number
      settingscalls: number
      unrecognizedcalls: number
    }
    connectabilitystatus: string
    workingstatus: string
  }

  export interface HostPOST {
    acceptingcontracts?: boolean
    maxdownloadbatchsize?: number
    maxduration?: number
    maxrevisebatchsize?: number
    netaddress?: string
    windowsize?: number
    collateral?: string
    collateralbudget?: string
    maxcollateral?: string
    mincontractprice?: string
    mindownloadbandwidthprice?: string
    minstorageprice?: string
    minuploadbandwidthprice?: string
  }

  export interface AnnouncePOST {
    netaddress?: string
  }

  interface HostContract {
    contractcost: string
    datasize: number
    lockedcollateral: string
    obligationid: string
    potentialdownloadrevenue: string
    potentialstoragerevenue: string
    potentialuploadrevenue: string
    riskedcollateral: string
    sectorrootscount: number
    transactionfeesadded: string
    expirationheight: number
    negotiationheight: number
    proofdeadline: number
    obligationstatus: string
    originconfirmed: boolean
    proofconfirmed: boolean
    proofconstructed: boolean
    revisionconfirmed: boolean
    revisionconstructed: boolean
  }

  export interface ContractsGETResponse {
    contracts: HostContract[]
  }

  export interface StorageFolder {
    path: string
    capacity: number
    capacityremaining: number
    failedreads: number
    failedwrites: number
    successfulreads: number
    successfulwrites: number
  }

  export interface StorageGETResponse {
    folders: StorageFolder[]
  }

  export interface StorageAddPOST {
    path: string
    size: number
  }
  export interface StorageRemovePOST {
    path: string
    force?: boolean
  }
  export interface StorageResizePOST {
    path: string
    newsize: number
  }
  export interface ScoreResponse {
    estimatedscore: string
    conversionrate: number
  }
}
