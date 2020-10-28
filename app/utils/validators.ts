import blake from 'blakejs'
import { isEqual } from 'lodash'
import { IndexState } from 'reducers'
import { selectConfirmedBalance, selectSiafundBalance } from 'selectors'

function hexToBytes(hex: string) {
  const bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }
  return bytes
}

// Convert a byte array to a hex string
function bytesToHex(bytes: number[]) {
  const hex = []
  for (const b of bytes) {
    hex.push((b >>> 4).toString(16))
    hex.push((b & 0xf).toString(16))
  }
  return hex.join('')
}

function checksumAddress(address: string) {
  if (address.length !== 76) {
    return false
  }
  const aBytes = hexToBytes(address)
  const checksumBytes = Uint8Array.from(aBytes.slice(0, 32))
  const check = Uint8Array.from(aBytes.slice(32, 38))
  const blakeHash = blake.blake2b(checksumBytes, null, 32).slice(0, 6)
  return isEqual(blakeHash, check)
}

export interface ValidationResult {
  validateStatus: undefined | string
  help: undefined | string
}

export type ValidatorType = (s: any) => ValidationResult

export const validateSiaAddress = (a: string): ValidationResult => {
  if (a === '') {
    return {
      validateStatus: undefined,
      help: undefined
    }
  }
  const successMessage = {
    validateStatus: 'success',
    help: undefined
  }

  const errorMessage = {
    validateStatus: 'error',
    help: 'Invalid address detected, please double check your input.'
  }

  return checksumAddress(a) ? successMessage : errorMessage
}

const isGreaterThanZero = (n: number) => n > 0

export const isUnsignedFloat = (x: string) => /^-?\d*(\.\d+)?$/.test(x)

export const EmptyFieldWarning = {
  validateStatus: 'warning',
  help: 'Please fill empty field'
}

export const isValidNumber = (r: any, v: string, cb: any) => {
  let parsed: any = v
  if (typeof v === 'string') {
    parsed = parseFloat(v)
    if (isNaN(parsed)) {
      cb('not a valid number')
    } else {
      cb()
    }
  }
  return isUnsignedFloat(v)
}
export const validateSiaBalance = (state: IndexState) => (v: string | number): ValidationResult => {
  if (v === '') {
    return {
      validateStatus: undefined,
      help: undefined
    }
  }
  let parsed = v
  const confirmedBalance = selectConfirmedBalance(state)
  if (typeof v === 'string') {
    parsed = parseFloat(v)
    if (isNaN(parsed)) {
      return {
        validateStatus: 'error',
        help: 'Please type a valid number.'
      }
    }
  }
  if (!isUnsignedFloat(v as any)) {
    return {
      validateStatus: 'error',
      help: 'Please type a valid number.'
    }
  }
  const balance = parseFloat(confirmedBalance)
  if (balance < parsed) {
    return {
      validateStatus: 'error',
      help: `You don't have a high enough balance to create this transaction.`
    }
  }
  return {
    validateStatus: 'success',
    help: undefined
  }
}

export const validateSiafundBalance = (state: IndexState) => (
  v: string | number
): ValidationResult => {
  if (v === '') {
    return {
      validateStatus: undefined,
      help: undefined
    }
  }
  let parsed = v
  if (typeof v === 'string') {
    parsed = parseInt(v)
    if (isNaN(parsed)) {
      return {
        validateStatus: 'error',
        help: 'Please type a valid number.'
      }
    }
    if (!Number.isInteger(parseFloat(v))) {
      return {
        validateStatus: 'error',
        help: 'Please use an integer value. Siafunds are not divisable.'
      }
    }
  }
  const confirmedBalance = selectSiafundBalance(state)
  const balance = parseInt(confirmedBalance)
  if (balance < parsed) {
    return {
      validateStatus: 'error',
      help: `You don't have a high enough balance to create this transaction.`
    }
  }
  return {
    validateStatus: 'success',
    help: undefined
  }
}

export const testVal = (v: any) => {
  return {
    validateStatus: undefined,
    help: undefined
  }
}
