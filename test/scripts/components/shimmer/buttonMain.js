'use strict'

import { Button, Sprite } from './../../../../scripts'

export class ButtonMain extends Button {
  constructor ( texture ) {
    super()

    let image = new Sprite( texture )
    image.anchor.set( 0.5 )
    this.addChild( image )

    this.onMouseOver( () => {
      this.createTween( 10, 12, 1, ( value ) => {
        image.scale.x = value / 10
        image.scale.y = value / 10
      } )
    } )

    this.onMouseOut( () => {
      this.createTween( 10, 12, 1, ( value ) => {
        image.scale.x = ( 22 - value ) / 10
        image.scale.y = ( 22 - value ) / 10
      } )
    } )
  }
}
