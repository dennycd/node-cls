var util = require('util');
var assert = require('assert');
var nodeunit = require('nodeunit');
var clc = require('cli-color');
var cls = require('simple-cls');

//should do this before handle
module.exports = exports = {
	setUp: function(callback) {
		callback();
	},
	tearDown: function(callback) {
		callback();
	}
};

exports.testRelease = function(test){

	test.expect(2);
	
	test.ok(typeof(cls)=="object");
	test.ok(typeof(cls.defineClass)=="function")

	test.done();
}