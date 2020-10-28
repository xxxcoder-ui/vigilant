import * as React from 'react'
import styled from 'styled-components'
import {
  gridArea,
  GridAreaProps,
  gridAutoColumns,
  GridAutoColumnsProps,
  gridAutoFlow,
  GridAutoFlowProps,
  gridAutoRows,
  GridAutoRowsProps,
  gridColumn,
  gridColumnGap,
  GridColumnProps,
  gridGap,
  GridGapProps,
  gridRow,
  gridRowGap,
  GridRowGapProps,
  GridRowProps,
  gridTemplateAreas,
  gridTemplateColumns,
  gridTemplateRows,
  GridTemplatesAreasProps,
  GridTemplatesColumnsProps,
  GridTemplatesRowsProps
} from 'styled-system'

import { BoxProps } from './Box'
import { Flex } from './Flex'

export type GridBoxProps = BoxProps &
  GridGapProps &
  GridColumnProps &
  GridRowGapProps &
  GridColumnProps &
  GridRowProps &
  GridAutoFlowProps &
  GridAutoColumnsProps &
  GridAutoRowsProps &
  GridTemplatesColumnsProps &
  GridTemplatesRowsProps &
  GridTemplatesAreasProps &
  GridAreaProps

export const Grid = styled(Flex)<GridBoxProps>`
  ${gridGap}
  ${gridColumnGap}
  ${gridRowGap}
  ${gridColumn}
  ${gridRow}
  ${gridAutoFlow}
  ${gridAutoColumns}
  ${gridAutoRows}
  ${gridTemplateColumns}
  ${gridTemplateRows}
  ${gridTemplateAreas}
  ${gridArea}
`

Grid.defaultProps = {
  display: 'grid'
}

Grid.displayName = 'Gridbox'
