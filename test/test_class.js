var util = require('util');
var assert = require('assert');
var nodeunit = require('nodeunit');
var clc = require('cli-color');

var defineInterface = require('../lib/defineInterface.js');
var defineClass = require('../lib/defineClass.js');

//should do this before handle
module.exports = exports = {
	setUp: function(callback) {
		callback();
	},
	tearDown: function(callback) {
		defineInterface.reset();
		defineClass.reset();
		callback();
	}
};

exports.testDefineStatic = function(test){
	
	try{
	
		var DummyClass = defineClass({
			statics : {
				STATIC_VAR : "value",
				STATIC_FUNC : function(){
					console.log("func");
				}
			}
		});
			
		DummyClass.STATIC_FUNC();
		test.ok(DummyClass.STATIC_VAR == "value");
		var obj = new DummyClass();
		
	}
	catch(e){
		console.log(clc.red(util.inspect(e)));
		test.ok(false);
	}
	
	test.done();
}


exports.testDefineInterface = function(test) {
	test.expect(1);
	try {
		var MyBaseInterface = defineInterface({
			name: "MyBaseInterface",
			methods: {
				foo: function() {}
			},
			variables: {
				NAME: "dennycd"
			}
		});
		var MyBaseInterface2 = defineInterface({
			name: "MyBaseInterface2",
			methods: {
				bar: function() {}
			},
			variables: {
				NAME: "chosenone"
			}
		});
		var MyInterface = defineInterface({
			name: "MyInterface",
			extend: [MyBaseInterface, MyBaseInterface2],
			methods: {
				extra: function() {}
			},
			variables: {
				NAME: "dennycd"
			}
		});
		try {
			var interfaceObj = new MyInterface();
		} catch (e) {
			console.log(clc.blue(util.inspect(e)));
			test.ok(true);
		}
	} catch (e) {
		console.log(clc.red(util.inspect(e)));
		test.ok(false);
	}
	test.done();
};

exports.testInterfaceInheritance = function(test) {
	try {
		var MyBaseInterface = defineInterface({
			name: "MyBaseInterface",
			methods: {
				foo: function() {}
			},
			variables: {
				NAME: "dennycd"
			}
		});
		console.log(clc.blue(MyBaseInterface.__class.toString()));
	} catch (e) {
		console.log(clc.red(util.inspect(e)));
		test.ok(false);
	}
	test.done();
};

exports.testDefineClass = function(test) {
	try {
		
		var MyBaseClass = defineClass({
			name : "MyBaseClass",
			construct : function(){
				console.log(clc.yellow("MyBaseClass::Construct"));	
			},
			methods : {
				basefoo : function(){console.log("basefoo");}
			},
			variables : {
				name : "basefoo"
			}
		});


		var MyClass = defineClass({
			name : "MyClass",
			extend : MyBaseClass,
			construct : function(){
				console.log(clc.yellow("MyClass::Construct"));	
			},
			methods : {
				myfoo : function(){console.log("myfoo");}
			}
		});
		
		
		var obj = new MyClass();
				
		test.ok(Object.getPrototypeOf(obj) === obj.constructor.prototype);
		test.ok(Object.getPrototypeOf(obj).constructor === MyClass);
		test.ok(Object.getPrototypeOf(obj.constructor.prototype).constructor === MyBaseClass);		
		
		var objproto = Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(obj)));
		test.ok(objproto != null);
		test.ok(objproto === Object.prototype);			
		test.ok( Object.getPrototypeOf(objproto) == null);
		
		
		test.ok(obj.name == "basefoo");
		test.ok(obj.basefoo && typeof(obj.basefoo)=="function");
		test.ok(obj.myfoo && typeof(obj.myfoo)=="function");
		
		
	} catch (e) {
		console.log(clc.red(util.inspect(e)));
		test.ok(false);
	}
	test.done();
};




exports.testDynamicFunctionCreation = function(test){


	var origin = function(name,value){
		console.log(name + " = " + value);	
	};

	var newfunc = Function.apply(this, ["x","y", "return x+y;"]);	
	test.ok(newfunc.length == origin.length);
	test.ok(typeof(newfunc)=="function");
	test.ok(newfunc(1,2)==3);


	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	var args = new Array(origin.length+1);
	for(var i=0;i<origin.length;i++) args[i] = str.charAt(i); //mock argument name "A", "B", "C" ...
	args[origin.length]= "throw new Error(\"abstract method invocation not allowed\");";
	
	newfunc = Function.apply(this, args);
	test.ok(args.length == origin.length+1);	
	test.ok(newfunc.length == origin.length, "newfunc has " + newfunc.length + " origin has "+ origin.length );
	test.ok(typeof(newfunc)=="function");	
	
	try{
		newfunc("denny", "cd");
		test.ok(false);
	}
	catch(e){
		console.log(clc.blue(util.inspect(e)));
	}

	test.done();
};




exports.testGetInterfaceMethods = function(test){
	try{
			
		var MyBaseInterface = defineInterface({
			name: "MyBaseInterface",
			methods: {
				basefoo: function() {},
				basefoo2 : function(){}
			}
		});
		
		var MyAnotherBaseInterface = defineInterface({
			name: "MyAnotherBaseInterface",
			methods: {
				anotherfoo: function() {} 
			}
		});		
		
		
		var MyInterface = defineInterface({
			name: "MyInterface",
			extend : [MyBaseInterface, MyAnotherBaseInterface],
			methods : {
				myfoo : function(){}
			}
		});
	

		var methods = MyInterface.__class.getMethods(); 
		test.ok(methods && methods.length == 4);		
		
	}catch(e){
		console.log(clc.red(util.inspect(e)));
		test.ok(false);
	}
	
			test.done();		
};	



exports.testGetClassMethods = function(test){
	try{
			
		var MyBaseInterface = defineInterface({
			name: "MyBaseInterface",
			methods: {
				basefoo: function() {},
				basefoo2 : function(){}
			}
		});
		
		var MyBaseClass = defineClass({
			name: "MyBaseClass",
			methods: {
				anotherfoo: function() {} 
			}
		});		
		
		
		var MyClass = defineClass({
			name: "MyClass",
			extend : MyBaseClass,
			implement : MyBaseInterface,
			methods : {
				myfoo : function(){}
			}
		});
	

		var methods = MyClass.__class.getMethods(); 
		test.ok(methods && methods.length == 4);		
		
		
	}catch(e){
		console.log(clc.red(util.inspect(e)));
		test.ok(false);
	}
	
			test.done();		
};	


exports.testClassHierarchySingletoness = function(test){

	
	var MyBaseClass = defineClass({
		name: "MyBaseClass",
		methods: {
			foo: function() {} 
		}
	});	
		

	var MySubClassA = defineClass({
		name: "MySubClassA",
		extend : MyBaseClass,
		methods: {
			foo: function() {} 
		}
	});			


	var MySubClassB = defineClass({
		name: "MySubClassB",
		extend : MyBaseClass,
		methods: {
			foo: function() {} 
		}
	});		
	
	
	var obja = new MySubClassA();
	var objb = new MySubClassB();
	
	//should not be the same
	test.ok(Object.getPrototypeOf(obja) !== Object.getPrototypeOf(objb));
	
	//should be the prototype obj within the base class domain
	test.ok(Object.getPrototypeOf(Object.getPrototypeOf(obja)) === Object.getPrototypeOf(Object.getPrototypeOf(objb)));
	
	
	test.ok(Object.getPrototypeOf(obja).constructor === MySubClassA);	
	test.ok(Object.getPrototypeOf(objb).constructor === MySubClassB);	
	
	//constructor should always be pointing to the same thing
	test.ok(Object.getPrototypeOf(Object.getPrototypeOf(obja)).constructor === Object.getPrototypeOf(Object.getPrototypeOf(objb)).constructor);	
	test.ok(Object.getPrototypeOf(Object.getPrototypeOf(obja)).constructor === MyBaseClass);


	//Class obj uniqueness
	test.ok(Object.getPrototypeOf(Object.getPrototypeOf(obja)).constructor.__class === Object.getPrototypeOf(Object.getPrototypeOf(objb)).constructor.__class);	
	test.ok(Object.getPrototypeOf(Object.getPrototypeOf(obja)).constructor.__class != null);

	test.done();
};


exports.testInheritanceCheck = function(test){

	var BaseInterface = defineInterface({
		name : "BaseInterface"
	});

	var MyBaseInterface = defineInterface({
		name : "MyBaseInterface",
		extend : [BaseInterface]
	});

	var MyBaseClass = defineClass({
		name: "MyBaseClass",
		implement : [MyBaseInterface],
		methods: {
			foo: function() {} 
		}
	});	
		

	var MySubClassA = defineClass({
		name: "MySubClassA",
		extend : MyBaseClass,
		methods: {
			foo: function() {} 
		}
	});			


	var MySubClassB = defineClass({
		name: "MySubClassB",
		extend : MyBaseClass,
		methods: {
			foo: function() {} 
		}
	});	
	
	test.ok(BaseInterface.__class.isAssignableFrom(MyBaseInterface.__class) == true);
	test.ok(BaseInterface.__class.isAssignableFrom(MyBaseClass.__class) == true);
	test.ok(BaseInterface.__class.isAssignableFrom(MySubClassB.__class) == true);
	test.ok(MyBaseClass.__class.isAssignableFrom(MySubClassA.__class) == true);
	test.ok(MyBaseClass.__class.isAssignableFrom(MySubClassB.__class) == true);
	test.ok(MySubClassB.__class.isAssignableFrom(Object) == false);
	test.ok(MySubClassB.__class.isAssignableFrom(null) == false);


	test.ok(MySubClassB.__class.isKindOfClass(MyBaseClass.__class)==true);
	test.ok(MySubClassB.__class.isKindOfClass(MyBaseInterface.__class)==true);
	test.ok(MySubClassB.__class.isKindOfClass(BaseInterface.__class)==true);
	test.ok(MySubClassB.__class.isKindOfClass(Object)==true);

	test.ok(MySubClassB.__class.isKindOfClass(Array)==false);
	test.ok(MySubClassB.__class.isKindOfClass(null)==false);
	
	
	test.ok(MySubClassB.__class.isKindOfClass('MyBaseClass')==true);
	test.ok(MySubClassB.__class.isKindOfClass('MyBaseInterface')==true);
	test.ok(MySubClassB.__class.isKindOfClass('BaseInterface')==true);
	
	
	test.done();
}



