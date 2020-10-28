import BigNumber from 'bignumber.js'
import { TransactionGroup } from 'containers/Wallet'
import { every } from 'lodash'
import { WalletModel } from 'models'
import * as moment from 'moment/moment'
import { StructuredTransaction } from 'selectors'
import { toHastings, toSiacoins } from 'sia-typescript'

const emptyTransactions = {
  sections: [],
  completed: true
}

export const blocksToWeeks = (blocks: any) => new BigNumber(blocks).dividedBy('1008') // 1008 = blocks per week

export const weeksToBlocks = (weeks: any) => new BigNumber(weeks).times('1008') // 1008 = blocks per week

export const hastingsByteToSCTB = (hastings: any) => toSiacoins(hastings).times('1e12')

export const SCTBToHastingsByte = (SC: any) => toHastings(SC).dividedBy('1e12')

export const SCTBMonthToHastingsByteBlock = (SC: any) => SCTBToHastingsByte(SC).dividedBy('4320') // 4320 = blocks per month

export const hastingsByteBlockToSCTBMonth = (hastings: any) =>
  hastingsByteToSCTB(hastings).times('4320')

const startOfDay = (unix: number) => moment.unix(unix).startOf('day')

export const filterTransaction = (
  txns: StructuredTransaction[],
  filter: WalletModel.TransactionTypes
) => txns.filter(t => !t.details.labels.includes(filter))

export const filterTransactionGroup = (
  group: TransactionGroup,
  filter: WalletModel.TransactionTypes
): TransactionGroup => ({
  confirmed: filterTransaction(group.confirmed, filter),
  unconfirmed: filterTransaction(group.unconfirmed, filter)
})

export const groupTransactionsByDay = (group: TransactionGroup, count?: number) => {
  const { TransactionTypes } = WalletModel
  // sort the transactions
  group.confirmed = group.confirmed.sort((a, b) => b.date - a.date)

  // sort doesn't work right now as date is not the transaction broadcast date.
  // a hack right now is to reverse the arr.:
  // https://gitlab.com/NebulousLabs/Sia/issues/3257
  group.unconfirmed = group.unconfirmed.sort((a, b) => a.date - b.date)

  // get rid of 0 outputs
  group.confirmed = group.confirmed.filter(t => parseFloat(t.details.totalSiacoin) !== 0)
  group.unconfirmed = group.unconfirmed.filter(t => parseFloat(t.details.totalSiacoin) !== 0)

  // filter by label
  // group = filterTransactionGroup(group, TransactionTypes.CONTRACT)
  // group = filterTransactionGroup(group, TransactionTypes.DEFRAG)
  // group = filterTransactionGroup(group, TransactionTypes.SETUP)

  // keeps track of confirmed txs index
  let index: number = 0
  // keeps track of pending txs index
  let pendingIndex: number = 0

  function getNextTx(): StructuredTransaction {
    let isPending = false
    let bestOp: StructuredTransaction
    const tx = group.confirmed[index]
    bestOp = tx
    const utx = group.unconfirmed[pendingIndex]
    if (utx && (!bestOp || utx.date > bestOp.date)) {
      bestOp = utx
      isPending = true
    }
    if (bestOp) {
      if (isPending) {
        pendingIndex += 1
      } else {
        index += 1
      }
    }
    return bestOp
  }

  let op = getNextTx()
  if (!op) return emptyTransactions
  const sections = []
  const now = moment().unix()
  // console.log('asdf asdf', op.date, Number.MAX_SAFE_INTEGER)
  const date = op.date === 18446744073709552000 ? now : op.date
  let day = startOfDay(date)
  let data: StructuredTransaction[] = []

  // check count
  let counter = count ? count : group.confirmed.length + group.unconfirmed.length
  for (let i = 0; i < counter && op; i++) {
    if (moment.unix(op.date) < day) {
      sections.push({ day, data })
      day = startOfDay(op.date)
      data = [op]
    } else {
      data.push(op)
    }
    op = getNextTx()
  }
  sections.push({ day, data })
  return {
    sections,
    completed: !op
  }
}

export const isSetupTransaction = (tx: WalletModel.ProcessedTransaction): boolean => {
  // Check if all inputs are from the wallet
  const inputCheck = every(tx.inputs, (i: WalletModel.ProcessedInput) => i.walletaddress)
  // Check if all outputs are from the wallet if the type is "siacoin output"
  const outputCheck = every(tx.outputs, (o: WalletModel.ProcessedOutput) =>
    o.fundtype === 'siacoin output' ? o.walletaddress : true
  )
  // if (tx.transactionid == 'e366aaf58e235a64fdc11a647e8951570a15bfe05d1b738250da7afd0b474cf1') {
  //   console.log('hi lol', tx, inputCheck, outputCheck)
  // }
  return inputCheck && outputCheck
}

// export const isMinerPayout = (tx: WalletModel.ProcessedTransaction): boolean => {
//   // Check output
//   const inputChec
// }

const sumCurrency = (txns: any, currency: string) => {
  return txns.reduce((sum: BigNumber, t: any) => {
    if (t.fundtype.indexOf(currency) > -1) {
      return sum.plus(new BigNumber(t.value))
    }
    return sum
  }, new BigNumber(0))
}

export function formatBytes(a: any, b?: any) {
  if (0 == a) return '0 Bytes'
  var c = 1024,
    d = b || 2,
    e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

export const computeTxSum = (txn: WalletModel.ProcessedTransaction) => {
  let totalSiacoinInput = new BigNumber(0)
  let totalSiafundInput = new BigNumber(0)
  let totalMinerInput = new BigNumber(0)

  let totalSiacoinOuput = new BigNumber(0)
  let totalSiafundOutput = new BigNumber(0)
  let totalMinerOutput = new BigNumber(0)
  let labels = [] as any

  if (txn.inputs) {
    const walletInputs = txn.inputs.filter(i => i.walletaddress && i.value)
    totalSiacoinInput = sumCurrency(walletInputs, 'siacoin')
    totalSiafundInput = sumCurrency(walletInputs, 'siafund')
    totalMinerInput = sumCurrency(walletInputs, 'miner')
  }
  if (txn.outputs) {
    const walletOutputs = txn.outputs.filter(
      o => o.walletaddress && o.value && o.maturityheight === txn.confirmationheight
    )
    totalSiacoinOuput = sumCurrency(walletOutputs, 'siacoin')
    totalSiafundOutput = sumCurrency(walletOutputs, 'siafund')
    totalMinerOutput = sumCurrency(txn.outputs, 'miner')
  }

  // Calculation totals
  const totalSiacoin = toSiacoins(totalSiacoinOuput.minus(totalSiacoinInput) as any).toFixed(2)
  const totalSiafund = totalSiafundOutput.minus(totalSiafundInput).toFixed(0)
  const totalMiner = toSiacoins(totalMinerOutput.minus(totalMinerInput) as any).toFixed(2)

  // add labels
  if (parseFloat(totalSiacoin) !== 0) {
    labels.push(WalletModel.TransactionTypes.SCPRIMECOIN)
  }

  if (parseFloat(totalSiafund) !== 0) {
    labels.push(WalletModel.TransactionTypes.SCPRIMEFUND)
  }

  if (txn.transaction.filecontracts && txn.transaction.filecontracts.length > 0) {
    labels.push(WalletModel.TransactionTypes.CONTRACT)
  }

  if (txn.transaction.filecontractrevisions && txn.transaction.filecontractrevisions.length > 0) {
    labels.push(WalletModel.TransactionTypes.REVISION)
  }

  if (txn.transaction.storageproofs && txn.transaction.storageproofs.length > 0) {
    labels.push(WalletModel.TransactionTypes.PROOF)
  }

  if (isSetupTransaction(txn)) {
    labels.push(WalletModel.TransactionTypes.SETUP)
  }

  // // checks i
  // if (isMinerPayout())

  if (
    txn.transaction.siacoininputs &&
    txn.transaction.siacoinoutputs &&
    txn.transaction.siacoininputs.length === 0 &&
    txn.transaction.siafundinputs.length === 0
  ) {
    labels.push(WalletModel.TransactionTypes.BLOCK)
  }

  if (
    txn.transaction.siacoininputs &&
    txn.transaction.siacoinoutputs &&
    txn.transaction.siacoininputs.length >= 20 &&
    txn.transaction.siacoinoutputs.length === 1
  ) {
    labels.push(WalletModel.TransactionTypes.DEFRAG)
  }

  // Create labels
  return {
    transaction: txn,
    totalSiacoin,
    totalSiafund,
    totalMiner,
    labels
  }
}

export function arrayUnique(array) {
  var a = array.concat()
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1)
    }
  }

  return a
}

export * from './validators'
