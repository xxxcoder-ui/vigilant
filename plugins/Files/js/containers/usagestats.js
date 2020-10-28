import UsageStatsView from '../components/usagestats.js'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  allowance: state.files.get('allowance'),
  renewheight: state.files.get('renewheight'),
  contractfees: state.files.get('contractfees'),
  storagespending: state.files.get('storagespending'),
  uploadspending: state.files.get('uploadspending'),
  downloadspending: state.files.get('downloadspending'),
  totalallocated: state.files.get('totalallocated'),
  unspent: state.files.get('unspent')
})

const UsageStats = connect(mapStateToProps)(UsageStatsView)
export default UsageStats
