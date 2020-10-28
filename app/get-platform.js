const { platform } = require('os')

module.exports = () => {
  switch (platform()) {
    case 'darwin':
    case 'sunos':
      return 'mac'
    case 'win32':
      return 'win'
    default:
      return 'linux'
  }
}
