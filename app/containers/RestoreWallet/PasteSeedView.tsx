import { Input } from 'antd'
import { Box, Card, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import * as React from 'react'

export const PasteSeedView = ({ onChange }) => {
  const [seedInput, setInput] = React.useState('')
  const validSeedLength = React.useMemo(() => {
    if (seedInput.length > 0) {
      const s = seedInput.split(' ')
      if (s.length === 28 || s.length === 29) {
        return true
      } else {
        return false
      }
    }
    return true
  }, [seedInput])

  return (
    <Box>
      <Card mb={4}>
        <Flex alignItems="center">
          <Box mx={4}>
            <svg height={50} width={50} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <title>key</title>
              <g fill="#32d66a" stroke="#32d66a" strokeLinecap="square" strokeWidth="2">
                <path
                  d="M25,1,12.784,13.154a8.572,8.572,0,1,0,6.061,6.061L21,17V13h4V9h3l3-3V1Z"
                  fill="none"
                  stroke="#32d66a"
                />
                <circle cx="10" cy="22" fill="none" r="3" />
              </g>
            </svg>
          </Box>
          <Box>
            <Text fontSize={2}>
              Please enter your seed into the box below. Ensure that all letters are lowercase and
              that each word is separated by a single space.
            </Text>
          </Box>
        </Flex>
      </Card>
      <Box width="100%">
        <Input
          onChange={e => {
            setInput(e.target.value)
            onChange(e)
          }}
          value={seedInput}
        />
        {!validSeedLength && <Text color="red">Your seed must be 28 to 29 words.</Text>}
      </Box>
    </Box>
  )
}
