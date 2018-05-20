var assert = require('assert');
var child = require('child_process');
var fs = require('fs');
var expect; 
    expect = ["FROM centos7",
              "LABEL example",
              "RUN yum install -y sudo wget telnet openssh-server vim git ncurses-term",
              'RUN echo "common"', '',
              'COPY include_tmp/files/aa.sh /var/tmp/',
              '','','COPY include_tmp/conf/php.ini /etc/',
              "",
             ].join("\n");

describe("Test include of Dockerfile", function() {//{{{
    var content;
    before(function (done) {
        child.exec("node ../../index.js -i data/Dockerfile1", function (err, res) {
            content = res;
            done();
        });
    }); 
    it("normal case", function() {
        assert.equal(expect + "\n", content);
    }); 
});//}}}

describe("Test output", function() {//{{{
    var content;
    before(function (done) {
        child.exec("node ../../index.js -i data/Dockerfile1 -o tmp", function (err, res) {
            content = fs.readFileSync('tmp', 'UTF-8');
            fs.unlink('tmp');
            done();
        });
    }); 
    it("normal case", function() {
        assert.equal(expect, content);
    }); 
});//}}}

describe("Test not copy the same file", function() {//{{{
    var content, time1, time2;
    before(function (done) {
        if (fs.existsSync("data/include_tmp/conf/bb.txt")) {
            fs.unlink("data/include_tmp/conf/bb.txt");
        }
        child.exec("node ../../index.js -i data/Dockerfile2 -o tmp2", function (err, res) {
            content = fs.readFileSync('tmp2', 'UTF-8');
            fs.unlink('tmp2');
            fs.stat('data/include_tmp/conf/bb.txt', function (err, s) {
                time1 = s.mtime;
            });
            child.exec("node ../../index.js -i data/Dockerfile2 -o tmp2", function (err, res) {
                content = fs.readFileSync('tmp2', 'UTF-8');
                fs.unlink('tmp2');
                fs.stat('data/include_tmp/conf/bb.txt', function (err, s) {
                    time2 = s.mtime;
                    done();
                });
            });
        });
    }); 
    it("normal case", function() {
        assert.equal(time1.toString(), time2.toString());
    }); 
});//}}}

