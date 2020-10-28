import { RenterActions, GlobalActions } from 'actions'
import { InputNumber, Modal, Icon } from 'antd'
import BigNumber from 'bignumber.js'
import { Box, Text, Spinner } from 'components/atoms'
import { RenterModel } from 'models'
import * as React from 'react'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { useDispatch, useMappedState } from 'redux-react-hook'
import { toHastings, toSiacoins } from 'sia-typescript'
import { TextInput } from 'components/Forms/Inputs'
import { siad } from 'api/siad'
import { StyledModal } from 'components/atoms/StyledModal'

// BackupModal handles the async logic directly using React Hooks. While we
// usually don't want app logic to exist in components, I feel like sagas has
// made API calls more complex than it needs to be. Usually API calls are
// isolated to a single component. Plus, being that it's a hook, we can always
// take the logic out of the component if we need to re-use it.
export const BackupModal = (props: any) => {
  const { closeModal } = props

  const dispatch = useDispatch()
  const [backupName, setBackupName] = React.useState('')
  const [backupFieldError, setBackupFieldError] = React.useState('')
  const [results, setResults] = React.useState({
    response: null,
    error: null,
    loading: false
  })
  const queryBackup = React.useCallback(async () => {
    if (backupName.length <= 0) {
      setBackupFieldError('Please set a valid backup name.')
      return
    }
    setBackupFieldError('')
    try {
      setResults({
        response: null,
        error: null,
        loading: true
      })
      const response = await siad.call({
        url: '/renter/backups/create',
        method: 'POST',
        qs: {
          // destination is basically the name of the backup. it's set this way
          // to be backwards compatible with non-remote backups.
          name: backupName
        }
      })
      setResults({ response, error: null, loading: false })
      setBackupName('')
      dispatch(
        GlobalActions.notification({
          type: 'open',
          title: 'Backup Initiated',
          message: `${backupName} in progress`
        })
      )
      closeModal()
    } catch (e) {
      setResults({ response: null, error: e, loading: false })
    }
  }, [backupName])
  const okText = results.loading ? 'Creating Backup' : 'Start Backup'

  return (
    <StyledModal
      title="Backup Files"
      {...props}
      onOk={queryBackup}
      okText={okText}
      confirmLoading={results.loading}
      onCancel={closeModal}
      cancelButtonDisabled={results.loading}
      cancelButtonProps={{
        disabled: results.loading
      }}
      destroyOnClose
    >
      <Box>
        <Text as="p">
          This feature allows you to back up your files. This backup is
          stored on Sia and linked to your seed. As long as your contracts
          are active, you will be able to restore your files using only your seed.
        </Text>
      </Box>
      <Flex
        css={`
          & > div {
            width: 100%;
          }
        `}
      >
        <TextInput
          css={`
            width: 100%;
          `}
          disabled={results.loading}
          value={backupName}
          error={backupFieldError}
          onChange={e => setBackupName(e.target.value)}
          id="backup"
          label="Backup Name"
        />
      </Flex>
      {results.loading && (
        <Box>
          <Spinner /> <Text pl={2}>Creating Backup...</Text>
        </Box>
      )}
      {results.response && (
        <Box>
          <Icon type="check" /> <Text pl={2}>Backup Created Successfully!</Text>
        </Box>
      )}
      {results.error && (
        <Box>
          {' '}
          <Text color="red">
            {results.error.error && results.error.error.message
              ? results.error.error.message
              : results.error}
          </Text>
        </Box>
      )}
    </StyledModal>
  )
}
