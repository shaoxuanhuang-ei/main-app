const path = require("path");
const json = require("@rollup/plugin-json");
const { babel } = require("@rollup/plugin-babel");
const resolveFile = function (filePath) { // 接收文件路径，返回该路径与当前文件所在目录的绝对路径
    return path.join(__dirname, filePath);
};
const plugins = [
    json({
        compact: true, // 压缩格式，生成的JSON模块将没有空格
    }),
    babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
        presets: [
            [
                "@babel/env",
                {
                    targets: {
                        browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
                    },
                },
            ],
        ],
    }),
];
module.exports = [
    {
        plugins,
        input: resolveFile("../src/webEyeSDK.js"),
        output: {
            file: resolveFile("../dist/monitor.js"),
            format: "iife",
            name: "monitor",
            sourcemap: true,
        },
    },
    {
        plugins,
        input: resolveFile("../src/webEyeSDK.js"),
        output: {
            file: resolveFile("../dist/monitor.esm.js"),
            format: "esm",
            name: "monitor",
            sourcemap: true,
        },
    },
    {
        plugins,
        input: resolveFile("../src/webEyeSDK.js"),
        output: {
            file: resolveFile("../dist/monitor.cjs.js"),
            format: "cjs",
            name: "monitor",
            sourcemap: true,
        },
    },
];
