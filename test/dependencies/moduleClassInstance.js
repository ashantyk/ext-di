function TestModuleClassInstance() {

}

TestModuleClassInstance.prototype.needs = function() {
    return ['fn', 'native', 'other', 'utils'/*, 'logger', 'process'*/];
};

TestModuleClassInstance.prototype.getResult = function() {
    return this.process.pid + 3 * this.func(0, this.native.nr, this.other.array.reduce((left, nr) => {return left + nr;},0));
};

module.exports.TestModuleClassInstance = TestModuleClassInstance;