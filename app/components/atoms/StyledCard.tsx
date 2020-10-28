import styled from 'styled-components'
import { Card } from 'antd'
import { themeGet } from 'styled-system'

export const StyledCard = styled(Card)`
  .ant-card-body {
    background: ${themeGet('colors.card-bg-dark')};
    color: ${themeGet('colors.text')};
  }
`
