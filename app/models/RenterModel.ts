import { WalletModel } from './WalletModel'

export namespace RenterModel {
  interface Contract {
    downloadspending: string
    endheight: number
    fees: string
    hostpublickey: WalletModel.SiaPublicKey
    id: string
    lasttransactions: any
    netaddress: string
    renterfunds: string
    size: number
    startheight: number
    storagespending: string
    totalcost: string
    uploadspending: string
    goodforupload: boolean
    goodforrenew: false
  }

  export interface ContractsGETResponse {
    activecontracts: Contract[]
    inactivecontracts: Contract[]
    expiredcontracts: Contract[]
  }

  export interface PricesGETResponse {
    downloadterabyte: string
    formcontracts: string
    storageterabytemonth: string
    uploadterabyte: string
    funds: string
    hosts: number
    period: number
    renewwindow: number
    expectedstorage: number
    expectedupload: number
    expecteddownload: number
    expectedredundancy: number
  }

  export interface RenterGETResponse {
    settings: {
      allowance: {
        funds: string
        hosts: number
        period: number
        renewwindow: number
        expectedstorage: number
        expectedupload: number
        expecteddownload: number
        expectedredundancy: number
      }
      maxuploadseed: number
      maxdownloadspeed: number
      streamcachesize: number
    }
    financialmetrics: {
      contractfees: string
      contractspending: string
      downloadspending: string
      storagespending: string
      totalallocated: string
      uploadspending: string
      unspent: string
    }
    currentperiod: number
  }

  // UploadedBackup describes the type of a single backup returned from the
  // remote backup list
  export interface UploadedBackup {
    name: string
    creationdate: number
    size: number
  }
}
