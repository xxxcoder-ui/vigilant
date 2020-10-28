declare module '*.svg' {
  var x: any
  export default x
}

declare module '*.jpg' {
  var x: any
  export default x
}

declare module '*.png' {
  var x: any
  export default x
}

declare module '*.ttf' {
  var x: any
  export default x
}

declare module '*.otf' {
  var x: any
  export default x
}

// Omit type https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>
