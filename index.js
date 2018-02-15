var fs = require('fs');
var param = require('commander');
var fsExtra = require('fs-extra')

param.version('0.0.1')
    .option('-d, --debug [string]', 'enable debug or not', true)
    .option('-i, --input [stting]', 'Dockerfile', '')
    .option('-o, --output [stting]', 'output file', '')
    .parse(process.argv);

if (param.debug === "true") console.log('Enable debug');
if (!param.input) return console.error('Missing Dockerfile: -i Dockerfile');

if (!fs.existsSync(param.input)) {
    console.error("File ", param.input, " is not exist.");
    process.exit(1);
}

var c = fs.readFileSync(param.input, 'UTF-8');

var inputDirPath;
inputDirPath = require('path').dirname(param.input);

c = handle(inputDirPath, c);
if (!param.output) {
    console.log(c);
} else {
    fs.writeFileSync(param.output, c);
}




function handle(pwd, c) {
    var reg;
    // Remove comments
    reg = /(^|[\n\r]+)#([^\n\r]+)/g;
    c = c.replace(reg, '');

    reg = /(^|[\n\r]+)COPY[\s]+([^\s]+)/gi;
    c = c.replace(reg, handleCopy.bind(null,pwd));
    reg = /(^|[\n\r]+)INCLUDE[\s]+([^\n\r]+)/gi;
    c = c.replace(reg, handleInclude.bind(null, pwd));

    return c;
}

function handleInclude(pwd, matStr, br, file) {
    var pwd2, filePath;
    if (file.indexOf('/') == 0) {
        filePath = file;
    } else {
        filePath = pwd + "/" + file;
    } 
    if (!fs.existsSync(filePath)) {
        console.error("File ", filePath, " is not exist.");
        process.exit(1);
    }
    var c = fs.readFileSync(filePath, 'UTF-8');
    pwd2 = require('path').dirname(filePath); 
    c = handle(pwd2, c);
    return br+c;
}


function handleCopy(pwd, matStr, br, file) {
    var orgPath, retPath, dir, filename;
    if (file.indexOf('/') == 0) {
        filePath = file;
    } else {
        filePath = pwd + "/" + file;
    }
    retPath = inputDirPath+'/include_tmp/';
    dir = require('path').dirname(file);
    filename = require('path').basename(file);
    if (!dir) dir = "tmp";
    dir = dir.replace(/[\.\/\\]/g, '_');
    fsExtra.mkdirsSync('include_tmp/' + dir);
    fsExtra.copySync(filePath, retPath + dir + "/" + filename);
    return br + "COPY include_tmp/" + dir + "/" + filename;
}


