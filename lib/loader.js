/**
 * Loader for dependency injector
 */
class Loader {

    /**
     * Get reference to a module but no not instantiate it
     *
     * @param {string} moduleName
     * @return {*}
     */
    static getModule(moduleName) {
        return require(moduleName);
    }

    /**
     * Instantiate a module that directly exports a class using the configured parameter
     *
     * @param {string} moduleName
     * @param {*} params
     * @return {*}
     */
    static getModuleAndInstantiate(moduleName, params) {

        // load the module
        let loadedModule = Loader.getModule(moduleName);

        if(!Loader.isConstructor(loadedModule)){
            throw new TypeError(`Module '${loadedModule}' can't be instantiated.`);
        }

        // here will be the instance
        let instance = null;

        // instantiate the class directly from the module
        if (typeof params !== "undefined") {
            instance = new loadedModule(params);
        } else {
            instance = new loadedModule();
        }

        return instance;

    }

    /**
     * Get reference to a class that resides in the module but no not instantiate it
     *
     * @param {string} moduleName
     * @param {string} className
     * @return {*}
     */
    static getModuleClass(moduleName, className) {
        let loadedModule = Loader.getModule(moduleName);
        return loadedModule[className];
    }

    /**
     * Instantiate a class that resides in the module using the configured parameter
     *
     * @param {string} moduleName
     * @param {string} className
     * @param {*} params
     * @return {*}
     */
    static getModuleClassAndInstantiate(moduleName, className, params) {

        // load the module
        let loadedModule = Loader.getModule(moduleName);

        // get the class definition
        let loadedClass = loadedModule[className];

        if(!Loader.isConstructor(loadedClass)){
            throw new TypeError(`Class '${className}' from module '${moduleName}' can't be instantiated.`);
        }

        // here will be the instance
        let instance = null;

        // instantiate the class
        if (typeof params !== "undefined") {
            instance = new loadedClass(params);
        } else {
            instance = new loadedClass();
        }

        return instance;

    }

    static isConstructor(obj) {
        return !!obj.prototype && !!obj.prototype.constructor.name;
    }

}

module.exports = {
    getModule: Loader.getModule,
    getModuleAndInstantiate: Loader.getModuleAndInstantiate,
    getModuleClass: Loader.getModuleClass,
    getModuleClassAndInstantiate: Loader.getModuleClassAndInstantiate
};
