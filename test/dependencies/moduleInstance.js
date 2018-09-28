function TestModuleInstance() {

}

TestModuleInstance.prototype.needs = function() {
    return ['fn', 'native', 'other', 'utils'/*, 'logger', 'process'*/];
};

TestModuleInstance.prototype.getResult = async function() {

    let native = await this.ext.get('native');
    let fn = await this.ext.get('fn');
    let other = await this.ext.get('other');

    return native.nr + fn(0, native.nr, other.array.reduce((left, nr) => {return left + nr;}, 0));

};

module.exports = TestModuleInstance;