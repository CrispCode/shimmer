# Advanced usage

## buttonMain.js
```
'use strict'

import { Button } from 'shimmer'
import { Sprite } from 'shimmer'

export class ButtonMain extends Button {
  constructor () {
    super()

    let image = Sprite.fromImage( '/image1.png' )

    image.anchor.x = 0.5
    image.anchor.y = 0.5

    this.addElementChild( 'image', image )

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
```

### moon.js
```
'use strict'

import { radians } from 'modux'

import { Element } from 'shimmer'
import { Sprite } from 'shimmer'

export class Moon extends Element {
  constructor () {
    super()

    let image = Sprite.fromImage( '/image2.png' )

    image.anchor.x = 0.5
    image.anchor.y = 0.5

    this.alpha = 0

    this.__angle = 0
    this.__radius = 0
    this.__speed = 1
    this.__centerX = 0
    this.__centerY = 0

    this.__rotating = false

    this.addElementChild( 'image', image )
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
      this.__move()
    }
  }
}
```

## Shimmer Component
```
'use strict'

import { rnd, loop } from 'modux'

import { Shimmer } from 'shimmer'

import { ButtonMain } from './buttonMain.js'
import { Moon } from './moon.js'

export class ShimmerComponent extends Shimmer {
  onResize ( width, height ) {
    super.onResize( width, height )
    this.__button.x = this.renderer.width / this.renderer.resolution / 2
    this.__button.y = this.renderer.height / this.renderer.resolution / 2

    loop( this.__moons, ( moon ) => {
      moon.setCenter( this.__button.x, this.__button.y )
      moon.show()
    } )
  }

  get settings() {
    return {
      backgroundAlpha: 1,
      backgroundColor: 0xFFFF00,
    }
  }

  execute () {
    this.ticker.start()

    this.__button = new ButtonMain()
    this.stage.addElementChild( 'button', this.__button )

    this.__moons = {}

    for ( let i = 0; i < 10; i++ ) {
      let moon = new Moon()
      moon.setAngle( rnd( 0, 359 ) )
      moon.setRadius( rnd( 200, 500 ) )
      moon.setSpeed( rnd( 10, 50 ) / 10 )
      moon.setCenter( this.__button.x, this.__button.y )

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
  }
}
```