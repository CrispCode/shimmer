/* globals document */

'use strict'

import { VideoResource, Texture } from '@pixi/core'
import { Sprite } from '@pixi/sprite'

import { Element } from './element.js'

/**
 * This class is used to create video elements for shimmer
 * @param {Video|String} video The source Video element or url
 * @param {Object} options The options for the video
 */
export class Video extends Element {
  /**
   * Creates an instance of Video
   */
  constructor ( source, options = {} ) {
    super()

    if ( typeof source === Video ) {
      this.__source = document.createElement( 'video' )
      this.__source.playsInline = true
      this.__source.preload = 'auto'
      this.__source.autoplay = false
      this.__source.muted = ( options.muted !== undefined ) ? options.muted : false
      this.__source.loop = ( options.loop !== undefined ) ? options.loop : true
      this.__source.src = source
    } else {
      this.__source = source
    }

    this.__resource = new VideoResource( this.__source, {
      autoPlay: ( options.autoPlay !== undefined ) ? options.autoPlay : false,
      autoLoad: ( options.autoLoad !== undefined ) ? options.autoLoad : true,
      updateFPS: ( options.updateFPS !== undefined ) ? options.updateFPS : 0,
      crossorigin: ( options.crossorigin !== undefined ) ? options.crossorigin : true
    } )

    let texture = Texture.from( this.__resource )
    let sprite = new Sprite( texture )

    this.addChild( sprite )
  }

  /**
   * Loads the video file
   */
  load () {
    return this.__resource.load()
  }

  /**
   * Plays the video at a specific rate, or default if nothing is specified
   * @param {Number} playbackRate
   */
  play ( playbackRate ) {
    if ( playbackRate ) {
      this.__source.playbackRate = playbackRate
    }
    this.__source.play()
  }

  /**
   * Pause the video
   */
  pause () {
    this.__source.pause()
  }

  /**
   * Mutes or unmutes the video
   * @param {boolean} muted
   */
  muted ( muted ) {
    this.__source.muted = !!muted
  }
}
