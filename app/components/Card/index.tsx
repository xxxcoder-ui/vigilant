import { Caps, Card, Text } from 'components/atoms'
import * as React from 'react'

interface StatProps {
  content: any
  title: any
}
export const Stat = ({ content, title, ...props }: StatProps & any) => (
  <Card mx={2} {...props}>
    <Text fontSize={4} color="near-black" is="div">
      {content}
    </Text>
    <Caps color="text-subdued" fontSize={0}>
      {title}
    </Caps>
  </Card>
)
