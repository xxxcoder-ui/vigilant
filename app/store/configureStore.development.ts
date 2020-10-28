import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import rootSaga from 'sagas'

import rootReducer, { IndexState } from '../reducers'

// import { routerMiddleware, push } from 'react-router-redux'
declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?(a: any): void
}

declare const module: NodeModule & {
  hot?: {
    accept(...args: any[]): any
  }
}

// logger is removed from the pipeline for now
const logger = (<any>createLogger)({
  level: 'info',
  collapsed: true
})

const sagaMiddleware = createSagaMiddleware()
const history = createHashHistory()
const router = routerMiddleware(history)

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers: typeof compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      maxAge: 25,
      actionSanitizer: (action: any) => {
        return { ...action, payload: '<<PAYLOAD>>' }
      },
      stateSanitizer: (state: IndexState) => {
        return {
          ...state,
          ...{
            wallet: {
              ...state.wallet,
              transactions: '<<TRANSACTIONS>>',
              receive: {
                ...state.wallet.receive,
                addresses: '<<RECEIVE_ADDRESSES>>'
              }
            }
          }
        }
      }
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
    }) as any)
  : compose
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(applyMiddleware(thunk, sagaMiddleware, router))

const configureStore = (initialState: any | void) => {
  const store = createStore(connectRouter(history)(rootReducer), initialState, enhancer)

  // if (module.hot) {
  //   module.hot.accept(
  //     '../reducers',
  //     () => store.replaceReducer(require('../reducers').default) // eslint-disable-line global-require
  //   )
  // }

  sagaMiddleware.run(rootSaga)
  return store
}

export default {
  history,
  configureStore
}
