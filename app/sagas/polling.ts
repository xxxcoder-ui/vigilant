import { GlobalActions, HostActions, RenterActions, WalletActions } from 'actions'
import { siad } from 'api/siad'
import { call, cancel, delay, fork, put, select, spawn, take } from 'redux-saga/effects'
import { consensusWorker, gatewayWorker } from 'sagas'
import { selectTransactionHeight } from 'selectors'

import { activeHostWorker } from './host'
import { getContractsWorker, getFeeWorker, getRenterWorker } from './renter'
import { getTpoolFees, getTransactionsWorker, getWalletWorker } from './wallet'

/* Poll Calls
  Calls define the actual workers that are spawned in each poll iteration
  loop. It can also describe sideeffect actions that aren't necessarily api
  calls, but note that those side effects will be called every loop as well.
*/

function* globalPollCalls() {
  yield spawn(gatewayWorker)
  yield spawn(consensusWorker)
  yield spawn(activeHostWorker)
}

function* walletPollCalls() {
  const sinceHeight = yield select(selectTransactionHeight)
  yield spawn(getWalletWorker)
  yield spawn(getTransactionsWorker, { count: 100, sinceHeight })
  yield spawn(getTpoolFees)
}

function* renterPollCalls() {
  yield spawn(getContractsWorker)
  yield spawn(getFeeWorker)
  yield spawn(getRenterWorker)
}

/* Poll Tasks
  Tasks define the side-effects (such as a delays) of the poll, and puts the
  poll into a loop. This is generally forked from the main saga thread.
 */

function* globalPollTask() {
  yield put(WalletActions.requestInitialData())
  while (true) {
    yield globalPollCalls()
    yield delay(5000)
  }
}

function* walletPollTask() {
  while (true) {
    yield call(walletPollCalls)
    yield delay(5000)
  }
}

function* renterPollTask() {
  while (true) {
    yield call(renterPollCalls)
    yield delay(5000)
  }
}

function* hostPollTask() {
  while (true) {
    yield put(HostActions.getHostConfig.started())
    yield put(HostActions.getHostStorage.started())
    yield delay(5000)
  }
}

/* Poll Watchers
  Watchers watch for an incoming start poll action and will spin off a task
  in another thread. It will then pause and wait for a stop poll action before
  cancelling the poller.
 */

function* startGlobalPolling() {
  while (true) {
    yield take(GlobalActions.startPolling)
    const bgSync = yield fork(globalPollTask)
    yield take(GlobalActions.stopPolling)
    yield cancel(bgSync)
  }
}

function* startWalletPolling() {
  while (true) {
    yield take(WalletActions.startPolling)
    const bgSync = yield fork(walletPollTask)
    yield take(WalletActions.stopPolling)
    yield cancel(bgSync)
  }
}

function* startRenterPolling() {
  while (true) {
    yield take(RenterActions.startPolling)
    const bgSync = yield fork(renterPollTask)
    yield take(RenterActions.stopPolling)
    yield cancel(bgSync)
  }
}

function* startHostPolling() {
  while (true) {
    yield take(HostActions.startPolling)
    const bgSync = yield fork(hostPollTask)
    yield take(HostActions.stopPolling)
    yield cancel(bgSync)
  }
}

// Siad Polling
function* pollSiad() {
  let notificationTriggered = false
  while (true) {
    const running = yield call(siad.isRunning)
    if (running) {
      yield put(GlobalActions.siadLoaded())
      if (!notificationTriggered) {
        notificationTriggered = true
        yield put(
          GlobalActions.notification({
            title: 'Started Polling',
            message: 'ScPrime-UI established a connection with ScPrime',
            type: 'open'
          })
        )
      }
    } else {
      yield put(GlobalActions.siadOffline())
      yield put(GlobalActions.stopPolling())
    }
    yield delay(3000)
  }
}

function* siadPoller() {
  while (yield take(GlobalActions.startSiadPolling)) {
    const bgPoll = yield fork(pollSiad)
    yield take(GlobalActions.stopSiadPolling)
    yield cancel(bgPoll)
  }
}

export const pollingSagas = [
  startGlobalPolling(),
  startRenterPolling(),
  startWalletPolling(),
  startHostPolling(),
  siadPoller()
]
