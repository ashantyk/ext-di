const clone = require('clone');

class Manager {

    /**
     * Class constructor
     *
     * @param {object} config The configuration options for this instance of the Injector
     * @param {string} scope Property name where the injector manager will be present on the created instances (default: ext)
     */
    constructor(config, scope) {

        this._config = {};
        this._scope = scope || "ext";

        this._instances = {};

        this.register(config);

    }

    /**
     * Parse configuration settings
     *
     * @param {object} config
     * @return {object}
     * @throws {TypeError}
     */
    _parseConfig(config){

        if(Object.prototype.toString.call(config) !== "[object Object]"){
            throw new TypeError("Invalid property : config");
        }

        let parsedOptions = {};

        for(let alias in config) {

            if (!config[alias]) {
                throw new TypeError(`Invalid property : ${alias}`);
            }

            let type = Object.prototype.toString.call(config[alias]);

            if(type === "[object String]"){

                parsedOptions[alias] = {
                    'module'      : config[alias],
                    'className'   : null,
                    'instantiate' : false
                };

            } else if(type === "[object Object]"){

                if ( !config[alias].module || typeof config[alias].module !== "string" ) {
                    throw new TypeError(`Invalid property : ${alias}.module`);
                }

                if ( config[alias].hasOwnProperty('className') && typeof config[alias].className !== "string" ){
                    throw new TypeError(`Invalid property : ${alias}.className`);
                }

                if ( config[alias].hasOwnProperty('instantiate') && typeof config[alias].instantiate !== "boolean" ){
                    throw new TypeError(`Invalid property : ${alias}.instantiate`);
                }

                // clone config

                parsedOptions[alias] = {
                    'module'      : config[alias].module,
                    'className'   : config[alias].className,
                    'instantiate' : config[alias].instantiate
                };

                if(typeof config[alias].params !== "undefined" && parsedOptions[alias].instantiate){
                    parsedOptions[alias].params = clone(config[alias].params);
                }

            } else {
                // alias definition is neither object or string. maybe warn ?
                continue;
            }

        }

        return parsedOptions;

    }

    /**
     * Register dependencies
     *
     * @param {object} config
     */
    register(config){

        let parsedConfig = this._parseConfig(config);

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

        let result = null;

        if (className && instantiate) {
            result = await this._getModuleClassAndInstantiate(alias);
        } else if (!className && instantiate) {
            result = await this._getModuleAndInstantiate(alias);
        } else if (className && !instantiate) {
            result = await this._getModuleClass(alias);
        } else {
            result = await this._getModule(alias);
        }

        if (!result) {
            throw new Error(`${alias} cannot be instantiated/fetched!`);
        }

        if(typeof result.init === 'function'){
            result = await result.init(clone(this._config[alias].params));
        }

        // cache the instance
        this._instances[alias] = result;

        //
        return result;

    }

    /**
     * Get reference to a module but no not instantiate it
     * @param {string} alias The alias name of the module
     * @return {*}
     * @private
     */
    async _getModule(alias) {

        const moduleName = this._config[alias].module;

        // load the module
        let loadedModule = require(moduleName);

        // load dependencies
        await this._loadNeededDependencies(null, loadedModule);

        //
        return loadedModule;

    }

    /**
     * Instantiate a module that directly exports a class using the configured parameter
     * @param {string} alias The alias name of the class
     * @return {*}
     * @private
     */
    async _getModuleAndInstantiate(alias) {

        // read params from config options
        const moduleName = this._config[alias].module;
        const params = this._config[alias].params;

        // here will be the instance
        let instance = null;

        // load the module
        let loadedModule = require(moduleName);

        // instantiate the class directly from the module
        if (typeof params !== "undefined") {
            instance = new loadedModule(params);
        } else {
            instance = new loadedModule();
        }

        // load dependencies
        await this._loadNeededDependencies(loadedModule, instance);

        //
        return instance;

    }

    /**
     * Get reference to a class that resides in the module but no not instantiate it
     * @param {string} alias The alias name of the class
     * @return {*}
     * @private
     */
    async _getModuleClass(alias) {

        // read params from config options
        const moduleName = this.options[alias].module;
        const className = this.options[alias].className;

        // load the module
        let loadedModule = require(moduleName);

        // get the class definition
        let loadedClass = loadedModule[className];

        // load dependencies
        await this._loadNeededDependencies(null, loadedClass);

        //
        return loadedClass;

    }

    /**
     * Instantiate a class that resides in the module using the configured parameter
     * @param {string} alias The alias name of the class
     * @return {*}
     * @private
     */
    async _getModuleClassAndInstantiate(alias) {

        // read params from config options
        const moduleName = this.options[alias].module;
        const className = this.options[alias].className;
        const params = this.options[alias].params;

        // here will be the instance
        let instance = null;

        // load the module
        let loadedModule = require(moduleName);

        // get the class definition
        let loadedClass = loadedModule[className];

        // instantiate the class
        if (typeof params !== "undefined") {
            instance = new loadedClass(params);
        } else {
            instance = new loadedClass();
        }

        // load dependencies
        await this._loadNeededDependencies(loadedClass, instance);

        //
        return instance;

    }

    /**
     * Load the dependencies recursively
     * @param {class} cls Class/Function definition
     * @param {object} instance The instance of the class/function definition
     * @private
     */
    async _loadNeededDependencies(cls, instance) {

        //
        let neededClasses = [];

        // search for the needs() function in the class or the instance
        if (cls && typeof cls.needs === "function") {
            neededClasses = cls.needs();
        } else if (instance && typeof instance.needs === "function") {
            neededClasses = instance.needs();
        }

        if(neededClasses.length){
            instance[this._scope] = {};
        }

        // load each dependency and store it directly in the instance
        for (let neededClass of neededClasses) {
            instance[this._scope][neededClass] = await this.get(neededClass);
        }

    }

}

module.exports = Manager;
