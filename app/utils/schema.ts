import * as Yup from 'yup'

// ensures yup schema of a positive number
export const YupPositiveNumber = Yup.number()
  .typeError('Must be a valid number.')
  .positive('Please enter a valid positive number.')

// ensures dropdown selection string is one of storage units avl.
export const YupStorageUnit = Yup.string().oneOf(['gb', 'tb'])

// ensures a positive integer value
export const YupPostiveInteger = YupPositiveNumber.integer('Must be an integer.')
