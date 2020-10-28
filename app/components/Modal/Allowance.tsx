import { AllowanceSettings, RenterActions } from 'actions'
import { Tabs, Modal } from 'antd'
import BigNumber from 'bignumber.js'
import { Box, Text } from 'components/atoms'
import { StyledModal } from 'components/atoms/StyledModal'
import { StyledTabs } from 'components/atoms/StyledTabs'
import {
  AdvancedAllowanceForm,
  AdvancedAllowanceFormSchema
} from 'components/Forms/AdvancedAllowanceForm'
import {
  RequiredAllowanceForm,
  RequiredAllowanceFormSchema
} from 'components/Forms/RequiredAllowanceForm'
import { Formik } from 'formik'
import { RenterModel } from 'models'
import * as React from 'react'
import { IndexState } from 'reducers'
import { useDispatch, useMappedState } from 'redux-react-hook'
import { toHastings, toSiacoins } from 'sia-typescript'
import {
  bytesToGBString,
  bytesToTBString,
  BLOCKS_PER_MONTH,
  bytesToTB,
  tbToBytes
} from 'utils/conversion'
import * as Yup from 'yup'
import { useSiad } from 'hooks'

const bytes = require('bytes')

const CombinedFormSchema = Yup.object().shape({
  ...AdvancedAllowanceFormSchema,
  ...RequiredAllowanceFormSchema
})

export const AllowanceModal = (props: any) => {
  const { closeModal, rentStorage } = props
  const [siadConstants, _] = useSiad('/daemon/constants')

  const mapState = React.useCallback(
    (state: IndexState) => ({
      balance: state.wallet.summary.confirmedsiacoinbalance,
      renterSettings: state.renter.summary.settings
    }),
    []
  )
  const { balance, renterSettings } = useMappedState(mapState)

  const dispatch = useDispatch()
  const createAllowance = React.useCallback(allowanceBody => {
    dispatch(RenterActions.setAllowance.started(allowanceBody))
    closeModal()
  }, [])

  // set the initial required allowance form values from redux state.
  const initialFormValues = React.useMemo(() => {
    if (!siadConstants.loading && siadConstants.response) {
      const { defaultallowance } = siadConstants.response

      const allowance =
        renterSettings.allowance.funds === '0'
          ? defaultallowance.funds
          : renterSettings.allowance.funds
      const expectedStorage =
        renterSettings.allowance.expectedstorage || defaultallowance.expectedstorage
      const expectedUpload =
        renterSettings.allowance.expectedupload || defaultallowance.expectedupload
      const expectedDownload =
        renterSettings.allowance.expecteddownload || defaultallowance.expecteddownload
      const period = renterSettings.allowance.period || defaultallowance.period
      const hosts = renterSettings.allowance.hosts || defaultallowance.hosts
      const renewWindow = renterSettings.allowance.renewwindow || defaultallowance.renewwindow

      // these are calculated to make it human readable
      const periodInMonths = period / BLOCKS_PER_MONTH
      const tbInMonths = bytesToTB(expectedStorage)
      const targetPrice = (
        toSiacoins(new BigNumber(allowance)).toNumber() /
        (tbInMonths * periodInMonths)
      ).toFixed(0)
      const expectedDownloadMonth = expectedDownload * BLOCKS_PER_MONTH
      const expectedUploadMonth = expectedUpload * BLOCKS_PER_MONTH

      return {
        targetPrice,
        allowance: toSiacoins(new BigNumber(allowance)).toFixed(0),
        expectedStorage: bytesToTBString(expectedStorage),
        storageUnit: 'tb',
        periodMonth: (period / BLOCKS_PER_MONTH).toString(),
        hosts: hosts.toString(),
        renewWindowMonth: (renewWindow / BLOCKS_PER_MONTH).toString(),
        expectedDownloadMonth: bytesToTBString(expectedDownloadMonth),
        expectedDownloadUnit: 'tb',
        expectedUploadMonth: bytesToTBString(expectedUploadMonth),
        expectedUploadUnit: 'tb'
      }
    }
    return {}
  }, [renterSettings.allowance, siadConstants])

  const showConfirm = React.useCallback(
    payload => {
      // we can safely parse here since Yup already prevalidates the schema.
      const funds = toHastings(new BigNumber(payload.allowance)).toString()
      const hosts = parseInt(payload.hosts)
      const period = parseFloat(payload.periodMonth) * BLOCKS_PER_MONTH
      const renewwindow = parseFloat(payload.renewWindowMonth) * BLOCKS_PER_MONTH
      const expectedstorage = tbToBytes(payload.expectedStorage)
      const expecteddownload = tbToBytes(payload.expectedDownloadMonth / BLOCKS_PER_MONTH)
      const expectedupload = tbToBytes(payload.expectedUploadMonth / BLOCKS_PER_MONTH)

      const allowanceBody: AllowanceSettings = {
        funds,
        hosts,
        period,
        renewwindow,
        expectedstorage,
        expecteddownload,
        expectedupload
      }

      const message = `Are you sure you want to set a ${payload.allowance} SCP allowance for ${
        payload.periodMonth
      } months to rent storage on ScPrime?`
      StyledModal.confirm({
        title: 'Confirm Allowance',
        content: message,
        onOk() {
          createAllowance(allowanceBody)
        },
        onCancel() {}
      })
    },
    [createAllowance]
  )

  if (siadConstants.loading) {
    return null
  }

  return (
    <Formik
      validationSchema={CombinedFormSchema}
      initialValues={initialFormValues}
      onSubmit={(payload, formikBag) => {
        showConfirm(payload)
      }}
      render={formikProps => {
        return (
          <StyledModal
            {...props}
            onOk={formikProps.handleSubmit}
            title="Allowance"
            okButtonDisabled={rentStorage.error}
            onCancel={closeModal}
            destroyOnClose
          >
            <Box>
              <StyledTabs defaultActiveKey="1" tabPosition="left">
                <Tabs.TabPane tab="Basic" key="1">
                  <Box pb={3}>
                    <Text color="near-black">
                      To store files on ScPrime, you must allocate funds in advance. If this is your
                      first time using ScPrime-UI, the below settings are filled with default values.
                    </Text>
                  </Box>
                  <Box>
                    <RequiredAllowanceForm {...formikProps} />
                  </Box>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Advanced" key="2">
                  <Box pb={3}>
                    <Text color="near-black">
                      By setting accurate advanced settings, ScPrime can better manage your contracts
                      and provide you with an optimized storage experience.
                    </Text>
                  </Box>
                  <Box>
                    <AdvancedAllowanceForm {...formikProps} />
                  </Box>
                </Tabs.TabPane>
              </StyledTabs>
            </Box>
          </StyledModal>
        )
      }}
    />
  )
}
