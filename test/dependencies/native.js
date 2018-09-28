module.exports = {
    f: (a) => {
        console.log("sync", a);
    },
    af: async (a) => {
        console.log("async", a);
    },
    b: true,
    n: null,
    u: undefined,
    nr: 123456,
    s: "string",
    symbol: Symbol("symbol")
};