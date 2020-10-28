import system from '@rebass/components'
import { Button, Icon, AutoComplete, Spin } from 'antd'
import { shell } from 'electron'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import styled from 'styled-components'
import { Box } from './Box'
import { Flex } from './Flex'
import { themeGet } from 'styled-system'
import { StyledIcon } from './StyledIcon'
import { StyledButton } from './StyledButton'

export const defaultFieldState = {
  value: undefined,
  validateStatus: undefined,
  help: undefined
}

export interface FormItemProps {
  value: string | undefined | number
  validateStatus: 'success' | 'warning' | 'error' | 'validating' | undefined
  help: string | undefined
}

export const ElectronLink = ({ href, children }: any) => {
  const onClick = () => shell.openExternal(href)
  return (
    <a href="#" onClick={onClick}>
      {children}
    </a>
  )
}

export const OverflowBox = styled(Box)`
  overflow-y: auto;
`

export const Card = styled(Box)`
  box-shadow: ${(props: any) => props.theme.boxShadow[0]};
`

Card.defaultProps = {
  p: 3,
  borderRadius: 2,
  bg: 'card-bg'
}

export const Text = system(
  {
    is: 'span',
    fontSize: 1,
    color: 'text',
    fontWeight: 500,
    fontFamily: 'sansSerif'
  },
  'fontSize',
  'space',
  'width',
  'textAlign',
  'lineHeight',
  'fontWeight',
  'color',
  'letterSpacing'
)

export const Bar = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors['light-silver']};
`

export const AppRegionDrag = styled.div`
  -webkit-app-region: drag;
  height: 64px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`
export const Image = styled(Box)`
  max-width: 100%;
  height: auto;
`.withComponent('img')

export const Caps = styled(Text)`
  text-transform: uppercase;
`

export const Header = system(
  {
    is: 'h1',
    fontSize: 3,
    color: 'mid-gray',
    fontWeight: 500,
    fontFamily: 'sansSerif'
  },
  'fontSize',
  'space',
  'width',
  'textAlign',
  'lineHeight',
  'fontWeight',
  'color',
  'letterSpacing'
)

const Adornment = styled(Flex)<any>`
  position: absolute;
  opacity: ${(props: any) => (props.disabled ? 0.25 : 1)};
`

export const TextWithAdornment = ({ before, after, disabled, ...props }: any) => {
  return (
    <Flex alignItems="center" position="relative">
      {before && (
        <Adornment style={{ left: 0 }} ml={2} disabled={disabled}>
          {before}
        </Adornment>
      )}
      <Text py={2} pl={before ? 4 : 2} pr={after ? 4 : 2} {...props} />
      {after && (
        <Adornment style={{ right: 0 }} pr={2} disabled={disabled}>
          {after}
        </Adornment>
      )}
    </Flex>
  )
}

export const ButtonWithAdornment = ({ before, after, iconType, children, ...props }: any) => {
  return (
    <StyledButton {...props}>
      {before && <Icon style={{ marginRight: 2, verticalAlign: 'middle' }} type={iconType} />}
      {children}
      {after && <Icon style={{ marginLeft: 2, verticalAlign: 'middle' }} type={iconType} />}
    </StyledButton>
  )
}

interface MenuItemProps {
  iconType: string
  title: string
  active?: boolean
}

const StyledActiveEnhancer = (Component: any) =>
  styled(({ active, ...props }: any) => <Component {...props} />)

const ActivationBox = StyledActiveEnhancer(Flex)`
  background: ${(props: any) => (props.active ? props.theme.colors['near-white'] : 'transparent')};
  &:hover {
    cursor: pointer;
    background: ${(props: any) => props.theme.colors['near-white']};
  }
`

const DarkerActivationBox = styled(ActivationBox)`
  background: ${(props: any) => (props.active ? props.theme.colors['light-gray'] : 'transparent')};
  &:hover {
    cursor: pointer;
    background: ${(props: any) => props.theme.colors['light-gray']};
  }
`

export const MenuItem = ({ title, active = false, iconType }: MenuItemProps) => {
  return (
    <ActivationBox
      borderRadius={2}
      px={2}
      py={1}
      mt={1}
      color="midGray"
      width={1}
      position="relative"
      active={active}
    >
      <TextWithAdornment before={<StyledIcon type={iconType} />} fontWeight={500}>
        {title}
      </TextWithAdornment>
    </ActivationBox>
  )
}

export const HeaderBox = styled(Flex)`
  position: absolute;
  width: 100%;
  border-bottom: 1px solid ${(props: any) => props.theme.colors['light-gray']};
`

export const SVGBox = styled(Box)`
  svg {
    height: 100%;
    width: auto;
  }
`

interface AppIconButtonProps {
  iconType: string
}

export const AppIconButton = ({ iconType }: AppIconButtonProps & any) => {
  return (
    <DarkerActivationBox
      alignItems="center"
      justifyContent="center"
      height="40px"
      width="40px"
      borderRadius={2}
    >
      <StyledIcon type={iconType} />
    </DarkerActivationBox>
  )
}

interface MenuIconButtonProps {
  iconType: string
  title: string
  pathname: string
}

export const MenuIconButton = withRouter(
  ({ iconType, pathname, title, location }: MenuIconButtonProps & RouteComponentProps<any>) => {
    return (
      <DarkerActivationBox
        active={pathname === location.pathname}
        alignItems="center"
        justifyContent="center"
        height="40px"
        width="100%"
        px={2}
        borderRadius={2}
      >
        <Icon type={iconType} />
        <Box pl={1}>
          <Text>{title}</Text>
        </Box>
      </DarkerActivationBox>
    )
  }
)

export const CardHeader = ({ children }: any) => (
  <Box mx={2} mb={3}>
    <Header is="h1">{children}</Header>
  </Box>
)
export const CardHeaderInner = ({ children }: any) => (
  <Box mb={2}>
    <Header is="h1">{children}</Header>
  </Box>
)

export const DragContiner = ({ children }: any) => (
  <Flex>
    <AppRegionDrag />
    {children}
  </Flex>
)

export const StyledTag = styled(Box)`
  display: inline-block;
  cursor: default;
  padding: 4px 6px;
  border-radius: 8px;
  font-size: 10px;
  color: ${themeGet('colors.near-black')};
  border: 1px solid #eee;
  background: ${themeGet('colors.near-white')};
  margin-right: 3px;
`

export const StyledAutoComplete = styled(AutoComplete)<any>`
  .ant-input {
    border: 1px solid ${(props: any) => (props.error ? 'red' : themeGet('colors.scprime-blue'))} !important;
  }
`
const SpinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
export const Spinner = () => <Spin indicator={SpinIcon} />

export * from './Box'
export * from './Flex'
