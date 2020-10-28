import styled from 'styled-components'
import { Tabs } from 'antd'
import { themeGet } from 'styled-system'

export const StyledTabs = styled(Tabs)`
  &.ant-tabs {
    color: ${themeGet('colors.text')} !important;
  }
`
