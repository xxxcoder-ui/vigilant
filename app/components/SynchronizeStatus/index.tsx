import { Icon, Tooltip } from 'antd'
import { Box, Text, TextWithAdornment } from 'components/atoms'
import { ConsensusModel } from 'models'
import * as React from 'react'
import styled from 'styled-components'
import { hashrateParser } from 'lib/hashrateParser'
import { StyledIcon } from 'components/atoms/StyledIcon'
import { StyledTooltip } from 'components/atoms/StyledTooltip'

const BoldText = ({ children }: any) => (
  <Text fontWeight={600} color="text">
    {children}
  </Text>
)
const StatText = ({ children }: any) => <Text color="text">{children}</Text>

interface StatProps {
  title: string
  stat: string
}

const TextOverflow = styled(Box)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
`

const Stat = ({ title, stat }: StatProps) => (
  <TextOverflow>
    <BoldText>{title}: </BoldText>
    <StatText>{stat}</StatText>
  </TextOverflow>
)

type SyncStatusProps = Partial<ConsensusModel.ConsensusGETResponse>

export default ({ synced, height, currentblock, difficulty }: SyncStatusProps) => {
  let hash = currentblock
  if (currentblock) {
    hash = currentblock.slice(0, 5) + '...' + currentblock.slice(-5)
  }
  const parsedDiff = hashrateParser(difficulty as any)
  return (
    <Tooltip
      placement="leftBottom"
      title={() => (
        <Box>
          <Stat title="Block Height" stat={`${height.toLocaleString('en-US')}`} />
          <Stat title="Block Hash" stat={`${hash}`} />
          <Stat title="Difficulty" stat={`${parsedDiff}`} />
        </Box>
      )}
    >
      {synced ? (
        <TextWithAdornment is="div" after={<StyledIcon type="check-circle" />} fontWeight={500}>
          Synced
        </TextWithAdornment>
      ) : (
        <TextWithAdornment after={<StyledIcon type="loading" />} fontWeight={500}>
          Syncing
        </TextWithAdornment>
      )}
    </Tooltip>
  )
}
