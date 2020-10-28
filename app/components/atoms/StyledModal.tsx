import * as React from 'react'
import styled, { StyledComponentBase, StyledComponentProps } from 'styled-components'
import { Modal } from 'antd'
import { themeGet } from 'styled-system'
import { ModalProps } from 'antd/lib/modal'

export const StyledModal = styled(Modal)<ModalProps & { children: any }>`
  .ant-modal-body {
    background: ${themeGet('colors.modal-body')};
    color: ${themeGet('colors.near-black')};
  }
  .ant-modal-title {
    color: ${themeGet('colors.near-black')};
  }
  .ant-modal-footer {
    border-top: none;
    background: ${themeGet('colors.white')};
  }
  .ant-modal-header {
    background: ${themeGet('colors.modal-header-bg')};
    border-bottom: none;
  }
  .ant-modal-close-x > i {
    color: ${themeGet('colors.text')};
  }
`
