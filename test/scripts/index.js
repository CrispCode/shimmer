/* globals window, document */

'use strict'

import { Module, Router, logger } from '@crispcode/modux'

import { LayoutComponent } from './components/layout'
import { ShimmerComponent } from './components/shimmer'

let initialize = () => {
  Router.setDynamicBase( true )

  // Create application
  let app = new Module( 'app' )
  app
    .addDependency( 'layout', LayoutComponent )
    .addDependency( 'shimmer', ShimmerComponent )

  logger.info( 'Application start' )
  app.store.set( 'app', app )
  app.store.set( 'core', window.config )
  logger.enabled( app.store.get( 'core.debug' ) )

  // Start application
  app.bootstrap( document.querySelector( 'body' ), 'layout' )
}

window.addEventListener( 'load', () => {
  initialize()
} )
