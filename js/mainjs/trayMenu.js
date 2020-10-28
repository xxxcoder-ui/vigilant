import { Menu } from 'electron'

export default function (window) {
  // Template for SiaPrime-UI tray menu.
  const menutemplate = [
    {
      label: 'Show ScPrime',
      click: () => window.show()
    },
    { type: 'separator' },
    {
      label: 'Hide ScPrime',
      click: () => window.hide()
    },
    { type: 'separator' },
    {
      label: 'Quit ScPrime',
      click: () => {
        window.webContents.send('quit')
      }
    }
  ]

  return Menu.buildFromTemplate(menutemplate)
}
