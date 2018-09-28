# _**EXT DI (EXT Dependency Injector)**_

## Features

- simple dependency injection helper module
- let's you write unit-testable code 
- simple access to your dependency - all dependencies can be accessed via the injector: createdClassInstanceByInjector.ext.get(dependencyModule)
 
## Usage

Firstly, install it:

```bash
npm install --save injector
```

Use it like this

```js
const Injector = require('injector');
let injector = new Injector({ 'redis' : { module : 'ioredis', className : 'Redis' }});
```

#### API

##### `constructor(options)`
  
- `options.ALIAS_NAME` The alis name for the class 
- `options.ALIAS_NAME.module` This value will be used for 'require'
- `options.ALIAS_NAME.className` The actual class name *( leave empty if not used )*
- `options.ALIAS_NAME.params` The list of params for this instance of the class *( leave empty if not used )*
- `options.ALIAS_NAME.instantiate` Should the Injector create a __new__ instance of the 'class' *( leave empty if not used )*

|Options|Effect|
|:---|---:|
|`{"alias": console}`|This will __directly use__ the given module|
|`{"alias": {"module": 'm'}}`|__require('m')__| 
|`{"alias": {"module": "m", "instantiate": true}}`|__new require('m')()__|
|`{"alias": {"module": 'm', "className": 'C'}}`|__require('m').C__|
|`{"alias": {"module": "m", "className": 'C', "instantiate": true}}`|__new require('m').C()__|

##### `get(aliasName)`
  
- `aliasName` string The alias name for the class. It will be instantiated using the configured params

__The modules need to have a new method named *needs* that must return an array of strings.__

Each element in that array must have a definition when instantiating the "Injector" module ( must have an alias defined ).
The 'needs' method should be static for performance reasons.

```javascript
/** complex.js **/
class Complex {

    getNr() {
        return this.native.nr;
    }

    static needs() {
        return ['native'];
    }

}

/** native.js **/
module.exports = {
    nr: 123456
};

/** index.js **/
let injector = new Injector({
    'complex': {module: 'complex.js', className: 'Complex', instantiate: true},
    'native': {module: 'native.js'}
});

let complex = injector.get('complex');
complex.getNr();
```