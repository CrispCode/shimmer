/* globals window, document */

'use strict'

import { Module, logger } from '@crispcode/modux'

import { LayoutComponent } from './components/layout'
import { ShimmerComponent } from './components/shimmer'

import './../styles/index.scss'

let initialize = () => {
  // Create application
  let app = new Module( 'app' )
  app
    .addDependency( 'layout', LayoutComponent )
    .addDependency( 'shimmer', ShimmerComponent )

  app.store.set( 'core', window.config )
  logger.enabled( app.store.get( 'core.debug' ) )

  logger.info( 'Application start' )

  // Start application
  app.bootstrap( document.querySelector( 'body' ), 'layout' )
}

window.addEventListener( 'load', () => {
  initialize()
} )
