var fs = require('fs');
var param = require('commander');
var copy = require('copy');
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
    reg = /COPY[\s]+([^\s]+)/gi;
    c = c.replace(reg, handleCopy.bind(null,pwd));
    reg = /INCLUDE[\s]+([^\n\r]+)/gi;
    c = c.replace(reg, handleInclude.bind(null, pwd));
    return c;
}

function handleInclude(pwd, matStr, file) {
    var pwd2;
    if (!fs.existsSync(pwd+"/"+file)) {
        console.error("File ", pwd+"/"+file, " is not exist.");
        process.exit(1);
    }
    var c = fs.readFileSync(pwd+"/"+file, 'UTF-8');
    pwd2 = require('path').dirname(pwd+"/"+file); 
    c = handle(pwd2, c);
    return c;
}


function handleCopy(pwd, matStr, file) {
    var orgPath, retPath;
    filePath = pwd + "/" + file;
    retPath = inputDirPath+'/include_tmp/';
    copy(filePath, retPath, function(err) {
        if (err) console.log(err);
    });
    return "COPY include_tmp/" + filePath;
}


