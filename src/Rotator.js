import React from 'react'
import PropTypes from 'prop-types'

const Rotator = ({ onMouseDown, onTouchStart, classPrefix, styles }) => (
  <div
    className={`${classPrefix}-transform__rotator`}
    onMouseDown={onMouseDown}
    onTouchStart={onMouseDown}
    style={{
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      ...styles,
    }} />
)

Rotator.defaultProps = {
  classPrefix: 'tr',
  styles: {}
}

Rotator.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  classPrefix: PropTypes.string,
  styles: PropTypes.object,
}

export default Rotator
