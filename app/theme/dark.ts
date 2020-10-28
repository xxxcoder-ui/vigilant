import { theme } from './index'
import { blacks } from './colors'

export const dark = Object.assign({}, theme, {
  colors: {
    black: '#000',
    'near-black': '#fff',
    'dark-gray': '#eee',
    'mid-gray': '#eee',
    gray: ' #777',
    silver: '#999',
    'light-silver': '#aaa',
    'moon-gray': '#ccc',
    'light-gray': '#333',
    'near-white': '#202124',
    'sia-green': '#1ED660',
    white: '#292C2F',
    transparent: 'transparent',
    // colors
    blacks: blacks,
    // base
    bg: blacks[0],
    'sidebar-bg': blacks[1],
    'modal-body': '#292C2F',
    'modal-header-bg': blacks[0],
    'card-bg': blacks[1],
    'card-bg-dark': blacks[0],
    // input
    'input-bg': blacks[0],
    'input-border': blacks[3],
    // button
    'button-bg': blacks[2],
    'button-bg-hover': blacks[1],
    'button-border': blacks[3],
    // text
    text: '#fefefe',
    'text-subdued': '#999',
    // scrollerbar
    'scrollbar-bg': blacks[2],
    // tag
    'tag-bg': blacks[3],
    'tag-text': '#fefefe',
    // tooltip
    'tooltip-bg': blacks[2],
    'tooltip-text': '#fefefe',
    // notification
    'notify-bg': blacks[2],
    // dropdown
    'dropdown-bg': blacks[1],
    'dropdown-border': blacks[2]
  }
})
