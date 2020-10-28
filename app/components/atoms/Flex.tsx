import * as React from 'react'
import {
  alignItems,
  alignContent,
  alignSelf,
  justifyContent,
  flexWrap,
  flex,
  flexBasis,
  flexDirection,
  FlexBasisProps,
  FlexProps,
  AlignItemsProps,
  AlignContentProps,
  AlignSelfProps,
  JustifyContentProps,
  FlexWrapProps,
  FlexDirectionProps,
  background,
  BackgroundProps
} from 'styled-system'
import styled from 'styled-components'
import { Box, BoxProps } from './Box'

export type FlexBoxProps = BoxProps &
  FlexProps &
  AlignItemsProps &
  AlignContentProps &
  AlignSelfProps &
  JustifyContentProps &
  FlexWrapProps &
  FlexBasisProps &
  FlexDirectionProps &
  BackgroundProps

export const Flex = styled(Box)<FlexBoxProps>`
  ${flex}
  ${alignItems}
  ${alignContent}
  ${alignSelf}
  ${justifyContent}
  ${flexWrap}
  ${flexBasis}
  ${flexDirection}
  ${background}
`

Flex.defaultProps = {
  display: 'flex'
}

Flex.displayName = 'Flexbox'
