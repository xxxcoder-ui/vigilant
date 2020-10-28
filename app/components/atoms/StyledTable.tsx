import { Table } from 'antd'
import { TableProps } from 'antd/lib/table'
import * as React from 'react'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

export const StyledTable = ({ ...props }: TableProps<any>) => {
  const Div = styled.div`
    .ant-table-body {
      margin: 0 !important;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid ${themeGet('colors.near-white')};
      background-color: ${themeGet('colors.almostwhite')};
    }
    .ant-table-thead > tr > th {
      background-color: ${themeGet('colors.white')};
      color: ${themeGet('colors.near-black')};
      border-bottom: 1px solid ${themeGet('colors.near-white')};
    }
    .ant-table-tbody > tr {
      &:hover {
        td {
          background: ${themeGet('colors.white')} !important;
        }
      }
    }
    ul.ant-pagination.ant-table-pagination > .ant-pagination-item {
      background: transparent;
      a {
        color: ${themeGet('colors.near-black')};
      }
    }
    .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link {
      background: transparent;
      color: ${themeGet('colors.text')};
    }
    .ant-table-thead > tr:first-child > th:last-child {
      border-top-right-radius: 0;
    }
    .ant-table-thead > tr:first-child > th:first-child {
      border-top-left-radius: 0;
    }
    .ant-pagination-item-ellipsis {
      color: ${themeGet('colors.near-black')} !important;
    }
  `
  return (
    <Div>
      <Table {...props} />
    </Div>
  )
}
