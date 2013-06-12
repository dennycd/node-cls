var util = require('util');
var assert = require('assert');
var clc = require('cli-color');
var uuid = require('node-uuid').v4;
var TYPE = require('./Type.js');
var Class = require('./Class.js');

//avoid class name clashing by trakcing class name def counts
//should only be 1 for each running node instance
var counter = {};

/**
	Usage Example: 
	
	var MyClass = defineClass({
		name : "MyClass",
		extend : MyBaseClass,
		implement : [BaseInterface, BaseInterface2, ...], 
		statics : {},
		variables : {}, 
		methods : {}
	});
 
 @def - definition 	
**/
var defineClass = function(def){
	if(!def.name) def.name = uuid(); //anonymous class name if omitted
	assert(def.name && typeof(def.name=="string"));
	//console.log(clc.blue("defining " + def.name));
	assert(!counter[def.name], "class " + def.name + " has multiple definition calls!!"); 
	counter[def.name] = 1;
	if(!def.extend) def.extend = Object;
	assert(!(def.extend instanceof Array));	
	if(!def.implement) def.implement = [];
	if(!(def.implement instanceof Array)) def.implement = [def.implement];
	if(!def.methods) def.methods = {};
	if(!def.variables) def.variables = {};
	if(!def.statics) def.statics = {};
	assert(def.methods instanceof Object);
	assert(def.variables instanceof Object);
	assert(def.statics instanceof Object);

	//default constructor will chain up calls to superclass' constructor passing all parameters
	if(!def.construct) def.construct = function(){
		def.extend.apply(this,arguments);
	};
	assert(typeof(def.construct)=="function");
	
	//constructor function
	var constructor = function(){
		//Variables are defined on each object instance, therefore only can
		//be done inside the constructor where "this" refers to the newly created object	
		for(var p in def.variables){
			var variable = def.variables[p];
			if(typeof(variable)=="function") throw Error("invalid interface constant definition: variable="+p + " for interface " + def.name);
			this[p] = variable;
		}
		
		//chain up invocation to user-defined constructor
		def.construct.apply(this,arguments); 
	};

	
	// proototype object is an instance of the super class type
	try{
		var proto = new def.extend();
	}catch(e){
		//console.log(clc.red(e.toString()));
		throw new Error("error creating prototype object");
	}
	console.log(clc.green("success " + def.name));


	//bidirectional link between constructor function and prototype
	proto.constructor = constructor;
	constructor.prototype = proto; 
	
	//user-defined methods are defined on the prototype object
	for(var p in def.methods){
		var method = def.methods[p];
		if(typeof(method)!="function") throw Error("invalid method definition: method="+p + " for class " + def.name);
		proto[p] = method;	
	}
	
	//static methods are defined on the constructor function object 
	for(var p in def.statics){
		var method = def.statics[p];
		if(typeof(method)!="function") throw Error("invalid static method definition: method="+p + " for class " + def.name);
		constructor[p] = method;
	}

	//A constructor has a reserved word "__class" that points to a Class object that describes this interface
	constructor.__class = new Class(TYPE.CLASS, constructor, def);
	
	//convinient method allowing user to obtain the Class object from an object instance
	proto.getClass = function(){return constructor.__class;};
	
	return constructor;	
};


defineClass.reset = function(){counter = {};}
module.exports = exports = defineClass;