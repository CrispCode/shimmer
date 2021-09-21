'use strict'

export class Controls {
  /**
    * The pixi application renderer
    * @param {Renderer} renderer
    */
  constructor ( renderer ) {
    this.__renderer = renderer
    this.__listeners = []
  }

  /**
   * Returns the custom event names
   * @param {String} name The base event name
   * @returns {String}
   */
  __getEventName ( name ) {
    return name // 'shimmer' + name.charAt( 0 ).toUpperCase() + name.slice( 1 )
  }

  /**
   * Returns the pixi element at position { x,y }
   * @param {Integer} x The x coordonate on the renderer
   * @param {Integer} y The y coordonate on the renderer
   * @returns {DisplayObject}
   */
  __getTarget ( x, y ) {
    let target = this.__renderer.plugins.interaction.hitTest( { x: x, y: y } )
    if ( target && target.interactive ) {
      return target
    }
    return null
  }

  /**
   * Enables mouse wheel event on elements
   */
  enableWheel () {
    let onPush = ( e ) => {
      let target = this.__getTarget( e.offsetX, e.offsetY )
      if ( target && target.interactive ) {
        target.emit( this.__getEventName( 'wheel' ), e )
      }
    }

    this.__renderer.view.addEventListener( 'wheel', onPush, { passive: false } )
    this.__listeners.push( () => {
      this.__renderer.view.removeEventListener( 'wheel', onPush, { passive: false } )
    } )
  }

  /**
   * Enables long taps ( long clicks ) event on elements
   */
  enableLongtap () {
    let onPush = ( e ) => {
      let target = this.__getTarget( e.offsetX, e.offsetY )
      let timeout = null
      if ( target && target.interactive ) {
        timeout = setTimeout( () => {
          target.emit( this.__getEventName( 'longtap' ), e )
        }, 700 )
      }

      let onRelease = () => {
        clearTimeout( timeout )
      }

      this.__renderer.view.addEventListener( 'touchend', onRelease, { once: true } )
      this.__renderer.view.addEventListener( 'mouseup', onRelease, { once: true } )
    }

    this.__renderer.view.addEventListener( 'touchstart', onPush, { passive: false } )
    this.__listeners.push( () => {
      this.__renderer.view.removeEventListener( 'touchstart', onPush )
    } )

    this.__renderer.view.addEventListener( 'mousedown', onPush, { passive: false } )
    this.__listeners.push( () => {
      this.__renderer.view.removeEventListener( 'mousedown', onPush )
    } )
  }

  /**
   * Destroys all listeners
   */
  destroy () {
    this.__listeners.map( ( removeListener ) => {
      removeListener()
      return true
    } )
    this.__listeners = []
  }
}
