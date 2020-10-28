export namespace DashboardModel {
  export interface GlobalStatsPoint {
    time: string
    network_hashrate: number
    pool_hashrate: number
    workers: number
    network_difficulty: number
    coin_price: number
    btc_price: number
  }
}
