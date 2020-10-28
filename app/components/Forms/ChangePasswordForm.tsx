import * as React from 'react'
import { FormikProps } from 'formik'
import { TextInput, PasswordInput } from './Inputs'

export const ChangePasswordForm = (
  props: FormikProps<{ currentPassword: string; newPassword: string; confirmPassword: string }>
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
    isSubmitting
  } = props

  return (
    <form>
      <PasswordInput
        value={values.currentPassword}
        id="currentPassword"
        label="Current Password"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.currentPassword && errors.currentPassword}
      />
      <PasswordInput
        value={values.newPassword}
        id="newPassword"
        label="New Password"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.newPassword && errors.newPassword}
      />
      <PasswordInput
        value={values.confirmPassword}
        id="confirmPassword"
        label="Confirm Password"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword && errors.confirmPassword}
      />
    </form>
  )
}
