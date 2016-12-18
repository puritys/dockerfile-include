var assert = require('assert');
var child = require('child_process');
var fs = require('fs');

describe("Test include of Dockerfile", function() {//{{{
    var content;
    before(function (done) {
        child.exec("node ../../index.js -i data/Dockerfile1", function (err, res) {
            content = res;
            done();
        });
    }); 
    it("normal case", function() {
        var expect;
        expect = ["FROM centos7",
                  "LABEL example",
                  "RUN yum install -y sudo wget telnet openssh-server vim git ncurses-term",
                  'RUN echo "common"', '',
                  'COPY data/include_tmp/data/inc/files/aa.sh /var/tmp/',
                  "","","",""
                 ].join("\n");
        assert.equal(expect, content);
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
        var expect;
        expect = ['FROM centos7',
                  'LABEL example',
                  'RUN yum install -y sudo wget telnet openssh-server vim git ncurses-term',
                  'RUN echo "common"',
                  'COPY files/aa.sh /var/tmp/',
                  '\n\n'
                 ].join("\n");
        assert.equal(expect, content);
    }); 
});//}}}


