import * as bytes from 'bytes'

// converts byte amount to TB. returns a string without the unit 'TB'.
export const bytesToGB = (b: number) => {
  return b / 1e9
}

// converts byte amount to GB. returns a string without the unit 'GB'.
export const bytesToGBString = (b: number) => {
  return bytesToGB(b).toFixed(2)
}

// converts byte amount to TB. returns a string without the unit 'TB'.
export const bytesToTB = (b: number) => {
  return b / 1e12
}

// converts byte amount to TB. returns a string without the unit 'TB'.
export const bytesToTBString = (b: number) => {
  return bytesToTB(b).toFixed(2)
}

export const tbToBytes = (tb: number) => Math.ceil(tb * 1e12)

export const BLOCKS_PER_HOUR = 6
export const BLOCKS_PER_DAY = BLOCKS_PER_HOUR * 24
export const BLOCKS_PER_MONTH = 30 * BLOCKS_PER_DAY
