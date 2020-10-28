import React from 'react'
import './HeaderCell.less'
import { SVG } from '@opuscapita/react-svg'
import { SortDirection } from 'react-virtualized'

import sortASCIcon from '@opuscapita/svg-icons/lib/arrow_drop_down.svg'
import sortDESCIcon from '@opuscapita/svg-icons/lib/arrow_drop_up.svg'

export default () => ({
  /* eslint-disable react/prop-types */
  columnData,
  dataKey,
  disableSort,
  label,
  sortBy,
  sortDirection
  /* eslint-enable react/prop-types */
}) => {
  const sortIconSVG = sortDirection === SortDirection.ASC ? sortDESCIcon : sortASCIcon
  const sortIconElement =
    dataKey === sortBy ? <SVG className="oc-fm--header-cell__sort-icon" svg={sortIconSVG} /> : null

  return (
    <div className="oc-fm--header-cell">
      {label}
      {sortIconElement}
    </div>
  )
}
