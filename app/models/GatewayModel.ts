export namespace GatewayModel {
  export interface Peer {
    netaddress: string
    version: string
    inbound: boolean
  }

  export interface GetwayGET {
    netaddress: string
    peers: Peer[]
  }
}
