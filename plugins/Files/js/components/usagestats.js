import React from 'react'

// UsageStats defines the presentation component for displaying file spending.
const UsageStats = ({
  allowance,
  renewheight,
  contractfees,
  storagespending,
  uploadspending,
  downloadspending,
  totalallocated,
  unspent
}) => {
  if (allowance === 0) {
    return null
  }
  const totalSpending =
    contractfees + uploadspending + downloadspending + storagespending

  return (
    <div className='files-usage-info'>
      <div className='spending-container'>
        <div
          style={{
            width: Math.min(100, totalSpending / allowance * 100) + '%'
          }}
          className='spending-bar'
        >
          <div
            style={{ width: contractfees / totalSpending * 100 + '%' }}
            className='contract-spending'
          />
          <div
            style={{ width: storagespending / totalSpending * 100 + '%' }}
            className='storage-spending'
          />
          <div
            style={{ width: downloadspending / totalSpending * 100 + '%' }}
            className='download-spending'
          />
          <div
            style={{ width: uploadspending / totalSpending * 100 + '%' }}
            className='upload-spending'
          />
        </div>
      </div>
      <p className='remaining-text'>{unspent} SCP remaining</p>
      <div className='spending-breakdown'>
        <ul>
          <li className='allowance-spending-breakdown'>
            Allowance: {allowance} SCP
          </li>
          <li className='renew-info'>Renews at Block Height: {renewheight}</li>
          <li className='contract-spending-breakdown'>
            Fees: {contractfees} SCP
          </li>
          <li className='storage-spending-breakdown'>
            Storage Fees: {storagespending} SCP
          </li>
          <li className='upload-spending-breakdown'>
            Upload Fees: {uploadspending} SCP
          </li>
          <li className='download-spending-breakdown'>
            Download Fees: {downloadspending} SCP
          </li>
          <li className='allocated-spending-breakdown'>
            Unspent (Allocated): {(totalallocated - totalSpending).toFixed(2)}{' '}
            SCP
          </li>
          <li className='unallocated-spending-breakdown'>
            Unspent (Unallocated):{' '}
            {unspent - (totalallocated - totalSpending).toFixed(2)} SCP
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UsageStats
