'use strict'

import { approx, rnd, loop } from '@crispcode/modux'

import { Shimmer } from './../../../../scripts'

import { ButtonMain } from './buttonMain.js'
import { Moon } from './moon.js'
import { Debug } from './debug.js'

export class ShimmerComponent extends Shimmer {
  onResize ( width, height ) {
    super.onResize( width, height )

    if ( this.__button ) {
      this.__button.x = this.renderer.width / this.renderer.resolution / 2
      this.__button.y = this.renderer.height / this.renderer.resolution / 2
    }

    loop( this.__moons, ( moon ) => {
      moon.setCenter( this.__button.x, this.__button.y )
      moon.show()
    } )
  }

  get settings () {
    return {
      backgroundAlpha: 1,
      backgroundColor: 0xFFFF00
      // forceCanvas: true
    }
  }

  execute () {
    this.preload( {
      'image1': '/image1.png',
      'image2': '/image2.png'
    } )
      .then( ( resources ) => {
        this.__button = new ButtonMain( resources[ 'image1' ].texture )
        this.stage.addElementChild( 'button', this.__button )

        this.__moons = {}

        for ( let i = 0; i < 20; i++ ) {
          let moon = new Moon( resources[ 'image2' ].texture )
          moon.setAngle( rnd( 0, 359 ) )
          moon.setRadius( rnd( 200, 500 ) )
          moon.setSpeed( rnd( 10, 50 ) / 10 )
          moon.setCenter( this.__button.x, this.__button.y )
          moon.scale.set( rnd( 1, 2 ) )

          this.stage.addElementChild( 'moon' + i, moon )

          this.__moons[ i ] = moon
        }

        this.__button.onMouseDown( () => {
          loop( this.__moons, ( moon ) => {
            moon.start()
          } )
        } )

        this.__button.onMouseUp( () => {
          loop( this.__moons, ( moon ) => {
            moon.stop()
          } )
        } )
        this.__button.onMouseUpOutside( () => {
          loop( this.__moons, ( moon ) => {
            moon.stop()
          } )
        } )

        this.__debug = new Debug( this.store )
        this.stage.addElementChild( 'debug', this.__debug )

        this.onResize( this.element.clientWidth, this.element.clientHeight )

        this.ticker.start()

        this.ticker.add( ( delta ) => {
          this.store.set( 'action.webgl', this.renderer.context.webGLVersion || false )
          this.store.set( 'action.delta', approx( delta, 4 ) )
        } )
      } )
  }
}
