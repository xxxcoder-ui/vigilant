import * as React from 'react'
import Transition, { TransitionProps } from 'react-transition-group/Transition'
import { TimelineMax, TweenLite, TweenMax, Expo, Linear, Power1 } from 'gsap'
import './bonus/DrawSVGPlugin.min.js'

export const SiaLogo = ({ width, height }) => (
  <div>
    <div style={{ width, height }}>
      <svg id="sia-logo" width="100%" height="100%" viewBox="-10 -10 277 277" version="1.1">
        <g id="Sia-Logo" transform="translate(-0.109375, 0.562500)">
          <g transform="translate(0.420058, 0.407811)" strokeWidth="1px" stroke="#7F8C8D">
            <g id="spinner">
              <path
                d="M57.2433086,21.3506107 L61.9234926,27.277593 C81.2437494,14.5648555 104.41953,7.25462637 129.288124,7.53264021 C193.48118,8.24984772 246.18186,59.7949795 248.252467,123.958188 C250.495339,193.470177 193.468388,250.497128 123.956398,248.25255 C59.794043,246.181091 8.24976405,193.479558 7.53255655,129.287355 C7.25539551,104.41876 14.5656246,81.2438331 27.2766565,61.9235763 L21.350527,57.2433923 C8.12013796,77.1256464 0.296521293,100.900947 0.00827380721,126.454343 C-0.780569164,196.36715 54.9364759,254.228142 124.97294,255.807534 C197.902965,257.452591 257.45336,197.902196 255.808303,124.972171 C254.227206,54.9357068 196.366213,-0.781338303 126.454259,0.00835747148 C100.900863,0.296604957 77.1255627,8.12107443 57.2433086,21.3506107 Z"
                id="loop"
              />
              <path
                d="M52.6734757,40.1321517 C52.6734757,47.0586193 47.0586193,52.6734757 40.1321517,52.6734757 C33.205684,52.6734757 27.5908276,47.0586193 27.5908276,40.1321517 C27.5908276,33.205684 33.205684,27.5908276 40.1321517,27.5908276 C47.0586193,27.5908276 52.6734757,33.205684 52.6734757,40.1321517"
                id="dot"
              />
            </g>
            {/*<path
              d="M165.544113,127.920482 L165.544113,165.544454 L127.920994,165.544454 C107.14159,165.544454 90.2970214,148.699032 90.2970214,127.920482 C90.2970214,107.141079 107.14159,90.2965097 127.920994,90.2965097 C148.699544,90.2965097 165.544113,107.141079 165.544113,127.920482 M128.395152,65.2164201 C93.5462017,64.9580207 65.2143733,93.1303748 65.2143733,127.920482 C65.2143733,162.551968 93.2886551,190.626249 127.920994,190.626249 L190.626761,190.626249 L190.626761,128.707619 C190.626761,94.1315658 162.970353,65.472261 128.395152,65.2164201"
              id="center"
            />*/}
          </g>
        </g>
      </svg>
    </div>
  </div>
)

export const TransitionSiaSpinner = ({
  width = 200,
  height = 200,
  ...props
}: Partial<TransitionProps> & any) => {
  return (
    <Transition
      {...props}
      appear
      mountOnEnter
      unmountOnExit
      timeout={10000}
      addEndListener={(n, done) => {
        if (props.in) {
          const t = new TimelineMax()
          const paths = n.querySelectorAll('path')
          const greenFill = n.querySelectorAll('#dot, #center')
          const greyFill = n.querySelectorAll('#loop')
          const spinner = n.querySelectorAll('#spinner')

          const drawPath = TweenMax.fromTo(
            paths,
            2,
            {
              force3D: true,
              drawSVG: '50% 50%',
              opacity: 0,
              fill: 'transparent',
              ease: Linear.easeNone
            },
            { force3D: true, drawSVG: true, opacity: 1 }
          )
          const fadeInFromBottom = TweenMax.from(n, 1, {
            force3D: true,
            transform: 'translateY(100%)',
            opacity: 0
          })
          const removePath = TweenMax.staggerTo(paths, 2, { force3D: true, strokeOpacity: 0 }, 0.1)
          const addGreen = TweenMax.to(greenFill, 1, {
            force3D: true,
            fill: '#1ED660'
          })
          const addBorder = TweenMax.to(greyFill, 2, {
            force3D: true,
            fill: '#2074ee',
            onComplete: done
          })
          const rotateCircle = TweenMax.to(spinner, 1, {
            force3D: true,
            rotation: 360,
            transformOrigin: '50% 50%',
            repeat: -1,
            ease: Linear.easeNone
          })
          t.add([drawPath, fadeInFromBottom]).add([removePath, addGreen, addBorder, rotateCircle])
        } else {
          TweenMax.to(n, 1, {
            force3D: true,
            scale: 0.98,
            opacity: 0,
            transform: 'translateY(100%)',
            ease: Expo.easeOut,
            onComplete: done
          })
        }
      }}
    >
      <SiaLogo width={width} height={height} />
    </Transition>
  )
}

export const TransitionSiaOnlySpin = ({
  width = 200,
  height = 200,
  ...props
}: Partial<TransitionProps> & any) => {
  return (
    <Transition
      {...props}
      appear
      timeout={10000}
      addEndListener={(n, done) => {
        if (props.in) {
          const t = new TimelineMax()
          const paths = n.querySelectorAll('path')
          const greenFill = n.querySelectorAll('#dot, #center')
          const greyFill = n.querySelectorAll('#loop')
          const spinner = n.querySelectorAll('#spinner')

          TweenLite.defaultEase = Expo.easeOut
          const fadeInFromBottom = TweenMax.from(n, 0.5, {
            force3D: true,
            transform: 'translateY(100%)',
            opacity: 0
          })
          const addGreen = TweenMax.to(greenFill, 0.5, { fill: '#2074ee' })
          const addBorder = TweenMax.to(greyFill, 0.5, { fill: '#7F8C8D', onComplete: done })
          const rotateCircle = TweenMax.to(spinner, 1, {
            force3D: true,
            rotation: 360,
            transformOrigin: '50% 50%',
            repeat: -1,
            ease: Linear.easeNone
          })
          t.add([fadeInFromBottom, addGreen, addBorder, rotateCircle])
        } else {
          TweenMax.to(n, 0.5, {
            force3D: true,
            scale: 0.98,
            opacity: 0,
            transform: 'translateY(100%)',
            ease: Expo.easeOut,
            onComplete: done
          })
        }
      }}
    >
      <SiaLogo width={width} height={height} />
    </Transition>
  )
}
