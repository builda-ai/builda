import React from 'react'
import classNames from 'classnames'

interface AnimatedSoundIconProps {
  playing?: boolean
  size?: number | string
  containerClassName?: string
  iconClassName?: string
}

export default function SoundIcon({
  playing = false,
  size = 48,
  containerClassName,
  iconClassName
}: AnimatedSoundIconProps) {
  return (
    <div
      className={classNames(
        'inline-flex items-center justify-center',
        containerClassName
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className={classNames('transition-colors duration-300', iconClassName)}
      >
        <path
          fill="currentColor"
          d="M0 149.3v213.3h85.3L234.7 512V0L85.3 149.3z"
        />
        <path
          className={classNames('sound-wave', {
            'sound-wave-1': playing,
            'opacity-30': !playing
          })}
          fill="currentColor"
          d="M341.3 256c0-35.5-21.7-65.9-52.5-78.7l-16.4 39.4c15.4 6.4 26.2 21.6 26.2 39.4c0 17.7-10.8 32.9-26.2 39.4l16.4 39.4c30.8-13 52.5-43.4 52.5-78.9"
        />
        <path
          className={classNames('sound-wave', {
            'sound-wave-2': playing,
            'opacity-30': !playing
          })}
          fill="currentColor"
          d="M426.7 256c0-71-43.4-131.8-105-157.5l-16.4 39.4C351.5 157.2 384 202.8 384 256c0 53.3-32.5 98.8-78.8 118.1l16.4 39.4C383.3 387.8 426.7 327 426.7 256"
        />
        <path
          className={classNames('sound-wave', {
            'sound-wave-3': playing,
            'opacity-30': !playing
          })}
          fill="currentColor"
          d="M354.5 19.7L338 59.1C415.1 91.2 469.3 167.2 469.3 256c0 88.7-54.2 164.8-131.3 196.9l16.4 39.4C447 453.7 512 362.5 512 256S447 58.3 354.5 19.7"
        />
      </svg>
    </div>
  )
}
