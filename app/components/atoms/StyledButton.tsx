import styled from 'styled-components'
import { Button } from 'antd'
import {
  color,
  ColorProps,
  width,
  border,
  fontWeight,
  FontWeightProps,
  space,
  height,
  themeGet,
  HeightProps,
  BorderProps,
  WidthProps,
  SpaceProps,
  borderColor,
  BorderColorProps
} from 'styled-system'
import { ButtonProps } from 'antd/lib/button'
import { NativeButtonProps } from 'antd/lib/button/button'

// TODO fix TS handling. any is a temporary workaround.

export const StyledButton = styled(Button)<ButtonProps>`
  text-shadow: none;
  background: ${themeGet('colors.button-bg')};
  color: ${themeGet('colors.text')};
  border-color: ${themeGet('colors.button-border')};
  &.ant-btn-ghost {
    color: ${themeGet('colors.near-black')};
  }
  &:hover,
  &:focus,
  &:active {
    background: ${themeGet('colors.button-bg-hover')};
    color: ${themeGet('colors.text')};
  }
`

export const StyledButtonGroup = styled(Button.Group)`
  & > .ant-btn:hover {
    border-color: ${themeGet('colors.sia-green')} !important;
  }
`
