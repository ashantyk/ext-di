const path = require('path');
const expect = require('chai').expect;
const Manager = require(path.join(__dirname, '../lib/manager.js'));

describe('Manager', () => {

    describe('#constructor', () => {

        let negativeTests = [
            {args: null, expected: "Invalid property : config"},
            {args: true, expected: "Invalid property : config"},
            {args: 1, expected: "Invalid property : config"},
            {
                args: () => {
                }, expected: "Invalid property : config"
            },
            {args: {"mock": null}, expected: "Invalid property : mock"},
            {args: {"mock": {}}, expected: "Invalid property : mock.module"},
            {args: {"mock": {"module": null}}, expected: "Invalid property : mock.module"},
            {args: {"mock": {"module": true}}, expected: "Invalid property : mock.module"},
            {args: {"mock": {"module": 1}}, expected: "Invalid property : mock.module"},
            {args: {"mock": {"module": "m", "className": null}}, expected: "Invalid property : mock.className"},
            {args: {"mock": {"module": "m", "className": true}}, expected: "Invalid property : mock.className"},
            {args: {"mock": {"module": "m", "className": 1}}, expected: "Invalid property : mock.className"},
            {
                args: {"mock": {"module": "m", "className": "c", "instantiate": null}},
                expected: "Invalid property : mock.instantiate"
            },
            {
                args: {"mock": {"module": "m", "className": "c", "instantiate": 1}},
                expected: "Invalid property : mock.instantiate"
            },
            {
                args: {"mock": {"module": "m", "className": "c", "instantiate": "s"}},
                expected: "Invalid property : mock.instantiate"
            },
        ];

        negativeTests.forEach(function (test) {
            it('should throw ' + test.expected, function () {
                expect(function () {
                    let injector = new Manager(test.args);
                }).to.throw(TypeError, test.expected);
            });
        });

        let positiveTests = [
            //{args: {"mock": console}},
            {args: {"mock": {"module": 'cluster'}}},
            {args: {"mock": {"module": "mocha", "instantiate": true}}},
            {args: {"mock": {"module": 'mocha', "className": 'Mocha'}}},
            {args: {"mock": {"module": "mocha", "className": 'Mocha', "instantiate": true}}},
        ];

        positiveTests.forEach(function (test) {
            it('should not throw ' + JSON.stringify(test.args), function () {
                expect(function () {
                    let injector = new Manager(test.args);
                }).not.to.throw(Error);
            });
        });

    });

    describe('#get', () => {

        let positiveTests = [
            {
                args: {
                    "mock": {
                        "module": path.join(__dirname, 'dependencies', 'module.js')
                    },
                    //'logger': console,
                    //'process': process,
                    'utils': {module: 'mocha'},
                    'native': {module: path.join(__dirname, 'dependencies', 'native.js')},
                    'other': {module: path.join(__dirname, 'dependencies', 'other.js')},
                    'fn': {module: path.join(__dirname, 'dependencies', 'fn.js')}
                },
                name: 'mock',
                method: "getResult",
                expected: 1,
                ctor: "Object"
            },
            {
                args: {
                    "mock": {
                        "module": path.join(__dirname, 'dependencies', 'moduleInstance.js'),
                        "instantiate": true
                    },
                    //'logger': console,
                    //'process': process,
                    'utils': {module: 'mocha'},
                    'native': {module: path.join(__dirname, 'dependencies', 'native.js')},
                    'other': {module: path.join(__dirname, 'dependencies', 'other.js')},
                    'fn': {module: path.join(__dirname, 'dependencies', 'fn.js')}
                },
                name: 'mock',
                method: "getResult",
                expected: process.pid + 124035,
                ctor: "TestModuleInstance"
            },
            {
                args: {
                    "mock": {
                        "module": path.join(__dirname, 'dependencies', 'moduleClass.js'),
                        "className": 'TestModuleClass'
                    },
                    //'logger': console,
                    //'process': process,
                    'utils': {module: 'mocha'},
                    'native': {module: path.join(__dirname, 'dependencies', 'native.js')},
                    'other': {module: path.join(__dirname, 'dependencies', 'other.js')},
                    'fn': {module: path.join(__dirname, 'dependencies', 'fn.js')}
                },
                name: 'mock',
                method: "getResult",
                expected: process.pid + 2 * 124035,
                ctor: "TestModuleClass"
            },
            {
                args: {
                    "mock": {
                        "module": path.join(__dirname, 'dependencies', 'moduleClassInstance.js'),
                        "className": 'TestModuleClassInstance',
                        "instantiate": true
                    },
                    //'logger': console,
                    //'process': process,
                    'utils': {module: 'mocha'},
                    'native': {module: path.join(__dirname, 'dependencies', 'native.js')},
                    'other': {module: path.join(__dirname, 'dependencies', 'other.js')},
                    'fn': {module: path.join(__dirname, 'dependencies', 'fn.js')}
                },
                name: 'mock',
                method: "getResult",
                expected: process.pid + 3 * 124035,
                ctor: "TestModuleClassInstance"
            }
        ];

        positiveTests.forEach(function (test) {
            it('should create the module ' + test.name + `(${test.ctor})` + ' run ' + test.method + ' and return ' + test.expected, async function () {
                let injector = new Manager(test.args);
                const instance = await injector.get(test.name);
                expect(instance.constructor.name + "").to.equal(test.ctor);
                const result = await instance[test.method]();
                expect(result).to.equal(test.expected);
            });
        });

    });

});