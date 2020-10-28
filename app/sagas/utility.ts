import { spawn } from 'redux-saga/effects'

// wrapSpawn returns a generator function that simply spawns the function that
// is passed as an arguement, basically currying the function for later execution.
export const wrapSpawn = fn => {
  return function* g() {
    yield spawn(fn)
  }
}
