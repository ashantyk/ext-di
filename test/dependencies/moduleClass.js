function TestModuleClass() {

}

TestModuleClass.prototype.getResult = async function() {

    let native = await this.getService('native');
    let fn = await this.getService('fn');
    let other = await this.getService('other');

    return 2 * fn(0, native.nr, other.array.reduce((left, nr) => {return left + nr;}, 0));
};

module.exports.TestModuleClass = (() => {
    return new TestModuleClass();
})();

