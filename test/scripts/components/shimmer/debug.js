'use strict'

import { Element, Graphics, Text } from './../../../../scripts'

export class Debug extends Element {
  constructor ( store ) {
    super()

    let container = new Graphics()
    container.lineStyle( 1, 0xFF0000, 1 )
    container.beginFill( 0x000000, 1 )
    container.drawRect( 0, 0, 200, 60 )
    container.endFill()
    this.addChild( container )

    this._txtWebgl = new Text( 'WEBGL: ', {
      fill: 0xFFFFFF,
      fontSize: 20
    } )
    this._txtWebgl.anchor.set( 0, 0.5 )
    this._txtWebgl.x = 20
    this._txtWebgl.y = 20
    this.addChild( this._txtWebgl )

    this._txtDelta = new Text( 'DELTA: ', {
      fill: 0xFFFFFF,
      fontSize: 20
    } )
    this._txtDelta.anchor.set( 0, 0.5 )
    this._txtDelta.x = 20
    this._txtDelta.y = 40
    this.addChild( this._txtDelta )

    store.on( 'action.webgl', ( value ) => {
      this._txtWebgl.text = 'WEBGL: ' + value
    }, true )

    store.on( 'action.delta', ( value ) => {
      this._txtDelta.text = 'DELTA: ' + value
    }, true )
  }
}
