var assert = require('assert');
var child = require('child_process');
var fs = require('fs');
var expect; 
    expect = ["FROM centos7",
              "LABEL example",
              "RUN yum install -y sudo wget telnet openssh-server vim git ncurses-term",
              'RUN echo "common"', '',
              'COPY include_tmp/files_aa.sh /var/tmp/',
              '','','COPY include_tmp/conf_php.ini /etc/',
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


