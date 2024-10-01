'use strict'

import { loop, uid } from '@crispcode/modux'

import { Element } from './element.js'

/**
 * This class is used to create buttons for shimmer
 */
export class Button extends Element {
  /**
   * Creates an instance of Button
   */
  constructor () {
    super()

    /**
     * Marks the Button as interactive
     * @type {Boolean}
     */
    this.eventMode = 'static'
    /**
     * Marks the Button as a button
     * @type {Boolean}
     */
    this.buttonMode = true

    /**
     * Holds all event listeners
     * @type {Object}
     * @private
     */
    this.__handlers = {}
    /**
     * Enables or disables the button interactivity
     * @type {Boolean}
     * @private
     */
    this.__enabled = true

    /**
     * This function calls all event listeners for a specific eventname
     * @param {String} eventname The event name
     * @private
     */
    const __triggerEventHandlers = ( eventname ) => {
      return ( ev ) => {
        if ( this.__enabled ) {
          loop( this.__handlers[ eventname ], ( handler ) => {
            handler( ev )
          } )
        }
      }
    }

    this
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
      .on( 'pointerdown', __triggerEventHandlers( 'pointerdown' ) )
      .on( 'pointerup', __triggerEventHandlers( 'pointerup' ) )
      .on( 'pointerupoutside', __triggerEventHandlers( 'pointerupoutside' ) )
      .on( 'pointerover', __triggerEventHandlers( 'pointerover' ) )
      .on( 'pointerout', __triggerEventHandlers( 'pointerout' ) )
  }

  /**
   * Adds an event listener to the Button
   * @param {String} eventname The event name
   * @param {Function} handler The event handler
   * @return {Function} A function which can be called to unregister the event handler
   */
  __addEventHandler ( eventname, handler ) {
    this.__handlers[ eventname ] = this.__handlers[ eventname ] || {}
    let id = uid()
    this.__handlers[ eventname ][ id ] = handler
    return () => {
      delete this.__handlers[ eventname ][ id ]
    }
  }

  /**
   * Enables or disables the button interactivity
   * @param {Boolean} enabled If true, button is enabled, otherwise its disabled
   */
  enable ( enabled ) {
    this.__enabled = !!enabled
    if ( enabled ) {
      this.eventMode = 'static'
      this.buttonMode = true
    } else {
      this.eventMode = 'auto'
      this.buttonMode = false
    }
  }

  /**
   * Adds an event listener for the Mouse Over event
   * @param {Function} handler The event listener
   * @return {Function} A function which can be called to unregister the event handler
   */
  onMouseOver ( handler ) {
    return this.__addEventHandler( 'pointerover', handler )
  }
  /**
   * Adds an event listener for the Mouse Out event
   * @param {Function} handler The event listener
   * @return {Function} A function which can be called to unregister the event handler
   */
  onMouseOut ( handler ) {
    return this.__addEventHandler( 'pointerout', handler )
  }
  /**
   * Adds an event listener for the Mouse Down event
   * @param {Function} handler The event listener
   * @return {Function} A function which can be called to unregister the event handler
   */
  onMouseDown ( handler ) {
    return this.__addEventHandler( 'pointerdown', handler )
  }
  /**
   * Adds an event listener for the Mouse Up event
   * @param {Function} handler The event listener
   * @return {Function} A function which can be called to unregister the event handler
   */
  onMouseUp ( handler ) {
    return this.__addEventHandler( 'pointerup', handler )
  }
  /**
   * Adds an event listener for the Mouse Up Outside event
   * @param {Function} handler The event listener
   * @return {Function} A function which can be called to unregister the event handler
   */
  onMouseUpOutside ( handler ) {
    return this.__addEventHandler( 'pointerupoutside', handler )
  }
}
