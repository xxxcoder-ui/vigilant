import * as React from 'react'
import styled from 'styled-components'
import {
  background,
  BackgroundProps,
  borderRadius,
  BorderRadiusProps,
  boxShadow,
  color,
  ColorProps,
  display,
  DisplayProps,
  fontSize,
  FontSizeProps,
  gridColumn,
  GridColumnProps,
  height,
  HeightProps,
  left,
  LeftProps,
  maxWidth,
  MaxWidthProps,
  minHeight,
  MinHeightProps,
  overflow,
  OverflowProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  top,
  TopProps,
  width,
  WidthProps,
  maxHeight,
  MaxHeightProps
} from 'styled-system'

export type BoxProps = SpaceProps &
  DisplayProps &
  PositionProps &
  WidthProps &
  HeightProps &
  ColorProps &
  BackgroundProps &
  FontSizeProps &
  MaxWidthProps &
  MinHeightProps &
  TextAlignProps &
  OverflowProps &
  GridColumnProps &
  BorderRadiusProps &
  MaxHeightProps &
  LeftProps &
  TopProps

export const Box = styled.div<BoxProps>`
  ${display}
  ${position}
  ${space}
  ${width}
  ${maxWidth}
  ${maxHeight}
  ${minHeight}
  ${height}
  ${color}
  ${background}
  ${fontSize}
  ${textAlign}
  ${boxShadow}
  ${overflow}
  ${gridColumn}
  ${borderRadius}
  ${left}
  ${top}
`
Box.displayName = 'Box'

Box.defaultProps = {
  position: 'relative'
}
