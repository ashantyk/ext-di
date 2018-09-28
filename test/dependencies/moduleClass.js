function TestModuleClass() {

}

TestModuleClass.prototype.needs = function() {
    return ['fn', 'native', 'other', 'utils'/*, 'logger', 'process'*/];
};

TestModuleClass.prototype.getResult = function() {
    return this.process.pid + 2 * this.func(0, this.native.nr, this.other.array.reduce((left, nr) => {return left + nr;},0));
};

module.exports.TestModuleClass = (() => {
    return new TestModuleClass();
})();