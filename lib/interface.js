/**
 * This class can be used to be extended by your project classes
 */
class IInjectable {

    /**
     * Get the dependecies for this class
     *
     * @return {string[]} The list of dependecies (by their alias) this class needs
     */
    needs(){
        throw new TypeError("Method 'needs' is not defined for this class method!");
    }

}

module.exports = IInjectable;