/*
 * @Author: liubin
 * @Date: 2022-03-03 16:06:26
 * @LastEditors: liubin
 * @LastEditTime: 2022-03-04 15:52:54
 */
const fs = require('fs')
const readline = require('readline');
let dir = './dist/part/'
//要分割的文件
let file = './dist/main.dart.js'
async function writeInFile(arr) {
    //定义分割后每个文件的行数
    const rows = 25000
    const len = Math.ceil(arr.length / rows)
    for (var i = 0; i < len; i++) {
        console.log(dir + i + '.txt');
        fs.writeFile(
            dir + i + '.txt',
            // arr.slice(i * rows, i * rows + rows).join(''),
            arr.slice(i * rows, i * rows + rows).join('\r\n'),
            () => { }
        )

        if (i === len - 1) {
            console.log('分包完成，感谢使用！！！');
        }
    }
}
function splitFile(fileName = 'dist') {
    // 根据数据的文件夹名重新定义路径
    dir = dir.replace('dist', fileName);
    file = file.replace('dist', fileName);
    if(!fs.existsSync(fileName)) {
        console.warn(`${fileName}文件夹路径不存在`);
        return;
    }
    if(!fs.existsSync(file)) {
        console.error(`${file}文件路径不存在`)
        return;
    }
    //存储每行数据
    const arr = []
    const readstream = fs.createReadStream(file);
    readstream.on('error', (err) => {
        console.log(err.message, 'err---------');
        return;
    })

    const lineRead = readline.createInterface({
        input: readstream
    })
    //开始逐行读取
    lineRead.on('line', function (data) {
        //   console.log('1111111111111');
        arr.push(data)
    }).on('close', async function () {
        console.log('数据读取完毕，开始写入分包文件');
        // 判断是否有part文件夹
        if (!fs.existsSync(dir)) {
            await fs.mkdir(dir, () => {
                // console.log(`创建${dir}成功文件夹`);
            });
        }
        writeInFile(arr)
    })
}

module.exports = splitFile