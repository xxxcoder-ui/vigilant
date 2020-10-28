// Copied from https://github.com/bvaughn/react-virtualized/blob/04d1221133a1c59be24c8af90ae09e46000372b5/source/Table/defaultRowRenderer.js#L1

// TODO Make sure this component can be optimised using "shouldComponentUpdate"

import React, { Component } from 'react'
import { DragSource, DropTarget, DropTargetMonitor } from 'react-dnd'
import { ContextMenuTrigger } from 'react-contextmenu'

const RowDragSource = {
  canDrag(props) {
    // You can disallow drag based on props
    return true
    // return props.isReady;
  },

  isDragging(props, monitor) {
    // console.log('is dragging');
    // console.log('item', monitor.getItem());
    return monitor.getItem().id === props.rowData.id
  },

  beginDrag(props, monitor, component) {
    const draggedItem = { id: props.rowData.id }
    let items = []
    if (props.selection.find(id => id === draggedItem.id)) {
      items = props.selection.map(id => ({ id }))
    } else {
      items = [draggedItem]
    }
    return { draggedItem, items }
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
    // const item = monitor.getItem();
    // const dropResult = monitor.getDropResult();
  }
}

function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const RowDropTarget = {
  hover(props, monitor, component) {
    const dragRowId = monitor.getItem().draggedItem.id
    const hoverRowId = props.rowData.id
    if (dragRowId === hoverRowId) return
    props.moveRow(hoverRowId, monitor.getItem().items)
  },

  drop(props, monitor, component) {
    const dropRowId = props.rowData.id
    props.dropRow(dropRowId, monitor.getItem().items)
  },

  canDrop(props, monitor) {
    if (props.rowData.type === 'dir' || props.rowData.type === 'navigator') {
      return true
    }
  }
}

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

@DragSource('filemanager-resource', RowDragSource, dragCollect)
@DropTarget('filemanager-resource', RowDropTarget, dropCollect)
class Row extends Component {
  render() {
    /* eslint-disable  react/prop-types */
    const {
      className, // eslint-disable-line no-unused-vars
      columns,
      index,
      onRowClick,
      onRowDoubleClick,
      onRowMouseOut,
      onRowMouseOver,
      onRowRightClick,
      onRowNavigateOut,
      rowData,
      style,
      selection,
      lastSelected,
      loading,
      isDragging,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      contextMenuId,
      navigator,
      hasTouch
    } = this.props
    /* eslint-enable react/prop-types */
    // console.log('row data', )

    const a11yProps = {}

    if (rowData.type !== 'navigator') {
      if (onRowClick || onRowDoubleClick || onRowMouseOut || onRowMouseOver || onRowRightClick) {
        a11yProps['aria-label'] = 'row'
        a11yProps.tabIndex = 0

        if (onRowClick) {
          a11yProps.onClick = event => onRowClick({ event, index, rowData })
        }
        if (onRowDoubleClick) {
          a11yProps.onDoubleClick = event => onRowDoubleClick({ event, index, rowData })
        }
        if (onRowMouseOut) {
          a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData })
        }
        if (onRowMouseOver) {
          a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData })
        }
        if (onRowRightClick) {
          a11yProps.onContextMenu = event => onRowRightClick({ event, index, rowData })
        }
      }
    } else {
      if (onRowNavigateOut) {
        a11yProps.onDoubleClick = event => onRowNavigateOut({ event, index, rowData })
      }
    }

    const isSelected = selection.indexOf(rowData.id) !== -1
    const isLastSelected = lastSelected === rowData.id

    return (
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={hasTouch ? 1000 : -1}>
        {connectDragPreview(
          connectDragSource(
            connectDropTarget(
              <div
                {...a11yProps}
                className={`
              ReactVirtualized__Table__row
              oc-fm--list-view__row
              ${!loading && isSelected ? 'oc-fm--list-view__row--selected' : ''}
              ${!loading && isLastSelected ? 'oc-fm--list-view__row--last-selected' : ''}
              ${!loading && isDragging ? 'oc-fm--list-view__row--dragging' : ''}
              ${loading ? 'oc-fm--list-view__row--loading' : ''}
            `}
                key={rowData.id}
                role="row"
                style={style}
              >
                {rowData.type === 'navigator' ? <div style={{ paddingLeft: 20 }}>..</div> : columns}
              </div>
            )
          )
        )}
      </ContextMenuTrigger>
    )
  }
}

export default ({
  selection,
  lastSelected,
  loading,
  contextMenuId,
  hasTouch,
  moveRow,
  dropRow,
  onRowNavigateOut,
  navigator = false
}) => props => (
  <Row
    {...props}
    navigator={navigator}
    selection={selection}
    lastSelected={lastSelected}
    loading={loading}
    contextMenuId={contextMenuId}
    hasTouch={hasTouch}
    moveRow={moveRow}
    dropRow={dropRow}
    onRowNavigateOut={onRowNavigateOut}
  />
)
