/* globals window */

'use strict'

import { Component, extend, loop, logger } from '@crispcode/modux'

import { autoDetectRenderer, BatchRenderer } from '@pixi/core'
import { Assets } from '@pixi/assets'
import { Ticker } from '@pixi/ticker'
import { InteractionManager } from '@pixi/interaction'
import { skipHello, isWebGLSupported } from '@pixi/utils'
import { extensions } from '@pixi/extensions'

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
import { Controls } from './controls.js'

extensions.add( InteractionManager )
extensions.add( BatchRenderer )

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
   * @param {Object} bundle A collection of assets
   * @return {Promise} A promise which is resolved upon loading the assets. It resolves the loaded resources.
   */
  preload ( bundle ) {
    Assets.addBundle( 'bundle', bundle )
    return Assets.loadBundle( 'bundle' )
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
    this.renderer = null
    if ( isWebGLSupported() && !this.settings.forceCanvas ) {
      this.renderer = autoDetectRenderer( rendererSettings )
    } else {
      extensions.add( CanvasExtract )
      extensions.add( CanvasGraphicsRenderer )
      extensions.add( CanvasMeshRenderer )
      extensions.add( CanvasPrepare )
      extensions.add( CanvasSpriteRenderer )
      this.renderer = new CanvasRenderer( rendererSettings )
    }

    this.renderer.resize( this.element.clientWidth, this.element.clientHeight )

    this.renderer.plugins.interaction.autoPreventDefault = false

    if ( !isWebGLSupported() ) {
      logger.warn( 'WebGL is not supported. Using Canvas fallback.' )
    }

    /**
     * Stores the controls class, responsible with implementing special gestures
     */
    this.controls = new Controls( this.renderer )
    this.controls.enableWheel()
    this.controls.enableLongtap()
  }

  /**
   * The method gets called when the component is destroyed
   */
  __destroy () {
    super.__destroy()
    this.controls.destroy()
    this.__resizeWatcher = false
    if ( this.ticker.started ) {
      this.ticker.stop()
    }
  }
}
