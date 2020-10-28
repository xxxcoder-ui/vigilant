export namespace ConsensusModel {
  export interface ConsensusGETResponse {
    synced: boolean
    height: number
    currentblock: string
    target: number[]
    difficulty: number
  }

  export interface ConsensusGETBlocks {
    id: string
    height: number
  }
}
