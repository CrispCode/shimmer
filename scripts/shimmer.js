/* globals window */

'use strict'

import { Component, extend, loop, logger } from '@crispcode/modux'

import { autoDetectRenderer, Renderer, BatchRenderer } from '@pixi/core'
import { Loader } from '@pixi/loaders'
import { Ticker } from '@pixi/ticker'
import { InteractionManager } from '@pixi/interaction'
import { skipHello, isWebGLSupported } from '@pixi/utils'

// Canvas support
import '@pixi/canvas-display'
import { CanvasExtract } from '@pixi/canvas-extract'
import { CanvasGraphicsRenderer } from '@pixi/canvas-graphics'
import { CanvasMeshRenderer } from '@pixi/canvas-mesh'
import '@pixi/canvas-particle-container'
import { CanvasPrepare } from '@pixi/canvas-prepare'
import { CanvasRenderer } from '@pixi/canvas-renderer'
import '@pixi/canvas-sprite-tiling'
import { CanvasSpriteRenderer } from '@pixi/canvas-sprite'
import '@pixi/canvas-text'

import { Element } from './element.js'

Renderer.registerPlugin( 'interaction', InteractionManager )
Renderer.registerPlugin( 'batch', BatchRenderer )

CanvasRenderer.registerPlugin( 'interaction', InteractionManager )
CanvasRenderer.registerPlugin( 'extract', CanvasExtract )
CanvasRenderer.registerPlugin( 'graphics', CanvasGraphicsRenderer )
CanvasRenderer.registerPlugin( 'mesh', CanvasMeshRenderer )
CanvasRenderer.registerPlugin( 'prepare', CanvasPrepare )
CanvasRenderer.registerPlugin( 'sprite', CanvasSpriteRenderer )

/**
 * This class is used to create the shimmer component
 */
export class Shimmer extends Component {
  /**
   * The html string that becomes the view for this component
   * @type {String}
   */
  get template () {
    return '<canvas style="display: block; width: 100%; height: 100%;"></canvas>'
  }

  /**
   * The initialization options for shimmer
   * @type {Object}
   */
  get settings () {
    return {}
  }

  /**
   * The method gets called whenever the container is resized
   * @param {Number} width The width of the container
   * @param {Number} height The height of the container
   */
  onResize ( width, height ) {

  }

  /**
   * This method preloads a colection of assets
   * @param {Object} assets A collection of assets
   * @return {Promise} A promise which is resolved upon loading the assets. It resolves the loaded resources.
   */
  preload ( assets ) {
    let loader = new Loader()
    return new Promise( ( resolve ) => {
      loop( assets, ( data, name ) => {
        loader.add( name, data )
      } )
      loader.load( ( loader, resources ) => {
        resolve( resources )
      } )
    } )
  }

  /**
   * Creates an instance of Shimmer
   * @param {HTMLElement} parent The parent wrapper
   * @param {Module} module The parent module instance
   * @param {Store} store An instance of @crispcode/pushstore, see https://www.npmjs.com/package/@crispcode/pushstore
   */
  constructor ( parent, module, store ) {
    super( parent, module, store )

    skipHello()

    /**
     * Stores the parent Element
     * @type {Element}
     */
    this.stage = new Element()

    /**
     * Holds the previous width and height of the element
     * @type {Object}
     * @private
     */
    let previousElementSize = {}
    /**
     * Determines if the component watches for resize changes in parent dimensions
     * @type {Boolean}
     * @private
     */
    this.__resizeWatcher = true
    /**
     * This function checks for element size changes every 100ms as long as the component exists
     * @type {Function}
     * @private
     */
    const parentResizeCheck = () => {
      setTimeout( () => {
        if ( this.__resizeWatcher ) {
          if ( previousElementSize.width !== this.element.clientWidth || previousElementSize.height !== this.element.clientHeight ) {
            previousElementSize.width = this.element.clientWidth
            previousElementSize.height = this.element.clientHeight
            this.onResize( previousElementSize.width, previousElementSize.height )
          }
          parentResizeCheck()
        }
      }, 100 )
    }
    parentResizeCheck()

    /**
     * Stores the main ticker, which handles animation frames
     * @type {Ticker}
     */
    this.ticker = new Ticker()
    this.ticker.add( ( delta ) => {
      this.stage.tick( delta )
      this.renderer.render( this.stage )
    } )

    /**
     * Renderer initialization settings
     * @type {Object}
     * @private
     */
    const rendererSettings = extend( {
      view: this.element,
      autoDensity: false,
      backgroundAlpha: 0,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1
    }, {
      autoDensity: this.settings.autoDensity,
      backgroundAlpha: this.settings.backgroundAlpha,
      backgroundColor: this.settings.backgroundColor,
      antialias: this.settings.antialias,
      resolution: this.settings.resolution
    } )

    /**
     * Stores the renderer
     * @type {Renderer}
     */
    this.renderer = ( isWebGLSupported() ) ? autoDetectRenderer( rendererSettings ) : new CanvasRenderer( rendererSettings )

    this.renderer.resize( this.element.clientWidth, this.element.clientHeight )

    this.renderer.plugins.interaction.autoPreventDefault = false

    if ( !isWebGLSupported() ) {
      logger.warn( 'WebGL is not supported. Using Canvas fallback.' )
    }

    this._onWheel = ( e ) => {
      // Find the element targeted based on the hitTest
      let target = this.renderer.plugins.interaction.hitTest( { x: e.offsetX, y: e.offsetY } )
      if ( target && target.interactive ) {
        e.preventDefault()
        target.emit( 'mousewheel', e )
      }
    }
    this.element.addEventListener( 'wheel', this._onWheel, { passive: false } )
  }

  /**
   * The method gets called when the component is destroyed
   */
  __destroy () {
    super.__destroy()
    this.element.removeEventListener( 'wheel', this._onWheel )
    this.__resizeWatcher = false
    if ( this.ticker.started ) {
      this.ticker.stop()
    }
  }
}
