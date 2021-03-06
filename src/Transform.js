import React from 'react'
import PropTypes from 'prop-types'
import ScalePoint from './ScalePoint'
import Rotator from './Rotator'
import {scale, rotate, translate, styler} from 'free-transform'

const SCALE_HANDLE_PRESETS = {
  'corners': ['tl', 'tr', 'bl', 'br'],
  'sides': ['tm', 'mr', 'bm', 'ml'],
  'all': ['tl', 'ml', 'tr', 'tm', 'mr', 'bl', 'bm', 'br'],
};

export default class Transform extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleTranslation = this.handleTranslation.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);
  }
  
  render() {
    
    const {
      children, classPrefix,
      x, y, scaleX, scaleY,
      width, height, angle,
      disableScale,
      rotateEnabled,
      scaleEnabled,
      translateEnabled,
      scaleHandles,
      open,
    } = this.props;
    
    // replace anchor shortcuts
    for (let name in SCALE_HANDLE_PRESETS) {
      const index = scaleHandles.indexOf(name);
      if (index !== -1) {
        scaleHandles.splice(index, 1, ...SCALE_HANDLE_PRESETS[name]);
      }
    }
    
    const {
      element: elementStyle,
      controls: controlsStyles
    } = styler({x, y, scaleX, scaleY, width, height, angle, disableScale});
    
    return (
      <div className={`${classPrefix}-transform`}
           onMouseDown={open && translateEnabled
             ? this.handleTranslation
             : null}
           onTouchStart={open && translateEnabled
             ? this.handleTranslation
             : null}
      >
        <div className={`${classPrefix}-transform__content`} style={elementStyle}>
          {children}
        </div>
        
        {open &&
        <div className={`${classPrefix}-transform__controls`} style={controlsStyles}>
          
          {scaleEnabled && scaleHandles.map(position =>
            (<ScalePoint key={position}
                         position={position}
                         classPrefix={classPrefix}
                         onMouseDown={(event) => this.handleScale(position, event)}
                         onTouchStart={(event) => this.handleScale(position, event)}
            />)
          )}
          
          {rotateEnabled && <Rotator onMouseDown={this.handleRotation}
                                     onTouchStart={this.handleRotation}
                                     classPrefix={classPrefix}/>}
        </div>}
      </div>
    )
  }
  
  handleTranslation(event) {
    event.stopPropagation();
    // Если был второй targetTouches, делаем не перенос картинки а скаляцию
    if (event.targetTouches && event.targetTouches.length >= 2) {
      event.preventDefault();
      // повторное нажатие = розтягивание
      if (event.targetTouches[0].pageX < event.targetTouches[1].pageX){
        this.handleScale('tl', event)
      } else {
        this.handleScale('br', event)
      }
    } else {
      const drag = translate({
        x: this.props.x,
        y: this.props.y,
        startX: event.pageX || event.targetTouches[0].pageX,
        startY: event.pageY || event.targetTouches[0].pageY,
      }, this.props.onTranslate || this.props.onUpdate);
  
      const up = (event) => {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
    
        document.removeEventListener('mouseup', up);
        document.removeEventListener('touchend', up);
    
        let onEnd = this.props.onTranslateEnd || this.props.onTransformEnd;
        if (onEnd)
          onEnd(event);
      };
  
      let onStart = this.props.onTranslateStart || this.props.onTransformStart;
      if (onStart) onStart(event);
      
      document.addEventListener('touchmove', drag);
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchend', up);
      document.addEventListener('mouseup', up);
    }
  }
  
  handleScale(scaleType, event) {
    event.stopPropagation();
    
    if (!event.targetTouches) event.preventDefault();
    
    const drag = scale(scaleType, {
      event,
      x: this.props.x,
      y: this.props.y,
      scaleX: this.props.scaleX,
      scaleY: this.props.scaleY,
      width: this.props.width,
      height: this.props.height,
      angle: this.props.angle,
      scaleMinLimit: this.props.scaleMinLimit,
      scaleMaxLimit: this.props.scaleMaxLimit,
      scaleFromCenter: this.props.scaleFromCenter,
      aspectRatio: this.props.aspectRatio,
    }, this.props.onScale || this.props.onUpdate);
    
    const up = (event) => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchend', up);
      
      let onEnd = this.props.onScaleEnd || this.props.onTransformEnd;
      if (onEnd)
        onEnd(event);
    };
    
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchend", up);
    
    let onStart = this.props.onScaleStart || this.props.onTransformStart;
    if (onStart)
      onStart(event);
  }
  
  handleRotation(event) {
    event.stopPropagation();
    
    const drag = rotate({
      startX: event.pageX  || event.targetTouches[0].pageX,
      startY: event.pageY || event.targetTouches[0].pageY,
      x: this.props.x,
      y: this.props.y,
      scaleX: this.props.scaleX,
      scaleY: this.props.scaleY,
      width: this.props.width,
      height: this.props.height,
      angle: this.props.angle,
      offsetX: this.props.offsetX,
      offsetY: this.props.offsetY
    }, this.props.onRotate || this.props.onUpdate);
    
    const up = (event) => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchend', up);
      
      let onEnd = this.props.onRotateEnd || this.props.onTransformEnd;
      if (onEnd)
        onEnd(event);
    };
    
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchend", up);
    
    let onStart = this.props.onRotateStart || this.props.onTransformStart;
    if (onStart)
      onStart(event);
  }
}

Transform.SCALE_HANDLE_PRESETS = SCALE_HANDLE_PRESETS;

Transform.defaultProps = {
  classPrefix: "tr",
  scaleMinLimit: 0.1,
  scaleMaxLimit: 2,
  disableScale: false,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  offsetX: 0,
  offsetY: 0,
  onUpdate: function () {
  },
  rotateEnabled: true,
  scaleEnabled: true,
  translateEnabled: true,
  scaleHandles: SCALE_HANDLE_PRESETS['all'],
  open: true,
  scaleFromCenter: false,
  aspectRatio: false,
}

Transform.propTypes = {
  classPrefix: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scaleX: PropTypes.number.isRequired,
  scaleY: PropTypes.number.isRequired,
  scaleMinLimit: PropTypes.number.isRequired,
  scaleMaxLimit: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  
  onUpdate: PropTypes.func,
  onTransformStart: PropTypes.func,
  onTransformEnd: PropTypes.func,
  
  onTranslate: PropTypes.func,
  onRotate: PropTypes.func,
  onScale: PropTypes.func,
  
  onTranslateStart: PropTypes.func,
  onRotateStart: PropTypes.func,
  onScaleStart: PropTypes.func,
  
  onTranslateEnd: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onScaleEnd: PropTypes.func,
  
  children: PropTypes.element,
  disableScale: PropTypes.bool,
  offsetX: PropTypes.number.isRequired,
  offsetY: PropTypes.number.isRequired,
  
  rotateEnabled: PropTypes.bool,
  scaleEnabled: PropTypes.bool,
  translateEnabled: PropTypes.bool,
  
  scaleHandles: PropTypes.array,
  scaleFromCenter: PropTypes.bool,
  aspectRatio: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  
  open: PropTypes.bool,
}
