var util = require('util');
var assert = require('assert');
var uuid = require('node-uuid').v4;

var TYPE = require('./Type.js');
var Class = require('./Class.js');
var counter = {};
/**

 An interface definition
 an interface is a group of related methods with no concrete implementations
 An interface can contain constant declarations in addition to method declarations.
 
 var myInterface = defineInterface({
 	name : "myInterface",
 	extend : [superinterface1, superinterface2]  
 	methods : {
 		method1 : function(arg1, arg2){},
 		method2 : function(){}
 	},
 	variables : {
 		var1 : xx
 	}
 });
 
 
 REFERENCE  http://docs.oracle.com/javase/tutorial/java/IandI/interfaceDef.html
 
 @def - definition
**/
var defineInterface = function(def){
	if(!def.name) def.name = uuid(); //anonymous class name if omitted
	assert(def.name && typeof(def.name=="string"));
	assert(!counter[def.name], "class " + def.name + " has multiple definition calls!!"); 
	counter[def.name] = 1;
	if(!def.extend) def.extend = [];
	else if(!(def.extend instanceof Array)) def.extend = [def.extend];
	if(!def.methods) def.methods = {};
	if(!def.variables) def.variables = {};
	assert(def.methods instanceof Object);
	assert(def.variables instanceof Object);

	//the interface class's constructor
	//prevent interface from instanciation
	//if user do this 
	//    var obj = new MyInterface()  will throw the error  
	var constructor = function(){throw new Error("cannot instanciate an interface!");};

	//an interface class object simply inherits from object
	var proto = new Object();
	
	//bidirectional link between prototype obj and constructor 
	proto.constructor = constructor;
	constructor.prototype = proto;
	
		
	//Interface Methods are defined on Prototype object
	for(var p in def.methods){
		var method = def.methods[p];
		if(typeof(method)!="function") throw Error("invalid interface method definition: method="+p + " for interface " + def.name);
		proto[p] = method;
	}
	
	
	//Interface variables are class-level statics defined on the constructor 
	for(var p in def.variables){
		var variable = def.variables[p];
		if(typeof(variable)=="function") throw Error("invalid interface constant definition: variable="+p + " for interface " + def.name);
		constructor[p] = variable;
	}

	//A constructor has a reserved word "__class" that points to a Class object that describes this interface
	constructor.__class = new Class(TYPE.INTERFACE, constructor, def);
	
	//enable user to find the Class object from the object instance of an interface
	proto.getClass = function(){return constructor.__class;};
	
	return constructor;
};

defineInterface.reset = function(){ counter = {}; }
module.exports = exports = defineInterface;