import * as React from 'react'
import { Spinner, Flex } from 'components/atoms'

export const IsLoadedHOC = ({ loading, Component }) => {
  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100%">
        <Spinner />
      </Flex>
    )
  } else {
    return <Component />
  }
}
