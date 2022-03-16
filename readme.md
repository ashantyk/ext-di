# _**EXT DI (EXT Dependency Injector)**_
[![NPM](https://nodei.co/npm/ext-di.png)](https://nodei.co/npm/ext-di/)

[![npm version](https://badge.fury.io/js/ext-di.svg)](https://badge.fury.io/js/ext-di)
[![Build Status](https://travis-ci.com/ashantyk/ext-di.svg?branch=master)](https://travis-ci.org/ashantyk/ext-di)
[![Coverage Status](https://coveralls.io/repos/github/ashantyk/ext-di/badge.svg?branch=master)](https://coveralls.io/github/ashantyk/ext-di?branch=master)

## Features

- simple dependency injection helper module
- let's you write unit-testable code 
- simple access to your dependency - all dependencies can be accessed via the injector: createdClassInstanceByInjector.ext.get(dependencyModule)
 
## Usage

Firstly, install it:

```bash
npm install ext-di --save
```

Use it like this

```js
const Injector = require('ext-di');
let injector = new Injector({ 'redis' : { module : 'ioredis', className : 'Redis' }});
```

#### API

##### `constructor(config)`
  
- `config.ALIAS_NAME` The alias name for the class/module
- `config.ALIAS_NAME.module` This value will be used for 'require'
- `config.ALIAS_NAME.className` The actual class name *( leave empty if not used )*
- `config.ALIAS_NAME.params` The list of params for this instance of the class *( leave empty if not used )*
- `config.ALIAS_NAME.instantiate` Should the injector create a __new__ instance of the 'class' *( leave empty if not used )*

|Options|Effect|
|:---|---:|
|`{"alias": "fs"}`|This will __directly use__ the given module|
|`{"alias": {"module": 'm'}}`|__require('m')__| 
|`{"alias": {"module": "m", "instantiate": true}}`|__new require('m')()__|
|`{"alias": {"module": 'm', "className": 'C'}}`|__require('m').C__|
|`{"alias": {"module": "m", "className": 'C', "instantiate": true}}`|__new require('m').C()__|

##### `get(aliasName)`
  
- `aliasName` string The alias name for the class. It will be instantiated using the configured params

```javascript
/** complex.js **/
class Complex {

    async getNr() {
        let nativeService = await this.getService('native');
        return nativeService.nr;
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

let complex = await injector.get('complex');
complex.getNr();
```