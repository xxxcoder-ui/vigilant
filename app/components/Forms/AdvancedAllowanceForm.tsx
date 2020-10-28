import * as React from 'react'
import * as Yup from 'yup'
import { FormikProps } from 'formik'
import { Grid } from 'components/atoms/Grid'
import { TextInput, TextInputGroup } from './Inputs'
import { YupPositiveNumber, YupPostiveInteger, YupStorageUnit } from 'utils/schema'
import { Tag, Tooltip } from 'antd'
import { StorageUnitSelector } from './RequiredAllowanceForm'
import { BLOCKS_PER_MONTH } from 'utils/conversion'
import { Flex } from 'components/atoms'
import { StyledIcon } from 'components/atoms/StyledIcon'
import { StyledTag } from 'components/atoms/StyledTag'

export interface AdvancedAllowanceFormItems {
  periodMonth: string
  expectedStorage: string
  hosts: string
  renewWindowMonth: string
  expectedDownloadMonth: string
  expectedDownloadUnit: string
  expectedUploadMonth: string
  expectedUploadUnit: string
  allowance: string
  targetPrice: string
}

export const AdvancedAllowanceFormSchema = {
  allowance: YupPositiveNumber.required('Please set a valid allowance fund.'),
  expectedStorage: YupPositiveNumber.required('Please enter a valid storage amount.'),
  periodMonth: YupPositiveNumber.required('Please set a valid period.'),
  hosts: YupPostiveInteger.required('Please set a valid number of hosts.'),
  renewWindowMonth: YupPositiveNumber.required('Please set a valid renew window.'),
  expectedDownloadMonth: YupPositiveNumber.required(
    'Please set a valid expected download bandwidth.'
  ),
  expectedDownloadUnit: YupStorageUnit,
  expectedUploadMonth: YupPositiveNumber.required('Please set a valid expected upload bandwidth.'),
  expectedUploadUnit: YupStorageUnit,
  targetPrice: YupPositiveNumber
}

export const AdvancedAllowanceForm = (props: FormikProps<AdvancedAllowanceFormItems>) => {
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

  const recomputeTargetPrice = React.useCallback(
    ({ allowance, expectedStorage, periodMonth }) => {
      try {
        const a = parseFloat(allowance)
        const e = parseFloat(expectedStorage)
        const m = parseFloat(periodMonth)
        const targetPrice = a / (m * e)
        setFieldValue('targetPrice', targetPrice.toFixed(2))
      } catch (e) {
        console.log('error setting target price', e)
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
      <Grid gridTemplateColumns="1fr 1fr" gridGap={2}>
        <TextInputGroup
          value={values.allowance}
          name="allowance"
          id="allowance"
          onChange={e => {
            setFieldValue('allowance', e.target.value)
            recomputeTargetPrice({
              allowance: e.target.value,
              expectedStorage: values.expectedStorage,
              periodMonth: values.periodMonth
            })
          }}
          onBlur={handleBlur}
          error={touched.allowance && errors.allowance}
          label="Allowance Funds"
          suffix={
            <Flex alignItems="center">
              <StyledTag>SCP</StyledTag>
              <Tooltip placement="right" title="Amount of ScPrimecoins you'd like to spend for the period.">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
        <TextInputGroup
          value={values.expectedStorage}
          id="expectedStorage"
          name="expectedStorage"
          onChange={e => {
            setFieldValue('expectedStorage', e.target.value)
            recomputeTargetPrice({
              allowance: values.allowance,
              expectedStorage: e.target.value,
              periodMonth: values.periodMonth
            })
          }}
          onBlur={handleBlur}
          error={touched.expectedStorage && errors.expectedStorage}
          label="Expected Storage"
          suffix={
            <Flex alignItems="center">
              <StyledTag>TB</StyledTag>
              <Tooltip placement="right" title="Amount of storage you'd like to rent in TB.">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={2}>
        <TextInputGroup
          value={values.periodMonth}
          name="periodMonth"
          id="periodMonth"
          onChange={e => {
            setFieldValue('periodMonth', e.target.value)
            recomputeTargetPrice({
              allowance: values.allowance,
              expectedStorage: values.expectedStorage,
              periodMonth: e.target.value
            })
          }}
          onBlur={handleBlur}
          error={touched.periodMonth && errors.periodMonth}
          label="Period"
          suffix={
            <Flex alignItems="center">
              <StyledTag>Months</StyledTag>
              <Tooltip placement="right" title="Length of the storage contracts.">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
        <TextInputGroup
          value={values.hosts}
          id="hosts"
          name="hosts"
          label="Hosts"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.hosts && errors.hosts}
          suffix={
            <Flex alignItems="center">
              <Tooltip placement="right" title="Number of hosts to create contracts with.">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
      </Grid>
      <TextInputGroup
        value={values.renewWindowMonth}
        name="renewWindowMonth"
        id="renewWindowMonth"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.renewWindowMonth && errors.renewWindowMonth}
        label="Renew Window"
        suffix={
          <Flex alignItems="center">
            <StyledTag>Months</StyledTag>
            <Tooltip
              placement="right"
              title="Number of months prior to contract expiration that ScPrime will attempt to renew your contracts."
            >
              <StyledIcon type="info-circle" />
            </Tooltip>
          </Flex>
        }
      />
      <Grid gridTemplateColumns="1fr 1fr" gridGap={2}>
        <TextInputGroup
          value={values.expectedDownloadMonth}
          name="expectedDownloadMonth"
          id="expectedDownloadMonth"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.expectedDownloadMonth && errors.expectedDownloadMonth}
          label="Expected Download"
          suffix={
            <Flex alignItems="center">
              <StyledTag>TB</StyledTag>
              <Tooltip placement="right" title="Amount of download bandwidth you plan to use each month.">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
        <TextInputGroup
          value={values.expectedUploadMonth}
          name="expectedUploadMonth"
          id="expectedUploadMonth"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.expectedUploadMonth && errors.expectedUploadMonth}
          label="Expected Upload"
          suffix={
            <Flex alignItems="center">
              <StyledTag>TB</StyledTag>
              <Tooltip placement="right" title="Amount of upload bandwidth you plan to use each month.">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
      </Grid>
    </form>
  )
}
