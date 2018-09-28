const clone = require('clone');
const configParser = require('./configParser.js');
const loader = require('./loader.js');

/**
 * Dependency Injector Class
 */
class Injector {

    /**
     * Class constructor
     *
     * @param {object} config The configuration options for this instance of the Injector
     */
    constructor(config) {
        this._config = {};
        this._instances = {};
        this.register(config);
    }

    /**
     * Register dependencies
     *
     * @param {object} config
     */
    register(config){
        let parsedConfig = configParser(config);
        this._config = Object.assign(this._config, parsedConfig);
    }

    /**
     * Get a registered instance/object
     *
     * @param {string} alias
     */
    async get(alias){

        if(typeof this._config[alias] === 'undefined'){
            throw new Error(`Alias '${alias}' is not registered!`);
        }

        // return the saved class from cache if possible
        if (this._instances.hasOwnProperty(alias)) {
            return this._instances[alias];
        }

        const moduleName  = this._config[alias].module;
        const className   = this._config[alias].className;
        const instantiate = this._config[alias].instantiate;
        const params      = clone(this._config[alias].params);

        let result = null;

        if (className && instantiate) {
            result = loader.getModuleClassAndInstantiate(moduleName, className, params);
        } else if (!className && instantiate) {
            result = loader.getModuleAndInstantiate(moduleName, params);
        } else if (className && !instantiate) {
            result = loader.getModuleClass(moduleName, className);
        } else {
            result = loader.getModule(moduleName);
        }

        if (!result) {
            throw new Error(`${alias} cannot be instantiated/fetched!`);
        }

        // bind the manager to the instance
        let me = this;
        result.__proto__.getService = async function(serviceAlias){
            return await me.get(serviceAlias);
        };

        if(typeof result.init === 'function'){
            result = await result.init(params);
        }

        // cache the instance
        this._instances[alias] = result;

        return result;

    }

}

module.exports = Injector;
