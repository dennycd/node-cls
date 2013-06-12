# Simple Javascript Class System for Node.js 

node-cls is a simple class system that adds a number of object-oriented features to the basic javascript language, including
* convinient class definition with inheritance
* abstract class / interface support
* runtime introspection with dynamic type checking

The design goal is to provide a clean and easily understandable class system while minimizing overhead and avoid poluting the javascript built-in objects. It is inspired and built upon the defineClass from [JavaScript The Definitive Guide](http://shop.oreilly.com/product/9780596805531.do). 

## Usage

Install the package "simple-cls"
```javascript
npm install simple-cls
```
To define a class, do the following 
```javascript
var cls = require('simple-cls')

var MyClass = cls.defineClass({
	name : "MyClass",
	//constructor code
	construct : function(){
		
	}, 
	//instance methods
	methods: {  
		foo: function() {
			console.log("foo");
		}
	},
	//instance variables
	variables: {
		bar : 1
	},
	// class level variables or methods
	statics : {
		
	}
});

```javascript




![Concept](https://raw.github.com/dennycd/node-cls/master/doc/node-cls.001.png "Concept")