// This set of functions parse hashrates for most coins.
const hashratePH = (h: number): number => h / 1000000000000000
const hashrateTH = (h: number): number => h / 1000000000000
const hashrateGH = (h: number): number => h / 1000000000
const hashrateMH = (h: number): number => h / 1000000
const hashrateKH = (h: number): number => h / 1000

const unitTypes: any = {
  default: ['H', 'KH', 'MH', 'GH', 'TH', 'PH'],
  sols: ['Sols', 'KSols', 'MSols', 'GSols', 'TSols', 'PSols'],
  graphs: ['Graphs', 'KGraphs', 'MGraphs', 'GGraphs', 'TGraphs', 'PGraphs']
}

/**
 * Converts a hashrate base unit to it's relative unit type.
 * @param hr
 * @param unit
 */
export function hashrateParser(hr: number, unit: string = 'default') {
  const hashUnit = unitTypes[unit]
  if (hr <= 1e3) {
    return hr.toFixed(2) + ' ' + hashUnit[0]
  } else if (hr <= 1e6) {
    return hashrateKH(hr).toFixed(2) + ' ' + hashUnit[1]
  } else if (hr <= 1e9) {
    return hashrateMH(hr).toFixed(2) + ' ' + hashUnit[2]
  } else if (hr <= 1e12) {
    return hashrateGH(hr).toFixed(2) + ' ' + hashUnit[3]
  } else if (hr <= 1e15) {
    return hashrateTH(hr).toFixed(2) + ' ' + hashUnit[4]
  } else {
    return hashratePH(hr).toFixed(2) + ' ' + hashUnit[5]
  }
}

export function hashrateToBaseUnit(hashrate: string): number {
  let baseUnit = null
  let power = 0
  const splitUnit = hashrate.split(' ')
  const hr = splitUnit[0]
  const unit = splitUnit[1]

  for (const k in unitTypes) {
    const l = unitTypes[k]
    if (l.includes(unit)) {
      baseUnit = l
      power = l.indexOf(unit)
      break
    }
  }
  // return 0 if the unit is not recognized
  if (!baseUnit) {
    return 0
  }
  // power the hr
  const result = parseFloat(hr) ^ (power * 3)
  return result
}

export const hashrateSorter = (x: string, y: string) =>
  hashrateToBaseUnit(x) - hashrateToBaseUnit(y)
