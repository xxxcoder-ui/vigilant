export namespace APIModel {
  export interface Error {
    message: string
  }
  export interface CoinGeckoPrice {
    market_data: {
      current_price: {
        usd: number
      }
    }
  }
}
