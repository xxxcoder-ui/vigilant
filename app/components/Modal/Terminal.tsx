import { Button, Input, Modal } from 'antd'
import { Box } from 'components/atoms'
import { createShell } from 'components/Modal/util'
import * as React from 'react'
import styled from 'styled-components'
import { Flex } from 'components/atoms/Flex'
import { StyledModal } from 'components/atoms/StyledModal'
import { themeGet } from 'styled-system'
import { useDebounce } from 'hooks'
import stripAnsi from 'strip-ansi'

interface TerminalModalProps {
  visible: boolean
  onOk?(): void
}

const OuterPreWrap = styled(Box)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
`
export const PreWrap = styled(Box)`
  width: 100%;
  pre {
    font-size: 11px;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-weight: 400;
    color: ${themeGet('colors.text')};
  }
`

const initialTermState =
  'Welcome to the ScPrime Terminal! Type `help` to see the available commands. Type `clear` to clear the screen.\n\n'
export const TerminalModal: React.FunctionComponent<any> = (props: any) => {
  const [stdout, setState] = React.useState(initialTermState)
  const [shell, setShell] = React.useState(null)
  const [input, setInput] = React.useState('')

  // debounce the stdout so there are less rerenders in react.
  const debounceStdout = useDebounce(stdout, 250)

  // we are using a callback function here for setState because of how fast
  // shell events can emit. this way we can ensure that the previous log state
  // is the most updated state available.
  const appendLog = data =>
    setState(prev => {
      return prev + data
    })

  // If modal is visible, create a shell.
  React.useEffect(() => {
    if (props.visible) {
      setState(initialTermState)
      setInput('')
      const s = createShell()
      setShell(s)
    } else {
      if (shell) {
        shell.destroy()
        setShell(null)
      }
    }
  }, [props.visible])

  // When shell is created / changes, setup the event emitters.
  React.useEffect(() => {
    if (shell) {
      shell.on('data', data => {
        appendLog(stripAnsi(data))
      })
      shell.on('exit', () => {
        setShell(null)
      })
      shell.resume()
      // if the shell changes, remove all listeners.
      return () => {
        shell.removeAllListeners()
      }
    }
  }, [shell])
  return (
    <div>
      <StyledModal
        width="80vw"
        title="Terminal"
        visible={props.visible}
        onOk={props.onOk}
        onCancel={props.onOk}
        closable={false}
        centered
        footer={[
          <Button key="submit" type="primary" onClick={props.onOk}>
            OK
          </Button>
        ]}
      >
        <Flex alignItems="center" height="50vh">
          <OuterPreWrap>
            <PreWrap>
              <pre style={{ fontWeight: 600 }}>{debounceStdout}</pre>
            </PreWrap>
          </OuterPreWrap>
        </Flex>
        <Input
          type="text"
          onChange={e => setInput(e.target.value)}
          value={input}
          onPressEnter={async (e: any) => {
            const command = input
            try {
              switch (command) {
                case 'clear':
                  setState('')
                  setInput('')
                  return
                default:
                  break
              }
              if (command) {
                const command = e.target.value
                setInput('')
                if (shell) {
                  shell.write(command + '\n')
                } else {
                  const s = createShell(command)
                  setShell(s)
                }
              }
            } catch (e) {
              setState([`Error executing spc. Please contact the developers for help. ${e}`])
            }
          }}
        />
      </StyledModal>
    </div>
  )
}
