import { Form, Icon, Input, Tooltip } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import * as React from 'react'
import { WalletRootReducer } from 'reducers/wallet'

interface IProps {
  seed: WalletRootReducer.SeedState
}

type Props = FormComponentProps & IProps
class SForm extends React.Component<Props, {}> {
  state = {
    confirmDirty: false
  }
  handleConfirmBlur = (e: any) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('The two seeds do not currently match!')
    } else {
      callback()
    }
  }
  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { seed } = this.props

    if (seed.error) {
      return <h1>{seed.error}</h1>
    }
    return (
      <Form layout="vertical">
        <Form.Item label="Generated Seed">
          <Tooltip
            placement="bottom"
            title="Please keep your seed backed up somewhere secure. Your seed is used to create your private key. Anyone with access to your private key has full access to your Siacoin funds."
          >
            {getFieldDecorator('seed', {
              initialValue: seed.primaryseed
            })(<Input addonAfter={<Icon type="copy" />} readOnly />)}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password'
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item label="Confirm Password">
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!'
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
      </Form>
    )
  }
}

export const SeedForm = Form.create({})(SForm)
