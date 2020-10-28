import { whites } from './colors'

export const theme = {
  breakpoints: [32, 48, 64],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [10, 12, 14, 16, 20, 24, 36, 48, 80, 96],
  fontWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5
  },
  letterSpacings: {
    normal: 'normal',
    tracked: '0.1em',
    tight: '-0.05em',
    mega: '0.25em'
  },
  fonts: {
    serif: 'sans-serif',
    sansSerif:
      'Metropolis, -apple-system, BlinkMacSystemFont, "avenir next", avenir, "helvetica neue", helvetica, ubuntu, roboto, noto, "segoe ui", arial, sans-serif'
  },
  borders: [0, '1px solid', '2px solid', '4px solid', '8px solid', '16px solid', '32px solid'],
  radii: [0, 2, 4, 16, 9999, '100%'],
  width: [16, 32, 64, 128, 256],
  heights: [16, 32, 64, 128, 256],
  maxWidths: [16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  boxShadow: [
    '0 1px 5px 0 rgba(63, 63, 68, 0.05)',
    '0 0 0 1px rgba(6, 44, 82, 0.1), 0 2px 16px rgba(33, 43, 54, 0.08)'
  ],
  colors: {
    black: '#000',
    'near-black': '#111',
    'dark-gray': '#333',
    'mid-gray': '#444',
    gray: ' #777',
    silver: '#999',
    'light-silver': '#aaa',
    'moon-gray': '#ccc',
    'light-gray': '#eee',
    'near-white': '#f9f9f9',
    'scprime-blue': '#2074ee',
    almostwhite: '#fefdfd',
    'text-light': '#fff',
    white: '#fff',
    transparent: 'transparent',
    blacks: [
      'rgba(0,0,0,.0125)',
      'rgba(0,0,0,.025)',
      'rgba(0,0,0,.05)',
      'rgba(0,0,0,.1)',
      'rgba(0,0,0,.2)',
      'rgba(0,0,0,.3)',
      'rgba(0,0,0,.4)',
      'rgba(0,0,0,.5)',
      'rgba(0,0,0,.6)',
      'rgba(0,0,0,.7)',
      'rgba(0,0,0,.8)',
      'rgba(0,0,0,.9)'
    ],
    whites: [
      'rgba(255,255,255,.0125)',
      'rgba(255,255,255,.025)',
      'rgba(255,255,255,.05)',
      'rgba(255,255,255,.1)',
      'rgba(255,255,255,.2)',
      'rgba(255,255,255,.3)',
      'rgba(255,255,255,.4)',
      'rgba(255,255,255,.5)',
      'rgba(255,255,255,.6)',
      'rgba(255,255,255,.7)',
      'rgba(255,255,255,.8)',
      'rgba(255,255,255,.9)'
    ],
    // base
    bg: whites[0],
    'sidebar-bg': whites[1],
    'modal-body': whites[1],
    'modal-header-bg': whites[1],
    'card-bg': whites[1],
    'card-bg-dark': whites[2],
    // input
    'input-bg': whites[0],
    'input-border': whites[3],
    // button
    'button-bg': whites[2],
    'button-bg-hover': whites[1],
    'button-border': whites[3],
    // text
    text: '#222',
    'text-subdued': '#999',
    // scrollbar
    'scrollbar-bg': '#fefefe',
    // tag
    'tag-bg': whites[0],
    'tag-text': '#555',
    // tooltip
    'tooltip-bg': whites[2],
    'tooltip-text': '#222',
    // notification
    'notify-bg': whites[1],
    // dropdown
    'dropdown-bg': whites[1],
    'dropdown-border': whites[2]
  }
}
