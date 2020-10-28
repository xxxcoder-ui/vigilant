import * as React from 'react'
import { Modal, Button } from 'antd'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { ChangePasswordForm } from 'components/Forms/ChangePasswordForm'
import { useDispatch, useMappedState } from 'redux-react-hook'
import { WalletActions } from 'actions'
import { IndexState } from 'reducers'
import { Text } from 'components/atoms'
import { StyledModal } from 'components/atoms/StyledModal'

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(3, 'Your password should be longer than that')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('This field is required')
})

export const ChangePasswordModal = ({ closeModal, ...props }) => {
  const dispatch = useDispatch()
  const mapState = React.useCallback(
    (state: IndexState) => ({
      api: state.ui.changePassword
    }),
    []
  )
  // subscribe to store
  const { api } = useMappedState(mapState)
  // wait for successful password change
  React.useEffect(() => {
    if (api.success) {
      closeModal()
    }
  }, [api])
  return (
    <Formik
      initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={(payload, { resetForm }) => {
        dispatch(
          WalletActions.changePassword.started({
            encryptionpassword: payload.currentPassword,
            newpassword: payload.newPassword
          })
        )
        resetForm()
      }}
      render={formikProps => (
        <StyledModal
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={formikProps.handleSubmit as any}>
              Change
            </Button>
          ]}
          title="Change Password"
          {...props}
        >
          {api.error && <Text>{api.error} </Text>}
          <ChangePasswordForm {...formikProps} />
        </StyledModal>
      )}
    />
  )
}
