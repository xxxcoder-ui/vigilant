import PropTypes from 'prop-types'
import React, { Component, Children } from 'react'
import './FileManagerOne.less'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'

const propTypes = {
  className: PropTypes.string
}
const defaultProps = {}

export default class FileManagerOne extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { children, className } = this.props

    return (
      <div className={`oc-fm--file-manager ${className || ''}`}>
        <DragDropContextProvider backend={HTML5Backend}>
          <div className="oc-fm--file-manager__navigators">
            {Children.toArray(children).map((child, i) => (
              <div key={i} className="oc-fm--file-manager__navigator">
                {child}
              </div>
            ))}
          </div>
        </DragDropContextProvider>
      </div>
    )
  }
}

FileManagerOne.propTypes = propTypes
FileManagerOne.defaultProps = defaultProps
