import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { themeGet } from 'styled-system'
import { InputProps } from 'antd/lib/input'

// TODO: not typed very well. Can get confusing.
const inputStates = {
  error: themeGet('red'),
  success: themeGet('scprime-blue')
}

type StyledInputProps = InputProps & { state?: 'error' | 'success' }

const inputStyles = css<StyledInputProps>`
  background: ${themeGet('colors.input-bg')};
  font-size: ${themeGet('fontSizes.1')}px;
  color: ${themeGet('colors.text')};
  border: 1px solid
    ${props => (props.state ? inputStates[props.state] : themeGet('colors.input-border'))};
`

export const StyledInput = styled(Input)<StyledInputProps>`
  ${inputStyles}
`

export const StyledInputPassword = styled(Input.Password)`
  .ant-input-group,
  &.ant-input-affix-wrapper {
    input,
    .ant-input {
      ${inputStyles}
    }
  }
  .ant-input-suffix > i {
    color: ${themeGet('colors.text')};
  }
`

export const StyledInputGroup = styled(Input)`
  .ant-input-group,
  &.ant-input-affix-wrapper {
    input,
    .ant-input {
      ${inputStyles}
    }
  }
`
