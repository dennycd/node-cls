# Simple Javascript Class System for Node.js 

node-cls is a simple class system that adds a number of object-oriented features to the basic javascript language, including
* convinient class definition with inheritance
* abstract class a.k.a. interface support
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
	//optional class name 
	name : "MyClass",
	//optional super class, default is Object
	extend : BaseClass,
	//constructor code
	construct : function(msg){
		this.msg = msg;
	}, 
	//instance methods
	methods: {  
		foo: function() {
			console.log("foo");
		}
	},
	//instance variables
	variables: {
		bar : 1,
		msg : null
	},
	// class level variables or methods
	statics : {
		
	}
});
```

To instantiate an object and start using it  
```javascript
var obj = new MyClass("hello");
obj.foo();
console.log(obj.bar);
```


## Concept

![Concept](https://raw.github.com/dennycd/node-cls/master/doc/node-cls.001.png "Concept")


in node-cls, the class system is built upon a chain of triple objects, namely the  **Prototype**, **Constructor** and **Class**. As the diagram shows, instantiating a new js object will establish a relationship from the bottom up, starting at the object instance. Using javascript's built-in function we can obtain the prototype of that object.
```javascript
assert.ok(Object.getPrototypeOf(obj) === MyClass.prototype);)
```
The prototype object itself is an object instance of the superclass of MyClass. If no superclass is given, it is defaulted to `Object`. `MyClass` is an alias of the **Constructor** function for obj
```javascript 
assert.ok(obj.constructor === MyClass)
``` 

The **Class** object contains runtime information about the obj class and can be obtained via `__class` on the constructor or `.getClass()` methods 
```javascript
assert.ok(obj.constructor.__class === obj.getClass())
```

To check if a js object is an instance of a class, or an instance of a subclass of some super classes 
```javascript
test.ok(obj.getClass().isKindOfClass('MyClass'));
test.ok(obj.getClass().isKindOfClass('BaseClass'));
test.ok(obj.getClass().isKindOfClass(MyClass.__class));
test.ok(obj.getClass().isKindOfClass(BaseClass.__class));
```

To look at all the methods callable from the obj, including methods defined on the super class
```javascript 
console.log(obj.getClass().getMethods());
```

For details, please look at the unit test examples. 



## Author 
Denny C. Dai <dennycd@me.com> or visit <http://dennycd.me>

## License 
The MIT License (MIT)

Copyright (c) 2013 Denny C. Dai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.