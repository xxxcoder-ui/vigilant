import { Icon } from 'antd'
import styled from 'styled-components'
import { color, ColorProps, themeGet } from 'styled-system'
import { IconProps } from 'antd/lib/icon'
import Tag, { TagProps } from 'antd/lib/tag'

export const StyledTag = styled(Tag)`
  background: ${themeGet('colors.tag-bg')} !important;
  border-color: ${themeGet('colors.tag-bg')} !important;
  color: ${themeGet('colors.tag-text')} !important;
`
