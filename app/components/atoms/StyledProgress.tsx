import styled from 'styled-components'
import { Progress } from 'antd'
import { themeGet } from 'styled-system'

export const StyledProgress = styled(Progress)`
  .ant-progress-text {
    color: ${themeGet('colors.text')};
  }
`
