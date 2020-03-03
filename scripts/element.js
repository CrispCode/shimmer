'use strict'

import { loop, uid } from '@crispcode/modux'

import { Container } from '@pixi/display'

import { Tween } from './tween.js'

/**
 * This class is used to create elements for shimmer
 */
export class Element extends Container {
  /**
   * Creates an instance of Element
   */
  constructor () {
    super()

    /**
     * Stores the current horizontal position of the Element
     * @type {Number}
     */
    this.x = 0

    /**
     * Stores the current vertical position of the Element
     * @type {Number}
     */
    this.y = 0

    /**
     * Stores the current alpha value for the Element
     * @type {Number}
     */
    this.alpha = 1

    /**
     * Holds all the Tween instances for the Element
     * @type {Object}
     * @private
     */
    this.__tweens = {}

    /**
     * Holds all the sub elements of the Element
     * @type {Object}
     * @private
     */
    this.__children = {}

    /**
     * The modux application databus
     * @type {Class}
     * @private
     */
    this.__databus = null
  }

  /**
   * Creates a new tween for the Element
   * @param {Number} from The start point for the Tween
   * @param {Number} to The end point for the Tween
   * @param {Number} step The step value for the Tween
   * @param {Function} oneach A listener which gets called on each Tween step
   * @param {String} id An specific identifier to use in this element. If not defined, a random unique one will be used.
   * @return {Promise} The promise is resolved on tween end
   */
  createTween ( from, to, step, oneach, id ) {
    return new Promise( ( resolve ) => {
      id = id || uid()
      let tween = new Tween( from, to, step )
      tween.end( () => {
        delete this.__tweens[ id ]
        resolve()
      } )
      if ( typeof oneach === 'function' ) {
        tween.each( oneach )
      }
      this.__tweens[ id ] = tween
    } )
  }

  /**
   * Removes a tween from the element
   * @param {String} id An specific identifier to used remove tweens from the element
   */
  removeTween ( id ) {
    if ( id ) {
      delete this.__tweens[ id ]
    } else {
      this.__tweens = {}
    }
  }

  /**
   * Adds a sub element. An element child
   * @param {String} id An identifier for the added child
   * @param {Element} element An instance of the Element class
   * @return {Element} The current instance
   */
  addElementChild ( id, element ) {
    super.addChild( element )
    this.__children[ id ] = element
    return this
  }

  /**
   * Removes a sub element. An element child
   * @param {String} id An identifier used to find the child
   * @return {Element} The current instance
   */
  removeElementChild ( id ) {
    let element = this.__children[ id ]
    super.removeChild( element )
    delete this.__children[ id ]
    return this
  }

  /**
   * Returns a child or all child Elements
   * @param {String} [name=null] If provided, will return the child with this identifier
   * @return {Object} An object containing all the child Elements
   */
  getElementChild ( name ) {
    if ( name ) {
      return this.__children[ name ]
    }
    return this.__children
  }

  /**
   * Sets element visibility to true
   * @return {Promise} A promise wich is resolved once the method is fully executed
   */
  show () {
    this.alpha = 1
    return Promise.resolve()
  }

  /**
   * Sets element visibility to false
   * @return {Promise} A promise wich is resolved once the method is fully executed
   */
  hide () {
    this.alpha = 0
    return Promise.resolve()
  }

  /**
   * A method called by the renderer on each animation frame
   * @param {Number} delta The delta time between cycles
   */
  tick ( delta ) {
    loop( this.__tweens, ( tween ) => {
      tween.next( delta )
    } )
    loop( this.getElementChild(), ( element ) => {
      element.tick( delta )
    } )
  }
}
