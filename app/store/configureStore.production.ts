import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import rootSaga from 'sagas'

import rootReducer from '../reducers'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory()
const router = routerMiddleware(history)

const enhancer = compose(applyMiddleware(thunk, sagaMiddleware, router))
const configureStore = (initialState: any) => {
  const store = createStore(connectRouter(history)(rootReducer), initialState, enhancer)

  sagaMiddleware.run(rootSaga)
  return store
}

export { history, configureStore }
