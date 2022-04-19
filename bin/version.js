#! /usr/bin/env node
/*
 * @Author: liubin
 * @Date: 2022-03-03 15:03:01
 * @LastEditors: liubin
 * @LastEditTime: 2022-03-04 15:50:59
 */
const splitFile = require('./split');


// 压缩文件
async function split(fileName) {
    console.log("这位哥老官想分包文件...");
    splitFile(fileName)
}

const { program } = require('commander');

program
    .version('0.0.1', '-v,--version')
    // 接受外部传来的参数
    .arguments('[cmd] [env]')
    // 对这个命令行的整体描述
    .description("你好 AntBin")
    // 这是一个命令参数，如果有这个参数，则表示要启动
    // -s 就执行split函数
    .option('-s, --split', '执行打包')
    .action(function (cmd = 'dist', env) {
        const args = program.opts();
        cmdValue = cmd;
        envValue = env;

        console.log("你的命令已经接收到...", cmdValue);
        if (typeof cmd === 'string' && args.split) {
            split(cmdValue)
        } else {
            console.log('请确认输入指令');
        }
    })
    .parse(process.argv);

