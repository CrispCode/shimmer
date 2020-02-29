# shimmer
A PIXI.JS wrapper plugin for MODUX

## Installation

```
npm install CrispCode/shimmer#v3.0.1 --save-dev
```

## Documentation & Testing

Clone the shimmer repository to your machine and use the following commands:

To generate a documentation use `npm run docs`
If you want to check functionality you can use `npm run test` 

## Polyfill

In order to support older versions of browsers, you can use polyfills:

```
    <script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?flags=gated&features=default%2CMutationObserver%2CString.prototype.padStart%2Cconsole.info%2CNumber.isInteger%2CMath.sign"></script>
```

## Shimmer classes

  |Name|Usage|Description|
  |:---:|---|---|
  | Button | `import { Button } from 'shimmer'` | The Button class is an extension of the standard Element class |
  | Element | `import { Element } from 'shimmer'` | The base class for all Shimmer objects |
  | Shimmer | `import { Shimmer } from 'shimmer'` | The Shimmer component class, check Modux/Component for more information |
  | Tween | `import { Tween } from 'shimmer'` | A class used to create animation tweens in Element or Shimmer |
  | Sprite | `import { Sprite } from 'shimmer'` | PIXI.JS Sprite class |
  | AnimatedSprite | `import { AnimatedSprite } from 'shimmer'` | PIXI.JS AnimatedSprite class |
  | Text | `import { Text } from 'shimmer'` | PIXI.JS Text class |
  | Graphics | `import { Graphics } from 'shimmer'` | PIXI.JS Graphics class |
  | Texture | `import { Texture } from 'shimmer'` | PIXI.JS Texture class |
  | BaseTexture | `import { BaseTexture } from 'shimmer'` | PIXI.JS BaseTexture class |
  