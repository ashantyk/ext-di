/**
 * Parse configuration settings
 *
 * @param {object} config
 * @return {object}
 * @throws {TypeError}
 * @private
 */
function _parseConfig(config){

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

module.exports = _parseConfig;
