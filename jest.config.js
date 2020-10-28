const { defaults: tsjPreset } = require('ts-jest/presets')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.json')

const mockModules = {
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    '<rootDir>/internals/mocks/fileMock.js',
  '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
}

const configPaths = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/app/' })
const moduleNames = Object.assign(mockModules, configPaths)

module.exports = {
  moduleNameMapper: moduleNames,
  transform: {
    ...tsjPreset.transform
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/?(*.)(spec|test).ts?(x)']
}

// Old config
// "jest": {
//   "moduleNameMapper": {
//     "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/internals/mocks/fileMock.js",
//     "\\.(css|less|sass|scss)$": "identity-obj-proxy"
//   },
//   "moduleFileExtensions": [
//     "ts",
//     "tsx",
//     "js"
//   ],
//   "moduleDirectories": [
//     "node_modules",
//     "app/node_modules"
//   ],
//   "transform": {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   },
//   "testMatch": [
//     "**/?(*.)(spec|test).ts?(x)"
//   ]
// },
