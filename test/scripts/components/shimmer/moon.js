'use strict'

import { radians } from '@crispcode/modux'

import { Element, Sprite, Graphics, Text } from './../../../../scripts'

export class Moon extends Element {
  constructor ( texture ) {
    super()

    let image = new Sprite( texture )
    image.anchor.set( 0.5 )

    let border = new Graphics()
    border.beginFill( 0xFF0000, 1 )
    border.drawCircle( 0, 0, image.width / 2 + 5 )
    border.endFill()
    this.addChild( border )

    this.addChild( image )

    let text = new Text( 'X', { fill: 0xFFFFFF } )
    text.anchor.set( 0.5 )
    this.addChild( text )

    this.alpha = 0

    this.__angle = 0
    this.__radius = 0
    this.__speed = 1
    this.__centerX = 0
    this.__centerY = 0

    this.__rotating = false

    this.interactive = true
    this.on( 'mousewheel', ( e ) => {
      e.stopPropagation()
      let scale = Math.max( 0.2, Math.min( this.scale.x, this.scale.y ) + e.deltaY / -100 )
      this.scale.set( scale )
    } )
  }

  __move () {
    this.x = this.__centerX + this.__radius * Math.cos( radians( this.__angle ) )
    this.y = this.__centerY + this.__radius * Math.sin( radians( this.__angle ) )
  }

  setCenter ( x, y ) {
    this.__centerX = x
    this.__centerY = y
    this.__move()
  }
  setAngle ( angle ) {
    this.__angle = angle
    this.__move()
  }
  setRadius ( radius ) {
    this.__radius = radius
    this.__move()
  }
  setSpeed ( speed ) {
    this.__speed = speed
  }

  start () {
    this.__rotating = true
  }

  stop () {
    this.__rotating = false
  }

  tick ( delta ) {
    if ( this.__rotating ) {
      this.__angle = this.__angle + this.__speed * delta
      if ( this.__angle === 360 ) {
        this.__angle = 0
      }
      this.__move( delta )
    }
  }
}
