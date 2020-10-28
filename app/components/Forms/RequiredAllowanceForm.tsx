import * as React from 'react'
import { FormikProps, yupToFormErrors } from 'formik'
import { TextInput, TextInputGroup } from './Inputs'
import * as Yup from 'yup'
import { Select, Tag, Tooltip, Icon } from 'antd'
import { YupPositiveNumber, YupStorageUnit } from 'utils/schema'
import { Flex, Text, Box } from 'components/atoms'
import { StyledIcon } from 'components/atoms/StyledIcon'
import { BLOCKS_PER_MONTH } from 'utils/conversion'
import { StyledTag } from 'components/atoms/StyledTag'

export const RequiredAllowanceFormSchema = {
  targetPrice: YupPositiveNumber,
  expectedStorage: YupPositiveNumber.required('Please enter a valid storage amount.'),
  storageUnit: YupStorageUnit
}

const { Option } = Select

export const StorageUnitSelector = props => (
  <Select style={{ width: 80 }} {...props}>
    <Option value="gb">GB</Option>
    <Option value="tb">TB</Option>
  </Select>
)

export const RequiredAllowanceForm = (
  props: FormikProps<{
    targetPrice: string
    expectedStorage: string
    storageUnit: string
    periodMonth: string
    allowance: string
  }>
) => {
  const {
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
    setFieldValue
  } = props

  const recomputeAllowance = React.useCallback(
    ({ targetPrice, expectedStorage }) => {
      try {
        const tp = parseFloat(targetPrice)
        const periodInMonths = parseInt(values.periodMonth)
        const allowance = tp * parseFloat(expectedStorage) * periodInMonths
        setFieldValue('allowance', allowance.toFixed(0))
      } catch (e) {
        console.log('error setting allowance', e)
      }
    },
    [values]
  )
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
      }}
    >
      <Flex width={200}>
        <TextInputGroup
          value={values.targetPrice}
          id="targetPrice"
          label="Target Price (TB per Month)"
          onChange={e => {
            setFieldValue('targetPrice', e.target.value)
            recomputeAllowance({
              targetPrice: e.target.value,
              expectedStorage: values.expectedStorage
            })
          }}
          onBlur={handleBlur}
          error={touched.targetPrice && errors.targetPrice}
          suffix={
            <Flex alignItems="center">
              <StyledTag>SCP</StyledTag>
              <Tooltip
                placement="right"
                title="Amount of ScPrimecoins you'd like to pay per TB of storage each month."
              >
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
      </Flex>

      <Flex width={200} pb={3}>
        <TextInputGroup
          value={values.expectedStorage}
          id="expectedStorage"
          label="Expected Storage"
          onChange={e => {
            setFieldValue('expectedStorage', e.target.value)
            recomputeAllowance({
              targetPrice: values.targetPrice,
              expectedStorage: e.target.value
            })
          }}
          onBlur={handleBlur}
          error={touched.expectedStorage && errors.expectedStorage}
          suffix={
            <Flex alignItems="center">
              <StyledTag>TB</StyledTag>
              <Tooltip placement="right" title="Amount of storage you'd like to rent in TB.">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
      </Flex>
      <Text>
        Allowance: {values.allowance} SC for {values.periodMonth} months of storage.
      </Text>
    </form>
  )
}
