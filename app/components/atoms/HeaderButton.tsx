import * as React from 'react'
import { AppIconButton } from '.'
import { Tooltip } from 'antd'

export const HeaderButton = ({ handleClick, iconType, tooltipTitle }) => {
  return (
    <Tooltip title={tooltipTitle}>
      <div onClick={handleClick}>
        <AppIconButton iconType={iconType} />
      </div>
    </Tooltip>
  )
}
