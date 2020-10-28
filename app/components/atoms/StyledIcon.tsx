import { Icon } from 'antd'
import styled from 'styled-components'
import { color, ColorProps } from 'styled-system'
import { IconProps } from 'antd/lib/icon'

export const StyledIcon = styled<ColorProps & IconProps>(Icon)`
  ${color}
`

StyledIcon.defaultProps = {
  color: 'near-black'
}
