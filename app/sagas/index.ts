import { ConsensusActions, GatewayActions, GlobalActions } from 'actions'
import { notification } from 'antd'
import { siad } from 'api/siad'
import { ConsensusModel, GatewayModel } from 'models'
import { SagaIterator } from 'redux-saga'
import { actionChannel, all, call, delay, take, takeLatest } from 'redux-saga/effects'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'

import { hostSagas } from './host'
import { pollingSagas } from './polling'
import { renterSagas } from './renter'
import { wrapSpawn } from './utility'
import { walletSagas } from './wallet'

// Consensus Workers

// calls the /consensus endpoint and passes the success data down to the fetchConsensus action.
export const consensusWorker = bindAsyncAction(ConsensusActions.fetchConsensus, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: ConsensusModel.ConsensusGETResponse = yield call(siad.call, '/consensus')
  return response
})

// Gateway Workers

// calls the /gateway endpoint and passes the success data down to the fetchGateway action.
export const gatewayWorker = bindAsyncAction(GatewayActions.fetchGateway, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: GatewayModel.GetwayGET = yield call(siad.call, '/gateway')
  return response
})

// processes any notifications coming down from the notification action channel,
// displays the notification, and then waits 3s before processing the next one.
function* notificationQueue() {
  const notifyChan = yield actionChannel(GlobalActions.notification)
  while (true) {
    const { payload } = yield take(notifyChan)
    notification[payload.type]({
      message: payload.title,
      description: payload.message
    })
    yield delay(3000)
  }
}

// Root Sagas that spin all all child sagas for processing.
export default function* rootSaga() {
  yield all([
    takeLatest(GatewayActions.fetchGateway.started, wrapSpawn(gatewayWorker)),
    takeLatest(ConsensusActions.fetchConsensus.started, wrapSpawn(consensusWorker)),
    notificationQueue(),
    ...walletSagas,
    ...pollingSagas,
    ...renterSagas,
    ...hostSagas
  ])
}
