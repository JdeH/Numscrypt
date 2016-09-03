"use strict";
// Transcrypt'ed from Python, 2016-09-03 17:12:56
function test () {
	var __all__ = {};
	var __world__ = __all__;
	
	// Nested object creator, part of the nesting may already exist and have attributes
	var __nest__ = function (headObject, tailNames, value) {
		// In some cases this will be a global object, e.g. 'window'
		var current = headObject;
		
		if (tailNames != '') {	// Split on empty string doesn't give empty list
			// Find the last already created object in tailNames
			var tailChain = tailNames.split ('.');
			var firstNewIndex = tailChain.length;
			for (var index = 0; index < tailChain.length; index++) {
				if (!current.hasOwnProperty (tailChain [index])) {
					firstNewIndex = index;
					break;
				}
				current = current [tailChain [index]];
			}
			
			// Create the rest of the objects, if any
			for (var index = firstNewIndex; index < tailChain.length; index++) {
				current [tailChain [index]] = {};
				current = current [tailChain [index]];
			}
		}
		
		// Insert it new attributes, it may have been created earlier and have other attributes
		for (var attrib in value) {
			current [attrib] = value [attrib];			
		}		
	};
	__all__.__nest__ = __nest__;
	
	// Initialize module if not yet done and return its globals
	var __init__ = function (module) {
		if (!module.__inited__) {
			module.__all__.__init__ (module.__all__);
			module.__inited__ = true;
		}
		return module.__all__;
	};
	__all__.__init__ = __init__;
	
	// Since we want to assign functions, a = b.f should make b.f produce a bound function
	// So __get__ should be called by a property rather then a function
	// Factory __get__ creates one of three curried functions for func
	// Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
	var __get__ = function (self, func, quotedFuncName) {
		if (self) {
			if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {			// Object before the dot
				if (quotedFuncName) {									// Memoize call since fcall is on, by installing bound function in instance
					Object.defineProperty (self, quotedFuncName, {		// Will override the non-own property, next time it will be called directly
						value: function () {							// So next time just call curry function that calls function
							var args = [] .slice.apply (arguments);
							return func.apply (null, [self] .concat (args));
						},				
						writable: true,
						enumerable: true,
						configurable: true
					});
				}
				return function () {									// Return bound function, code dupplication for efficiency if no memoizing
					var args = [] .slice.apply (arguments);				// So multilayer search prototype, apply __get__, call curry func that calls func
					return func.apply (null, [self] .concat (args));
				};
			}
			else {														// Class before the dot
				return func;											// Return static method
			}
		}
		else {															// Nothing before the dot
			return func;												// Return free function
		}
	}
	__all__.__get__ = __get__;
			
	// Class creator function
	var __class__ = function (name, bases, extra) {
		// Create class functor
		var cls = function () {
			var args = [] .slice.apply (arguments);
			return cls.__new__ (args);
		};
		
		// Copy methods, properties and static attributes from base classes to new class object
		for (var index = bases.length - 1; index >= 0; index--) {	// Reversed order, since class vars of first base should win
			var base = bases [index];
			for (var attrib in base) {
				var descrip = Object.getOwnPropertyDescriptor (base, attrib);
				Object.defineProperty (cls, attrib, descrip);
			}
		}
		
		// Add class specific attributes to class object
		cls.__name__ = name;
		cls.__bases__ = bases;
		
		// Add own methods, properties and static attributes to class object
		for (var attrib in extra) {
			var descrip = Object.getOwnPropertyDescriptor (extra, attrib);
			Object.defineProperty (cls, attrib, descrip);
		}
				
		// Return class object
		return cls;
	};
	__all__.__class__ = __class__;
	
	// Create mother of all classes		
	var object = __all__.__class__ ('object', [], {
		__init__: function (self) {},
			
		__name__: 'object',
		__bases__: [],
			
		// Object creator function is inherited by all classes (so in principle it could be made global)
		__new__: function (args) {	// Args are just the constructor args		
			// In JavaScript the Python class is the prototype of the Python object
			// In this way methods and static attributes will be available both with a class and an object before the dot
			// The descriptor produced by __get__ will return the right method flavor
			var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
			
			// Call constructor
			this.__init__.apply (null, [instance] .concat (args));
			
			// Return instance			
			return instance;
		}	
	});
	__all__.object = object;
	
	// Define __pragma__ to preserve '<all>' and '</all>', since it's never generated as a function, must be done early, so here
	var __pragma__ = function () {};
	__all__.__pragma__ = __pragma__;
	__nest__ (
		__all__,
		'org.transcrypt.__base__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __Envir__ = __class__ ('__Envir__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.transpiler_name = 'transcrypt';
							self.transpiler_version = '3.5.218';
							self.target_subdir = '__javascript__';
						}, '__init__');}
					});
					var __envir__ = __Envir__ ();
					__pragma__ ('<all>')
						__all__.__Envir__ = __Envir__;
						__all__.__envir__ = __envir__;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'org.transcrypt.__standard__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Exception = __class__ ('Exception', [object], {
						get __init__ () {return __get__ (this, function (self) {
							var args = tuple ([].slice.apply (arguments).slice (1));
							self.args = args;
						}, '__init__');},
						get __repr__ () {return __get__ (this, function (self) {
							if (len (self.args)) {
								return '{}{}'.format (self.__class__.__name__, repr (tuple (self.args)));
							}
							else {
								return '{}()'.format (self.__class__.__name__);
							}
						}, '__repr__');},
						get __str__ () {return __get__ (this, function (self) {
							if (len (self.args) > 1) {
								return str (tuple (self.args));
							}
							else {
								if (len (self.args)) {
									return str (self.args [0]);
								}
								else {
									return '';
								}
							}
						}, '__str__');}
					});
					var StopIteration = __class__ ('StopIteration', [object], {
						get __init__ () {return __get__ (this, function (self) {
							Exception.__init__ (self, 'Iterator exhausted');
						}, '__init__');}
					});
					var ValueError = __class__ ('ValueError', [Exception], {
					});
					var AssertionError = __class__ ('AssertionError', [Exception], {
					});
					var __sort__ = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .__class__ == __kwargdict__)) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .__class__ == __kwargdict__)) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (key) {
							iterable.sort ((function __lambda__ (a, b) {
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												case 'a': var a = __allkwargs0__ [__attrib0__]; break;
												case 'b': var b = __allkwargs0__ [__attrib0__]; break;
											}
										}
									}
								}
								else {
								}
								return key (a) > key (b);
							}));
						}
						else {
							iterable.sort ();
						}
						if (reverse) {
							iterable.reverse ();
						}
					};
					var sorted = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .__class__ == __kwargdict__)) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .__class__ == __kwargdict__)) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (type (iterable) == dict) {
							var result = copy (iterable.keys ());
						}
						else {
							var result = copy (iterable);
						}
						__sort__ (result, key, reverse);
						return result;
					};
					var map = function (func, iterable) {
						return function () {
							var __accu0__ = [];
							var __iterator0__ = py_iter (iterable);
							while (true) {
								try {var item = py_next (__iterator0__);} catch (exception) {break;}
								__accu0__.append (func (item));
							}
							return __accu0__;
						} ();
					};
					var filter = function (func, iterable) {
						return function () {
							var __accu0__ = [];
							var __iterator0__ = py_iter (iterable);
							while (true) {
								try {var item = py_next (__iterator0__);} catch (exception) {break;}
								if (func (item)) {
									__accu0__.append (item);
								}
							}
							return __accu0__;
						} ();
					};
					var complex = __class__ ('complex', [object], {
						get __init__ () {return __get__ (this, function (self, real, imag) {
							if (typeof imag == 'undefined' || (imag != null && imag .__class__ == __kwargdict__)) {;
								var imag = null;
							};
							if (imag == null) {
								if (type (real) == complex) {
									self.real = real.real;
									self.imag = real.imag;
								}
								else {
									self.real = real;
									self.imag = 0;
								}
							}
							else {
								self.real = real;
								self.imag = imag;
							}
						}, '__init__');},
						get __neg__ () {return __get__ (this, function (self) {
							return complex (-(self.real), -(self.imag));
						}, '__neg__');},
						get __exp__ () {return __get__ (this, function (self) {
							var modulus = Math.exp (self.real);
							return complex (modulus * Math.cos (self.imag), modulus * Math.sin (self.imag));
						}, '__exp__');},
						get __log__ () {return __get__ (this, function (self) {
							return complex (Math.log (Math.sqrt (self.real * self.real + self.imag * self.imag)), Math.atan2 (self.imag, self.real));
						}, '__log__');},
						get __pow__ () {return __get__ (this, function (self, other) {
							return self.__log__ ().__mul__ (other).__exp__ ();
						}, '__pow__');},
						get __rpow__ () {return __get__ (this, function (self, real) {
							return self.__mul__ (Math.log (real)).__exp__ ();
						}, '__rpow__');},
						get __mul__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real * other, self.imag * other);
							}
							else {
								return complex (self.real * other.real - self.imag * other.imag, self.real * other.imag + self.imag * other.real);
							}
						}, '__mul__');},
						get __rmul__ () {return __get__ (this, function (self, real) {
							return complex (self.real * real, self.imag * real);
						}, '__rmul__');},
						get __div__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real / other, self.imag / other);
							}
							else {
								var denom = other.real * other.real + other.imag * other.imag;
								return complex ((self.real * other.real + self.imag * other.imag) / denom, (self.imag * other.real - self.real * other.imag) / denom);
							}
						}, '__div__');},
						get __rdiv__ () {return __get__ (this, function (self, real) {
							var denom = self.real * self.real;
							return complex ((real * self.real) / denom, (real * self.imag) / denom);
						}, '__rdiv__');},
						get __add__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real + other, self.imag);
							}
							else {
								return complex (self.real + other.real, self.imag + other.imag);
							}
						}, '__add__');},
						get __radd__ () {return __get__ (this, function (self, real) {
							return complex (self.real + real, self.imag);
						}, '__radd__');},
						get __sub__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real - other, self.imag);
							}
							else {
								return complex (self.real - other.real, self.imag - other.imag);
							}
						}, '__sub__');},
						get __rsub__ () {return __get__ (this, function (self, real) {
							return complex (real - self.real, -(self.imag));
						}, '__rsub__');},
						get __repr__ () {return __get__ (this, function (self) {
							return '({}{}{}j)'.format (self.real, (self.imag >= 0 ? '+' : ''), self.imag);
						}, '__repr__');},
						get __str__ () {return __get__ (this, function (self) {
							return __repr__ (self).__getslice__ (1, -(1), 1);
						}, '__str__');}
					});
					var __Terminal__ = __class__ ('__Terminal__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							try {
								self.element = document.getElementById ('__terminal__');
							}
							catch (__except0__) {
								self.element = null;
							}
							if (self.element) {
								self.buffer = '';
								self.element.style.overflowX = 'auto';
								self.element.style.padding = '5px';
								self.element.innerHTML = '_';
							}
						}, '__init__');},
						get print () {return __get__ (this, function (self) {
							var sep = ' ';
							var end = '\n';
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
											case 'end': var end = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							if (self.element) {
								self.buffer = '{}{}{}'.format (self.buffer, sep.join (function () {
									var __accu0__ = [];
									var __iterator0__ = py_iter (args);
									while (true) {
										try {var arg = py_next (__iterator0__);} catch (exception) {break;}
										__accu0__.append (str (arg));
									}
									return __accu0__;
								} ()), end).__getslice__ (-(4096), null, 1);
								self.element.innerHTML = self.buffer.py_replace ('\n', '<br>');
								self.element.scrollTop = self.element.scrollHeight;
							}
							else {
								console.log (sep.join (function () {
									var __accu0__ = [];
									var __iterator0__ = py_iter (args);
									while (true) {
										try {var arg = py_next (__iterator0__);} catch (exception) {break;}
										__accu0__.append (str (arg));
									}
									return __accu0__;
								} ()));
							}
						}, 'print');},
						get input () {return __get__ (this, function (self, question) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'question': var question = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							self.print ('{}_'.format (question), __kwargdict__ ({end: ''}));
							try {
								var answer = window.prompt (question);
							}
							catch (__except0__) {
								console.log ('Error: Blocking input not yet implemented outside browser');
							}
							self.buffer = self.buffer.__getslice__ (0, -(1), 1);
							self.print (answer);
							return answer;
						}, 'input');}
					});
					var __terminal__ = __Terminal__ ();
					__pragma__ ('<all>')
						__all__.AssertionError = AssertionError;
						__all__.Exception = Exception;
						__all__.StopIteration = StopIteration;
						__all__.ValueError = ValueError;
						__all__.__Terminal__ = __Terminal__;
						__all__.__sort__ = __sort__;
						__all__.__terminal__ = __terminal__;
						__all__.complex = complex;
						__all__.filter = filter;
						__all__.map = map;
						__all__.sorted = sorted;
					__pragma__ ('</all>')
				}
			}
		}
	);

	// Initialize non-nested modules __base__ and __standard__ and make its names available directly and via __all__
	// It can't do that itself, because it is a regular Python module
	// The compiler recognizes its their namesand generates them inline rather than nesting them
	// In this way it isn't needed to import them everywhere
	 	
	// __base__
	
	__nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
	var __envir__ = __all__.__envir__;

	// __standard__
	
	__nest__ (__all__, '', __init__ (__all__.org.transcrypt.__standard__));
	
	var Exception = __all__.Exception;
	var StopIteration = __all__.StopIteration;
	var ValueError = __all__.ValueError;
	var AssertionError = __all__.AssertionError;
	
	var __sort__ = __all__.__sort__;
	var sorted = __all__.sorted;
	
	var map = __all__.map;
	var filter = __all__.filter;
	
	var complex = __all__.complex;
	
	__all__.print = __all__.__terminal__.print;
	__all__.input = __all__.__terminal__.input;
	
	var print = __all__.print;
	var input = __all__.input;

	// Complete __envir__, that was created in __base__, for non-stub mode
	__envir__.executor_name = __envir__.transpiler_name;
	
	// Make make __main__ available in browser
	var __main__ = {__file__: ''};
	__all__.main = __main__;
	
	// Define current exception, there's at most one exception in the air at any time
	var __except__ = null;
	__all__.__except__ = __except__;
		
	// Define recognizable dictionary for **kwargs parameter
	var __kwargdict__ = function (anObject) {
		anObject.__class__ = __kwargdict__;	// This class needs no __name__
		anObject.constructor = Object;
		return anObject;
	}
	__all__.___kwargdict__ = __kwargdict__;
	
	// Property installer function, no member since that would bloat classes
	var property = function (getter, setter) {	// Returns a property descriptor rather than a property
		if (!setter) {	// ??? Make setter optional instead of dummy?
			setter = function () {};
		}
		return {get: function () {return getter (this)}, set: function (value) {setter (this, value)}, enumerable: true};
	}
	__all__.property = property;
	
	// Assert function, call to it only generated when compiling with --dassert option
	function assert (condition, message) {
		if (!condition) {
			if (message != undefined) {
				throw AssertionError (message);
			}
			else {
				throw AssertionError ();
			}
		}
	}
	
	__all__.assert = assert;
	
	var __merge__ = function (object0, object1) {
		var result = {};
		for (var attrib in object0) {
			result [attrib] = object0 [attrib];
		}
		for (var attrib in object1) {
			result [attrib] = object1 [attrib];
		}
		return result;
	}
	__all__.__merge__ = __merge__;
	
	/* Not needed anymore?
	// Make console.log understand apply
	console.log.apply = function () {
		print ([] .slice.apply (arguments) .slice (1));
	};
	*/

	// Manipulating attributes by name
	
	var dir = function (obj) {
		var aList = [];
		for (var aKey in obj) {
			aList.push (aKey);
		}
		aList.sort ();
		return aList;
	}
	
	var setattr = function (obj, name, value) {
		obj [name] = value;
	};
		
	__all__.setattr = setattr;
	
	var getattr = function (obj, name) {
		return obj [name];
	};
	
	__all__.getattr= getattr
	
	var hasattr = function (obj, name) {
		return name in obj;
	};
	__all__.hasattr = hasattr;
	
	var delattr = function (obj, name) {
		delete obj [name];
	};
	__all__.delattr = (delattr);
	
	// The __in__ function, used to mimic Python's 'in' operator
	// In addition to CPython's semantics, the 'in' operator is also allowed to work on objects, avoiding a counterintuitive separation between Python dicts and JavaScript objects
	// In general many Transcrypt compound types feature a deliberate blend of Python and JavaScript facilities, facilitating efficient integration with JavaScript libraries
	// If only Python objects and Python dicts are dealt with in a certain context, the more pythonic 'hasattr' is preferred for the objects as opposed to 'in' for the dicts
	var __in__ = function (element, container) {
		if (type (container) == dict) {
			return container.keys () .indexOf (element) > -1;                                   // The keys of parameter 'element' are in an array
		}
		else {
			return container.indexOf ? container.indexOf (element) > -1 : element in container; // Parameter 'element' itself is an array, string or object
		}
	}
	__all__.__in__ = __in__;
	
	// Find out if an attribute is special
	var __specialattrib__ = function (attrib) {
		return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
	}
	__all__.__specialattrib__ = __specialattrib__;
		
	// Len function for any object
	var len = function (anObject) {
		if (anObject) {
			var l = anObject.length;
			if (l == undefined) {
				var result = 0;
				for (var attrib in anObject) {
					if (!__specialattrib__ (attrib)) {
						result++;
					}
				}
				return result;
			}
			else {
				return l;
			}
		}
		else {
			return 0;
		}
	}
	__all__.len = len;
	
	var bool = function (any) {	// Subtly different from __ (any), always truly returns a bool, rather than something truthy or falsy
		return typeof any == 'boolean' ? any : typeof any == 'number' ? any != 0 : len (any) ? true : false;
	}
	bool.__name__ = 'bool'	// So it can be used as a type with a name
	__all__.bool = bool;
	
	var float = function (any) {
		if (isNaN (any)) {
			throw ('ValueError');	// !!! Turn into real value error
		}
		else {
			return +any;
		}
	}
	float.__name__ = 'float'
	__all__.float = float;
	
	var int = function (any) {
		return float (any) | 0
	}
	int.__name__ = 'int';
	__all__.int = int;
	
	var type = function (anObject) {
		try {
			var result = anObject.__class__;
			return result;
		}
		catch (exception) {
			var aType = typeof anObject;
			if (aType == 'boolean') {
				return bool;
			}
			else if (aType == 'number') {
				if (anObject % 1 == 0) {
					return int;
				}
				else {
					return float;
				}				
			}
			else {
				return aType;
			}
		}
	}
	__all__.type = type;
	
	var isinstance = function (anObject, classinfo) {
		function isA (queryClass) {
			if (queryClass == classinfo) {
				return true;
			}
			for (var index = 0; index < queryClass.__bases__.length; index++) {
				if (isA (queryClass.__bases__ [index], classinfo)) {
					return true;
				}
			}
			return false;
		}
		try {
			return '__class__' in anObject ? isA (anObject.__class__) : anObject instanceof classinfo;
		}
		catch (exception) {
			console.log (exception);
			console.dir (anObject);
		}
	};
	__all__.isinstance = isinstance;
	
	// Truthyness conversion
	function __ (any) {	// Subtly different from bool (any), __ ([1, 2, 3]) returns [1, 2, 3], needed for nonempty selection: l = list1 or list2
		return ['boolean', 'number'] .indexOf (typeof (any)) >= 0 ? any : len (any) ? any : false;
	}
	__all__.__ = __;
	
	// Repr function uses __repr__ method, then __str__ then toString
	var repr = function (anObject) {
		try {
			return anObject.__repr__ ();
		}
		catch (exception) {
			try {
				return anObject.__str__ ();
			}
			catch (exception) {	// It was a dict in Python, so an Object in JavaScript
				try {
					if (anObject.constructor == Object) {
						var result = '{';
						var comma = false;
						for (var attrib in anObject) {
							if (!__specialattrib__ (attrib)) {
								if (attrib.isnumeric ()) {
									var attribRepr = attrib;				// If key can be interpreted as numerical, we make it numerical 
								}											// So we accept that '1' is misrepresented as 1
								else {
									var attribRepr = '\'' + attrib + '\'';	// Alpha key in dict
								}
								
								if (comma) {
									result += ', ';
								}
								else {
									comma = true;
								}
								try {
									result += attribRepr + ': ' + anObject [attrib] .__repr__ ();
								}
								catch (exception) {
									result += attribRepr + ': ' + anObject [attrib] .toString ();
								}
							}
						}
						result += '}';
						return result;					
					}
					else {
						return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
					}
				}
				catch (exception) {
					console.log ('ERROR: Could not evaluate repr (<object of type ' + typeof anObject + '>)');
					return '???';
				}
			}
		}
	}
	__all__.repr = repr;
	
	// Char from Unicode or ASCII
	var chr = function (charCode) {
		return String.fromCharCode (charCode);
	}
	__all__.chr = chr;

	// Unicode or ASCII from char
	var ord = function (aChar) {
		return aChar.charCodeAt (0);
	}
	__all__.org = ord;
	
	// Maximum of n numbers
	var max = Math.max;
	__all__.max = max;
	
	// Minimum of n numbers
	var min = Math.min;
	__all__.min = min;
	
	// Absolute value
	var abs = function (x) {
		try {
			return Math.abs (x);
		}
		catch (exception) {
			return Math.sqrt (x.real * x.real + x.imag * x.imag);
		}
	}
	
	// Bankers rounding
	var round = function (number, ndigits) {
		if (ndigits) {
			var scale = Math.pow (10, ndigits);
			number *= scale;
		}
			
		var rounded = Math.round (number);
		if (rounded - number == 0.5 && rounded % 2) {	// Has rounded up to odd, should have rounded down to even
			rounded -= 1;
		}
			
		if (ndigits) {
			rounded /= scale;
		}
		
		return rounded
 	}
	__all__.round = round;
		
	// Iterator protocol functions
	
	function wrap_py_next () {		// Add as 'next' method to make Python iterator JavaScript compatible
		var result = this.__next__ ();
		return {value: result, done: result == undefined};		
	}
	
	function wrap_js_next () {		// Add as '__next__' method to make JavaScript iterator Python compatible
		var result = this.next ();
		if (result.done) {
			throw StopIteration ();
		}
		else {
			return result.value;
		}
	}
	
	function py_iter (iterable) {	// Produces universal iterator with Python '__next__' as well as JavaScript 'next'
		if ('__iter__' in iterable) {	// It's a Python iterable (incl. JavaScript Arrays and strings)
			var iterator = iterable.__iter__ ();
			iterator.next = wrap_py_next;
			return iterator;
		}
		else if ('selector' in iterable) { // Assume it's a JQuery iterator
			var iterator = list (iterable) .__iter__ ();
			iterator.next = wrap_py_next;
			return iterator;
		}
		else if ('next' in iterable) {	// It's a JavaScript generator
			// It should have an iterator field, but doesn't in Chrome
			// So we just return the generator itself, which is both an iterable and an iterator
			iterable.__next__ = wrap_js_next;
			return iterable;
		}
		else {
			return null;
		}
	}
	__all__.py_iter = py_iter;
	
	function py_next (iterator) {				// Called only in a Python context, could receive Python or JavaScript iterator
		try {									// Primarily assume Python iterator, for max speed
			var result = iterator.__next__ ();
		}
		catch (exception) {						// JavaScript iterators are the exception here
			var result = iterator.next ();
			if (result.done) {
				throw StopIteration ();
			}
			else {
				return result.value;
			}
		}	
		if (result == undefined) {
			throw StopIteration ();
		}
		return result;
	}
	__all__.py_next = py_next;
	
	function __SeqIterator__ (iterable) {
		this.iterable = iterable;
		this.index = 0;
	}
	
	__all__.__SeqIterator__ = __SeqIterator__;
	
	__SeqIterator__.prototype.__iter__ = function () {
		return this;
	}
	
	__SeqIterator__.prototype.__next__ = function () {
		return this.iterable [this.index++];
	}
	
	__SeqIterator__.prototype.next = wrap_py_next;
	
	function __KeyIterator__ (iterable) {
		this.iterable = iterable;
		this.index = 0;
	}

	__all__.__KeyIterator__ = __KeyIterator__;
	
	__KeyIterator__.prototype.__iter__ = function () {
		return this;
	}
	
	__KeyIterator__.prototype.__next__ = function () {
		return this.iterable.keys () [this.index++];
	}
			
	__KeyIterator__.prototype.next = wrap_py_next;
	
	// Reversed function for arrays
	var py_reversed = function (iterable) {
		iterable = iterable.slice ();
		iterable.reverse ();
		return iterable;
	}
	__all__.py_reversed = py_reversed;
	
	// Zip method for arrays
	var zip = function () {
		var args = [] .slice.call (arguments);
		var shortest = args.length == 0 ? [] : args.reduce (	// Find shortest array in arguments
			function (array0, array1) {
				return array0.length < array1.length ? array0 : array1;
			}
		);
		return shortest.map (					// Map each element of shortest array
			function (current, index) {			// To the result of this function
				return args.map (				// Map each array in arguments
					function (current) {		// To the result of this function
						return current [index]; // Namely it's index't entry
					}
				);
			}
		);
	}
	__all__.zip = zip;
	
	// Range method, returning an array
	function range (start, stop, step) {
		if (stop == undefined) {
			// one param defined
			stop = start;
			start = 0;
		}
		if (step == undefined) {
			step = 1;
		}
		if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
			return [];
		}
		var result = [];
		for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
			result.push(i);
		}
		return result;
	};
	__all__.range = range;
	
	// Any, all and sum
	
	function any (iterable) {
		for (let item of iterable) {
			if (bool (item)) {
				return true;
			}
		}
		return false;
	}
	function all (iterable) {
		for (let item of iterable) {
			if (! bool (item)) {
				return false;
			}
		}
		return true;
	}
	function sum (iterable) {
		let result = 0;
		for (let item of iterable) {
			result += item;
		}
		return result;
	}

	__all__.any = any;
	__all__.all = all;
	__all__.sum = sum;
	
	// Enumerate method, returning a zipped list
	function enumerate (iterable) {
		return zip (range (len (iterable)), iterable);
	}
	__all__.enumerate = enumerate;
		
	// Shallow and deepcopy
	
	function copy (anObject) {
		if (anObject == null || typeof anObject == "object") {
			return anObject;
		}
		else {
			var result = {}
			for (var attrib in obj) {
				if (anObject.hasOwnProperty (attrib)) {
					result [attrib] = anObject [attrib];
				}
			}
			return result;
		}
	}
	__all__.copy = copy;
	
	function deepcopy (anObject) {
		if (anObject == null || typeof anObject == "object") {
			return anObject;
		}
		else {
			var result = {}
			for (var attrib in obj) {
				if (anObject.hasOwnProperty (attrib)) {
					result [attrib] = deepcopy (anObject [attrib]);
				}
			}
			return result;
		}
	}
	__all__.deepcopy = deepcopy;
		
	// List extensions to Array
	
	function list (iterable) {										// All such creators should be callable without new
		var instance = iterable ? Array.from (iterable) : [];
		// Sort is the normal JavaScript sort, Python sort is a non-member function
		return instance;
	}
	__all__.list = list;
	Array.prototype.__class__ = list;	// All arrays are lists (not only if constructed by the list ctor), unless constructed otherwise
	list.__name__ = 'list';
	
	/*
	Array.from = function (iterator) { // !!! remove
		result = [];
		for (item of iterator) {
			result.push (item);
		}
		return result;
	}
	*/
	
	Array.prototype.__iter__ = function () {
		return new __SeqIterator__ (this);
	}
	
	Array.prototype.__getslice__ = function (start, stop, step) {
		if (start < 0) {
			start = this.length + start;
		}
		
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
		
		var result = list ([]);
		for (var index = start; index < stop; index += step) {
			result.push (this [index]);
		}
		
		return result;
	}
		
	Array.prototype.__setslice__ = function (start, stop, step, source) {
		if (start < 0) {
			start = this.length + start;
		}
			
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
			
		if (step == null) {	// Assign to 'ordinary' slice, replace subsequence
			Array.prototype.splice.apply (this, [start, stop - start] .concat (source)) 
		}
		else {				// Assign to extended slice, replace designated items one by one
			var sourceIndex = 0;
			for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
				this [targetIndex] = source [sourceIndex++];
			}
		}
	}
	
	Array.prototype.__repr__ = function () {
		if (this.__class__ == set && !this.length) {
			return 'set()';
		}
		
		var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';
		
		for (var index = 0; index < this.length; index++) {
			if (index) {
				result += ', ';
			}
			try {
				result += this [index] .__repr__ ();
			}
			catch (exception) {
				result += this [index] .toString ();
			}
		}
		
		if (this.__class__ == tuple && this.length == 1) {
			result += ',';
		}
		
		result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
		return result;
	};
	
	Array.prototype.__str__ = Array.prototype.__repr__;
	
	Array.prototype.append = function (element) {
		this.push (element);
	};

	Array.prototype.clear = function () {
		this.length = 0;
	};
	
	Array.prototype.extend = function (aList) {
		this.push.apply (this, aList);
	};
	
	Array.prototype.insert = function (index, element) {
		this.splice (index, 0, element);
	};

	Array.prototype.remove = function (element) {
		var index = this.indexOf (element);
		if (index == -1) {
			throw ('KeyError');
		}
		this.splice (index, 1);
	};

	Array.prototype.index = function (element) {
		return this.indexOf (element)
	};
	
	Array.prototype.py_pop = function (index) {
		if (index == undefined) {
			return this.pop ()	// Remove last element
		}
		else {
			return this.splice (index, 1) [0];
		}
	};	
	
	Array.prototype.py_sort = function () {
		__sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));	// Can't work directly with arguments
		// Python params: (iterable, key = None, reverse = False)
		// py_sort is called with the Transcrypt kwargs mechanism, and just passes the params on to __sort__
		// __sort__ is def'ed with the Transcrypt kwargs mechanism
	};
	
	Array.prototype.__add__ = function (aList) {
		return list (this.concat (aList))
	}
	
	Array.prototype.__mul__ = function (scalar) {
		var result = this;
		for (var i = 1; i < scalar; i++) {
			result = result.concat (this);
		}
		return result;
	}
	
	Array.prototype.__rmul__ = Array.prototype.__mul__;
		
	// Tuple extensions to Array
	
	function tuple (iterable) {
		var instance = iterable ? [] .slice.apply (iterable) : [];
		instance.__class__ = tuple;	// Not all arrays are tuples
		return instance;
	}
	__all__.tuple = tuple;
	tuple.__name__ = 'tuple';
	
	// Set extensions to Array
	// N.B. Since sets are unordered, set operations will occasionally alter the 'this' array by sorting it
		
	function set (iterable) {
		var instance = [];
		if (iterable) {
			for (var index = 0; index < iterable.length; index++) {
				instance.add (iterable [index]);
			}
			
			
		}
		instance.__class__ = set;	// Not all arrays are sets
		return instance;
	}
	__all__.set = set;
	set.__name__ = 'set';
	
	Array.prototype.__bindexOf__ = function (element) {	// Used to turn O (n^2) into O (n log n)
	// Since sorting is lex, compare has to be lex. This also allows for mixed lists
	
		element += '';
	
		var mindex = 0;
		var maxdex = this.length - 1;
			 
		while (mindex <= maxdex) {
			var index = (mindex + maxdex) / 2 | 0;
			var middle = this [index] + '';
	 
			if (middle < element) {
				mindex = index + 1;
			}
			else if (middle > element) {
				maxdex = index - 1;
			}
			else {
				return index;
			}
		}
	 
		return -1;
	}
	
	Array.prototype.add = function (element) {		
		if (this.indexOf (element) == -1) {	// Avoid duplicates in set
			this.push (element);
		}
	};
	
	Array.prototype.discard = function (element) {
		var index = this.indexOf (element);
		if (index != -1) {
			this.splice (index, 1);
		}
	};
	
	Array.prototype.isdisjoint = function (other) {
		this.sort ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) != -1) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.issuperset = function (other) {
		this.sort ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) == -1) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.issubset = function (other) {
		return set (other.slice ()) .issuperset (this);	// Sort copy of 'other', not 'other' itself, since it may be an ordered sequence
	};
	
	Array.prototype.union = function (other) {
		var result = set (this.slice () .sort ());
		for (var i = 0; i < other.length; i++) {
			if (result.__bindexOf__ (other [i]) == -1) {
				result.push (other [i]);
			}
		}
		return result;
	};
	
	Array.prototype.intersection = function (other) {
		this.sort ();
		var result = set ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) != -1) {
				result.push (other [i]);
			}
		}
		return result;
	};
	
	Array.prototype.difference = function (other) {
		var sother = set (other.slice () .sort ());
		var result = set ();
		for (var i = 0; i < this.length; i++) {
			if (sother.__bindexOf__ (this [i]) == -1) {
				result.push (this [i]);
			}
		}
		return result;
	};
	
	Array.prototype.symmetric_difference = function (other) {
		return this.union (other) .difference (this.intersection (other));
	};
	
	Array.prototype.update = function () {	// O (n)
		var updated = [] .concat.apply (this.slice (), arguments) .sort ();		
		this.clear ();
		for (var i = 0; i < updated.length; i++) {
			if (updated [i] != updated [i - 1]) {
				this.push (updated [i]);
			}
		}
	};
	
	Array.prototype.__eq__ = function (other) {	// Also used for list
		if (this.length != other.length) {
			return false;
		}
		if (this.__class__ == set) {
			this.sort ();
			other.sort ();
		}	
		for (var i = 0; i < this.length; i++) {
			if (this [i] != other [i]) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.__ne__ = function (other) {	// Also used for list
		return !this.__eq__ (other);
	}
		
	Array.prototype.__le__ = function (other) {
		return this.issubset (other);
	}
		
	Array.prototype.__ge__ = function (other) {
		return this.issuperset (other);
	}
		
	Array.prototype.__lt__ = function (other) {
		return this.issubset (other) && !this.issuperset (other);
	}
		
	Array.prototype.__gt__ = function (other) {
		return this.issuperset (other) && !this.issubset (other);
	}
	
	// Dict extensions to object
	
	function __keyIterator__ () {
		return new __KeyIterator__ (this);
	}
	
	function __keys__ () {
		var keys = []
		for (var attrib in this) {
			if (!__specialattrib__ (attrib)) {
				keys.push (attrib);
			}     
		}
		return keys;
	}
		
	function __items__ () {
		var items = []
		for (var attrib in this) {
			if (!__specialattrib__ (attrib)) {
				items.push ([attrib, this [attrib]]);
			}     
		}
		return items;
	}
		
	function __del__ (key) {
		delete this [key];
	}
	
	function __clear__ () {
		for (var attrib in this) {
			delete this [attrib];
		}
	}
	
	function __setdefault__ (aKey, aDefault) {
		var result = this [aKey];
		if (result != undefined) {
			return result;
		}
		var val = aDefault == undefined ? null : aDefault;
		this [aKey] = val;
		return val;
	}
	
	function __pop__ (aKey, aDefault) {
		var result = this [aKey];
		if (result != undefined) {
			delete this [aKey];
			return result;
		}
		return aDefault;
	}	
	
	function __update__(aDict) {
		for (var aKey in aDict) {
			this [aKey] = aDict [aKey];
		}
	}
	
	function dict (objectOrPairs) {
		if (!objectOrPairs || objectOrPairs instanceof Array) {	// It's undefined or an array of pairs
			var instance = {};
			if (objectOrPairs) {
				for (var index = 0; index < objectOrPairs.length; index++) {
					var pair = objectOrPairs [index];
					instance [pair [0]] = pair [1];
				}
			}
		}
		else {													// It's a JavaScript object literal
			var instance = objectOrPairs;
		}
			
		// Trancrypt interprets e.g. {aKey: 'aValue'} as a Python dict literal rather than a JavaScript object literal
		// So dict literals rather than bare Object literals will be passed to JavaScript libraries
		// Some JavaScript libraries call all enumerable callable properties of an object that's passed to them
		// So the properties of a dict should be non-enumerable
		Object.defineProperty (instance, '__class__', {value: dict, enumerable: false, writable: true});
		Object.defineProperty (instance, 'keys', {value: __keys__, enumerable: false});
		Object.defineProperty (instance, '__iter__', {value: __keyIterator__, enumerable: false});
		Object.defineProperty (instance, 'items', {value: __items__, enumerable: false});		
		Object.defineProperty (instance, 'del', {value: __del__, enumerable: false});
		Object.defineProperty (instance, 'clear', {value: __clear__, enumerable: false});
		Object.defineProperty (instance, 'setdefault', {value: __setdefault__, enumerable: false});
		Object.defineProperty (instance, 'py_pop', {value: __pop__, enumerable: false});
		Object.defineProperty (instance, 'update', {value: __update__, enumerable: false});
		return instance;
	}
	__all__.dict = dict;
	dict.__name__ = 'dict';
	
	// String extensions
	
	function str (stringable) {
		try {
			return stringable.__str__ ();
		}
		catch (exception) {
			return new String (stringable);
		}
	}
	__all__.str = str;	
	
	String.prototype.__class__ = str;	// All strings are str
	str.__name__ = 'str';
	
	String.prototype.__iter__ = function () {
		return new __SeqIterator__ (this);
	}
		
	String.prototype.__repr__ = function () {
		return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .replace ('\t', '\\t') .replace ('\n', '\\n');
	};
	
	String.prototype.__str__ = function () {
		return this;
	};
	
	String.prototype.capitalize = function () {
		return this.charAt (0).toUpperCase () + this.slice (1);
	};
	
	String.prototype.endswith = function (suffix) {
		return suffix == '' || this.slice (-suffix.length) == suffix;
	};
	
	String.prototype.find  = function (sub, start) {
		return this.indexOf (sub, start);
	};
	
	String.prototype.__getslice__ = function (start, stop, step) {
		if (start < 0) {
			start = this.length + start;
		}
		
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
		
		var result = '';
		if (step == 1) {
			result = this.substring (start, stop);
		}
		else {
			for (var index = start; index < stop; index += step) {
				result = result.concat (this.charAt(index));
			}
		}
		return result;
	}
	
	// Since it's worthwhile for the 'format' function to be able to deal with *args, it is defined as a property
	// __get__ will produce a bound function if there's something before the dot
	// Since a call using *args is compiled to e.g. <object>.<function>.apply (null, args), the function has to be bound already
	// Otherwise it will never be, because of the null argument
	// Using 'this' rather than 'null' contradicts the requirement to be able to pass bound functions around
	// The object 'before the dot' won't be available at call time in that case, unless implicitly via the function bound to it
	// While for Python methods this mechanism is generated by the compiler, for JavaScript methods it has to be provided manually
	// Call memoizing is unattractive here, since every string would then have to hold a reference to a bound format method
	Object.defineProperty (String.prototype, 'format', {
		get: function () {return __get__ (this, function (self) {
			var args = tuple ([] .slice.apply (arguments).slice (1));			
			var autoIndex = 0;
			return self.replace (/\{(\w*)\}/g, function (match, key) { 
				if (key == '') {
					key = autoIndex++;
				}
				if (key == +key) {	// So key is numerical
					return args [key] == undefined ? match : args [key];
				}
				else {				// Key is a string
					for (var index = 0; index < args.length; index++) {
						// Find first 'dict' that has that key and the right field
						if (typeof args [index] == 'object' && args [index][key] != undefined) {
							return args [index][key];	// Return that field field
						}
					}
					return match;
				}
			});
		});},
		enumerable: true
	});
	
	String.prototype.isnumeric = function () {
		return !isNaN (parseFloat (this)) && isFinite (this);
	};
	
	String.prototype.join = function (strings) {
		strings = Array.from (strings);	// Much faster than iterating through strings char by char
		return strings.join (this);
	};
	
	String.prototype.lower = function () {
		return this.toLowerCase ();
	};
	
	String.prototype.py_replace = function (old, aNew, maxreplace) {
		return this.split (old, maxreplace) .join (aNew);
	};
	
	String.prototype.lstrip = function () {
		return this.replace (/^\s*/g, '');
	};
	
	String.prototype.rfind = function (sub, start) {
		return this.lastIndexOf (sub, start);
	};
	
	String.prototype.rsplit = function (sep, maxsplit) {	// Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
		if (sep == undefined || sep == null) {
			sep = /\s+/;
			var stripped = this.strip ();
		}
		else {
			var stripped = this;
		}
			
		if (maxsplit == undefined || maxsplit == -1) {
			return stripped.split (sep);
		}
		else {
			var result = stripped.split (sep);
			if (maxsplit < result.length) {
				var maxrsplit = result.length - maxsplit;
				return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
			}
			else {
				return result;
			}
		}
	};
	
	String.prototype.rstrip = function () {
		return this.replace (/\s*$/g, '');
	};
	
	String.prototype.py_split = function (sep, maxsplit) {	// Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
		if (sep == undefined || sep == null) {
			sep = /\s+/
			var stripped = this.strip ();
		}
		else {
			var stripped = this;
		}
			
		if (maxsplit == undefined || maxsplit == -1) {
			return stripped.split (sep);
		}
		else {
			var result = stripped.split (sep);
			if (maxsplit < result.length) {
				return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
			}
			else {
				return result;
			}
		}
	};
	
	String.prototype.startswith = function (prefix) {
		return this.indexOf (prefix) == 0;
	};
	
	String.prototype.strip = function () {
		return this.trim ();
	};
		
	String.prototype.upper = function () {
		return this.toUpperCase ();
	};
	
	String.prototype.__mul__ = function (scalar) {
		var result = this;
		for (var i = 1; i < scalar; i++) {
			result = result + this;
		}
		return result;
	}
	
	String.prototype.__rmul__ = String.prototype.__mul__;
		
	// General operator overloading, only the ones that make most sense in matrix and complex operations
	
	var __neg__ = function (a) {
		if (typeof a == 'object' && '__neg__' in a) {
			return a.__neg__ ();
		}
		else {
			return -a;
		}
	};  
	__all__.__neg__ = __neg__;
	
	var __matmul__ = function (a, b) {
		return a.__matmul__ (b);
	};  
	__all__.__matmul__ = __matmul__;
	
	var __pow__ = function (a, b) {
		if (typeof a == 'object' && '__pow__' in a) {
			return a.__pow__ (b);
		}
		else if (typeof b == 'object' && '__rpow__' in b) {
			return b.__rpow__ (a);
		}
		else {
			return Math.pow (a, b);
		}
	};	
	__all__.pow = __pow__;
	
	var __mul__ = function (a, b) {
		if (typeof a == 'object' && '__mul__' in a) {
			return a.__mul__ (b);
		}
		else if (typeof b == 'object' && '__rmul__' in b) {
			return b.__rmul__ (a);
		}
		else if (typeof a == 'string') {
			return a.__mul__ (b);
		}
		else if (typeof b == 'string') {
			return b.__rmul__ (a);
		}
		else {
			return a * b;
		}
	};  
	__all__.__mul__ = __mul__;
	
	var __div__ = function (a, b) {
		if (typeof a == 'object' && '__div__' in a) {
			return a.__div__ (b);
		}
		else if (typeof b == 'object' && '__rdiv__' in b) {
			return b.__rdiv__ (a);
		}
		else {
			return a / b;
		}
	};  
	__all__.__div__ = __div__;
	
	var __add__ = function (a, b) {
		if (typeof a == 'object' && '__add__' in a) {
			return a.__add__ (b);
		}
		else if (typeof b == 'object' && '__radd__' in b) {
			return b.__radd__ (a);
		}
		else {
			return a + b;
		}
	};  
	__all__.__add__ = __add__;
	
	var __sub__ = function (a, b) {
		if (typeof a == 'object' && '__sub__' in a) {
			return a.__sub__ (b);
		}
		else if (typeof b == 'object' && '__rsub__' in b) {
			return b.__rsub__ (a);
		}
		else {
			return a - b;
		}
	};  
	__all__.__sub__ = __sub__;
	
	var __eq__ = function (a, b) {
		if (typeof a == 'object' && '__eq__' in a) {
			return a.__eq__ (b);
		}
		else {
			return a == b
		}
	};
	__all__.__eq__ = __eq__;
		
	var __ne__ = function (a, b) {
		if (typeof a == 'object' && '__ne__' in a) {
			return a.__ne__ (b);
		}
		else {
			return a != b
		}
	};
	__all__.__ne__ = __ne__;
		
	var __lt__ = function (a, b) {
		if (typeof a == 'object' && '__lt__' in a) {
			return a.__lt__ (b);
		}
		else {
			return a < b
		}
	};
	__all__.__lt__ = __lt__;
		
	var __le__ = function (a, b) {
		if (typeof a == 'object' && '__le__' in a) {
			return a.__le__ (b);
		}
		else {
			return a <= b
		}
	};
	__all__.__le__ = __le__;
		
	var __gt__ = function (a, b) {
		if (typeof a == 'object' && '__gt__' in a) {
			return a.__gt__ (b);
		}
		else {
			return a > b
		}
	};
	__all__.__gt__ = __gt__;
		
	var __ge__ = function (a, b) {
		if (typeof a == 'object' && '__ge__' in a) {
			return a.__ge__ (b);
		}
		else {
			return a >= b
		}
	};
	__all__.__ge__ = __ge__;
		
	var __getitem__ = function (container, key) {							// Slice c.q. index, direct generated call to runtime switch
		if (typeof container == 'object' && '__getitem__' in container) {
			return container.__getitem__ (key);								// Overloaded on container
		}
		else {
			return container [key];											// Container must support bare JavaScript brackets
		}
	};
	__all__.__getitem__ = __getitem__;

	var __setitem__ = function (container, key, value) {					// Slice c.q. index, direct generated call to runtime switch
		if (typeof container == 'object' && '__setitem__' in container) {
			container.__setitem__ (key, value);								// Overloaded on container
		}
		else {
			container [key] = value;										// Container must support bare JavaScript brackets
		}
	};
	__all__.__setitem__ = __setitem__;

	var __getslice__ = function (container, lower, upper, step) {			// Slice only, no index, direct generated call to runtime switch
		if (typeof container == 'object' && '__getitem__' in container) {
			return container.__getitem__ ([lower, upper, step]);			// Container supports overloaded slicing c.q. indexing
		}
		else {
			return container.__getslice__ (lower, upper, step);				// Container only supports slicing injected natively in prototype
		}
	};
	__all__.__getslice__ = __getslice__;

	var __setslice__ = function (container, lower, upper, step, value) {	// Slice, no index, direct generated call to runtime switch
		if (typeof container == 'object' && '__setitem__' in container) {
			container.__setitem__ ([lower, upper, step], value);			// Container supports overloaded slicing c.q. indexing
		}
		else {
			container.__setslice__ (lower, upper, step, value);				// Container only supports slicing injected natively in prototype
		}
	};
	__all__.__setslice__ = __setslice__;

	var __call__ = function (/* <callee>, <params>* */) {
		var args = [] .slice.apply (arguments)
		if (typeof args [0] == 'object' && '__call__' in args [0]) {
			return args [0] .__call__ .apply (null,  args.slice (1));
		}
		else {
			return args [0] .apply (null, args.slice (1));
		}		
	};
	__all__.__call__ = __call__;

	__nest__ (
		__all__,
		'itertools', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var count = function* (start, step) {
						if (start == undefined) {
							start = 0;
						}
						if (step == undefined) {
							step = 1;
						}
						while (true) {
							yield start;
							start += step;
						}
					}
					var cycle = function* (iterable) {						
						let buffer = Array.from (iterable);	// Can't reset, Chrome can't obtain iter from gener
						while (true) {
							for (let item of buffer) {
								yield item;
							}
						}
					}
					var repeat = function* (item, n) {
						if (typeof n == 'undefined') {
							while (true) {
								yield item;
							}
						}
						else {
							for (let index = 0; index < n; index++) {
								yield item;
							}
						}
					}
					var accumulate = function* (iterable, func) {
						let sum;
						let first = true;
						if (func) {
							for (let item of iterable) {
								if (first) {
									sum = item;
									first = false;
								}
								else {
									sum = func (sum, item);
								}
								yield sum;
							}
						}
						else {
							for (let item of iterable) {
								if (first) {
									sum = item;
									first = false;
								}
								else {
									sum = sum + item;
								}
								yield sum;
							}
						}
					}
					var chain = function* () {
						let args = [] .slice.apply (arguments);							
						for (let arg of args) {
							for (let item of arg) {
								yield item;
							}
						}
					}
					chain.from_iterable = function* (iterable) {						
						for (let item of iterable) {
							for (let subItem of item) {
								yield subItem;
							}
						}
					}
					var compress = function* (data, selectors) {
						let dataIterator = data [Symbol.iterator] .call (data);
						let selectorsIterator = selectors [Symbol.iterator] ();
						while (true) {
							let dataItem = dataIterator.next ();
							let selectorsItem = selectorsIterator.next ();
							if (dataItem.done || selectorsItem.done) {
								break;
							}
							else {
								if (selectorsItem.value) {
									yield dataItem.value;
								}
							}
						}
					}
					var dropwhile = function* (pred, seq) {
						let started = false;
						for (let item of seq) {
							if (started) {
								yield item;
							}
							else if (!pred (item)) {
								started = true;
								yield item;
							}
						}
					}
					var filterfalse = function* (pred, seq) {
						for (let item of seq) {
							if (!pred (item)) {
								yield item;
							}
						}
					}
					var groupby = function* (iterable, keyfunc) {
						let anIterator = iterable [Symbol.iterator] ();
						let item = anIterator.next ();
						
						if (item.done) {
							return;
						}
						
						let groupKey = keyfunc (item.value);
						let more = true;
						
						function* group () {
							while (true) {
								yield (item.value);
								item = anIterator.next ();
								
								if (item.done) {
									more = false;
									return;
								}
								
								let key = keyfunc (item.value);
								
								if (key != groupKey) {
									groupKey = key;
									return;
								}
							}
						}
						
						while (more) {
							yield tuple ([groupKey, group ()]);
						}
					}
					
					var islice = function* () {
						let start;	// Have to be defined at function level, or Closure compiler will loose them after a yield 
						let stop;	//
						let step;	//
						
						let args = [] .slice.apply (arguments);
						let anIterator = args [0][Symbol.iterator] ();
						if (args.length == 2) {
							stop = args [1];
							start = 0;
							step = 1;
						}
						else {
							start = args [1];
							stop = args [2];
							if (args.length == 4) {
								step = args [3];
							}
							else {
								step = 1;
							}
						}
						for (let index = 0; index < start; index++) {
							if (anIterator.next (). done) {
								return;
							}
						}
						for (let index = 0; index < stop - start; index++) {
							let next = anIterator.next ();
							if (next.done) {
								return;
							}
							if (index % step == 0) {
								yield next.value;
							}
						}
					}
					var starmap = function* (func, seq) {
						let anIterator = seq [Symbol.iterator] ();
						while (true) {
							let next = anIterator.next ()
							if (next.done) {
								return;
							}
							else {
								yield func (...next.value); 
							}
						}
					}
					var takewhile = function* (pred, seq) {
						for (let item of seq) {
							if (pred (item)) {
								yield item;
							}
							else {
								return;
							}
						}
					}
					var tee = function (iterable, n) {
						if (n == undefined) {
							n = 2;
						}
						let all = [];								// Don't return iterator since destructuring assignment cannot yet deal with that
						let one = list (iterable);
						for (let i = 0; i < n; i++) {
							all.append (one [Symbol.iterator] ());	// Iterator rather than list, exhaustable for semantic equivalence
						}
						return list (all);
					}
					
					var product = function () {
						let args = [] .slice.apply (arguments);
						if (args.length && args [args.length - 1] .__class__ == __kwargdict__) {
							var repeat = args.pop () ['repeat']; 
						}
						else {
							var repeat = 1;
						}
						
						let oldMolecules = [tuple ([])];
						for (let i = 0; i < repeat; i++) {
							for (let arg of args) {
								let newMolecules = [];
								for (let oldMolecule of oldMolecules) {
									for (let atom of arg) {
										newMolecules.append (tuple (oldMolecule.concat (atom)));
									}
								}
								oldMolecules = newMolecules;
							}
						}
						return list (oldMolecules);	// Also works if args is emptpy
					}
					var permutations = function (iterable, r) {
						if (r == undefined) {
							try {
								r = len (iterable);
							}
							catch (exception) {
								r = len (list (iterable));
							}
						}
						let aProduct = product (iterable, __kwargdict__ ({repeat: r}));
						let result = [];
						for (let molecule of aProduct) {
							if (len (set (molecule)) == r) {	// Weed out doubles
								result.append (molecule);
							}
						}
						return list (result);
					}
					var combinations = function (iterable, r) {
						let tail = list (iterable);
						function recurse (tail, molecule, rNext) {
							for (let index = 0; index < len (tail) - rNext; index++) {
								let newMolecule = molecule.concat (tail.slice (index, index + 1));

								if (rNext) {
									recurse (tail.slice (index + 1), newMolecule, rNext - 1);
								}
								else {
									result.append (tuple (newMolecule));
								}
							}
						}
						let result = [];
						recurse (tail, tail.slice (0, 0), r - 1);
						return list (result);
					}
					var combinations_with_replacement = function (iterable, r) {
						let tail = list (iterable);
						function recurse (tail, molecule, rNext) {
							for (let index = 0; index < len (tail); index++) {
								let newMolecule = molecule.concat (tail.slice (index, index + 1));

								if (rNext) {
									recurse (tail.slice (index), newMolecule, rNext - 1);
								}
								else {
									result.append (tuple (newMolecule));
								}
							}
						}
						let result = [];
						recurse (tail, tail.slice (0, 0), r - 1);
						return list (result);
					}
					//<all>
					__all__.count = count;
					__all__.cycle = cycle;
					__all__.repeat = repeat;
					__all__.accumulate = accumulate;
					__all__.chain = chain;
					__all__.compress = compress;
					__all__.dropwhile = dropwhile;
					__all__.filterfalse = filterfalse;
					__all__.groupby = groupby;
					__all__.islice = islice;
					__all__.starmap = starmap;
					__all__.takewhile = takewhile;
					__all__.tee = tee;
					__all__.product = product;
					__all__.permutations = permutations;
					__all__.combinations = combinations;
					__all__.combinations_with_replacement = combinations_with_replacement;
					//</all>
				}
			}
		}
	);
	__nest__ (
		__all__,
		'numscrypt', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var itertools = {};
					__nest__ (itertools, '', __init__ (__world__.itertools));
					var ns_ctors = dict ({'int32': Int32Array, 'float32': Float32Array, 'float64': Float64Array});
					var ns_complex = function (dtype) {
						return __in__ (dtype, tuple (['complex64', 'complex128']));
					};
					var ns_buffertype = function (dtype) {
						return (dtype == 'complex64' ? 'float32' : (dtype == 'complex128' ? 'float64' : dtype));
					};
					var ns_complextype = function (dtype) {
						return (dtype == 'float32' ? 'complex64' : (dtype == 'float64' ? 'complex128' : null));
					};
					var ns_createbuf = function (imag, dtype, size) {
						return (!(imag) || ns_complex (dtype) ? new ns_ctors [ns_buffertype (dtype)] (size) : null);
					};
					var ndarray = __class__ ('ndarray', [object], {
						get __init__ () {return __get__ (this, function (self, shape, dtype, realbuf, imagbuf) {
							if (typeof realbuf == 'undefined' || (realbuf != null && realbuf .__class__ == __kwargdict__)) {;
								var realbuf = null;
							};
							if (typeof imagbuf == 'undefined' || (imagbuf != null && imagbuf .__class__ == __kwargdict__)) {;
								var imagbuf = null;
							};
							self.dtype = dtype;
							self.ns_complex = ns_complex (dtype);
							self.realbuf = realbuf;
							if (self.ns_complex) {
								self.imagbuf = imagbuf;
							}
							self.setshape (shape);
						}, '__init__');},
						get setshape () {return __get__ (this, function (self, shape) {
							self.shape = shape;
							self.ndim = shape.length;
							self.ns_nrows = shape [0];
							if (self.ndim == 1) {
								self.size = self.ns_nrows;
							}
							else {
								self.ns_ncols = shape [1];
								self.size = self.ns_nrows * self.ns_ncols;
							}
						}, 'setshape');},
						get astype () {return __get__ (this, function (self, dtype) {
							var result = empty (self.shape, dtype);
							result.realbuf.set (self.realbuf);
							if (self.ns_complex) {
								result.imagbuf.set (self.imagbuf);
							}
							return result;
						}, 'astype');},
						get tolist () {return __get__ (this, function (self) {
							if (self.ns_complex) {
								var flat = function () {
									var __accu0__ = [];
									var __iterator0__ = py_iter (zip (list (self.realbuf), list (self.imagbuf)));
									while (true) {
										try {var __left0__ = py_next (__iterator0__);
											var real = __left0__ [0];
											var imag = __left0__ [1];} catch (exception) {break;}
										__accu0__.append (complex (real, imag));
									}
									return __accu0__;
								} ();
							}
							else {
								var flat = self.realbuf;
							}
							if (self.ndim == 1) {
								return list (flat);
							}
							else {
								return function () {
									var __accu0__ = [];
									for (var irow = 0; irow < self.ns_nrows; irow++) {
										__accu0__.append (function () {
											var __accu1__ = [];
											for (var icol = 0; icol < self.ns_ncols; icol++) {
												__accu1__.append (flat [self.ns_ncols * irow + icol]);
											}
											return __accu1__;
										} ());
									}
									return __accu0__;
								} ();
							}
						}, 'tolist');},
						get __repr__ () {return __get__ (this, function (self) {
							return 'array({})'.format (repr (self.tolist ()));
						}, '__repr__');},
						get __str__ () {return __get__ (this, function (self) {
							if (self.ndim == 1) {
								return str (self.tolist ());
							}
							else {
								return '[\n\t{}\n]\n'.format ('\n\t'.join (function () {
									var __accu0__ = [];
									var __iterator0__ = py_iter (self.tolist ());
									while (true) {
										try {var row = py_next (__iterator0__);} catch (exception) {break;}
										__accu0__.append (str (row));
									}
									return __accu0__;
								} ()));
							}
						}, '__str__');},
						get reshape () {return __get__ (this, function (self, shape) {
							if (self.ndim == 1) {
								return tuple ([array (self, self.dtype)]);
							}
							else {
								var result = array (self, self.dtype);
								result.setshape (self.ns_ncols, self.ns_nrows);
								return result;
							}
						}, 'reshape');},
						get transpose () {return __get__ (this, function (self) {
							if (self.ndim == 1) {
								var result = array (self, dtype);
							}
							else {
								var result = empty (tuple ([self.ns_ncols, self.ns_nrows]), self.dtype);
								var itarget = 0;
								if (self.ns_complex) {
									for (var icol = 0; icol < self.ns_ncols; icol++) {
										var isource = icol;
										for (var irow = 0; irow < self.ns_nrows; irow++) {
											var isource = self.ns_ncols * irow + icol;
											result.imagbuf [itarget] = self.imagbuf [isource];
											result.realbuf [itarget++] = self.realbuf [isource];
											isource += self.ns_ncols;
										}
									}
								}
								else {
									for (var icol = 0; icol < self.ns_ncols; icol++) {
										var isource = icol;
										for (var irow = 0; irow < self.ns_nrows; irow++) {
											result.realbuf [itarget++] = self.realbuf [isource];
											isource += self.ns_ncols;
										}
									}
								}
							}
							return result;
						}, 'transpose');},
						get __getitem__ () {return __get__ (this, function (self, key) {
							if (self.ndim == 1) {
								if (type (key) == tuple) {
									if (key [1] == null) {
										key [1] = self.size;
									}
									else {
										if (key [1] < 0) {
											key [1] += self.size;
										}
									}
									var result = empty (list ([(key [1] - key [0]) / key [2]]), self.dtype);
									var itarget = 0;
									if (self.ns_complex) {
										var __iterator0__ = py_iter (range (...self.shape));
										while (true) {
											try {var isource = py_next (__iterator0__);} catch (exception) {break;}
											result.realbuf [itarget] = self.realbuf [isource];
											result.imagbuf [itarget++] = self.imagbuf [isource];
										}
									}
									else {
										var __iterator0__ = py_iter (range (...self.shape));
										while (true) {
											try {var isource = py_next (__iterator0__);} catch (exception) {break;}
											result.realbuf [itarget++] = self.realbuf [isource];
										}
									}
									return result;
								}
								else {
									if (self.ns_complex) {
										return complex (self.realbuf [key], self.imagbuf [key]);
									}
									else {
										return self.realbuf [key];
									}
								}
							}
							else {
								var rowkey = key [0];
								var colkey = key [1];
								var rowistup = type (rowkey) == tuple;
								var colistup = type (colkey) == tuple;
								if (rowistup) {
									if (rowkey [1] == null) {
										rowkey [1] = self.ns_nrows;
									}
									else {
										if (rowkey [1] < 0) {
											rowkey [1] += self.ns_nrows;
										}
									}
								}
								if (colistup) {
									if (colkey [1] == null) {
										colkey [1] = self.ns_ncols;
									}
									else {
										if (colkey [1] < 0) {
											colkey [1] += self.ns_ncols;
										}
									}
								}
								if (rowistup || colistup) {
									if (!(rowistup)) {
										var result = empty (tuple ([(colkey [1] - colkey [0]) / colkey [2]]), self.dtype);
										var itarget = 0;
										if (self.ns_complex) {
											var __iterator0__ = py_iter (range (...colkey));
											while (true) {
												try {var isourcecol = py_next (__iterator0__);} catch (exception) {break;}
												var isource = self.ns_ncols * rowkey + isourcecol;
												result.realbuf [itarget] = self.realbuf [isource];
												result.imagbuf [itarget++] = self.imagbuf [isource];
											}
										}
										else {
											var __iterator0__ = py_iter (range (...colkey));
											while (true) {
												try {var isourcecol = py_next (__iterator0__);} catch (exception) {break;}
												result.realbuf [itarget++] = self.realbuf [self.ns_ncols * rowkey + isourcecol];
											}
										}
									}
									else {
										if (!(colistup)) {
											var result = empty (tuple ([(rowkey [1] - rowkey [0]) / rowkey [2]]), self.dtype);
											var itarget = 0;
											if (self.ns_complex) {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var isourcerow = py_next (__iterator0__);} catch (exception) {break;}
													var isource = self.ns_ncols * isourcerow + colkey;
													result.realbuf [itarget] = self.realbuf [isource];
													result.imagbuf [itarget++] = self.imagbuf [isource];
												}
											}
											else {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var isourcerow = py_next (__iterator0__);} catch (exception) {break;}
													result.realbuf [itarget++] = self.realbuf [self.ns_ncols * isourcerow + colkey];
												}
											}
										}
										else {
											var result = empty (tuple ([(key [0] [1] - key [0] [0]) / key [0] [2], (key [1] [1] - key [1] [0]) / key [1] [2]]), self.dtype);
											var itarget = 0;
											if (self.ns_complex) {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var isourcerow = py_next (__iterator0__);} catch (exception) {break;}
													var __iterator1__ = py_iter (range (...colkey));
													while (true) {
														try {var isourcecol = py_next (__iterator1__);} catch (exception) {break;}
														var isource = self.ns_ncols * isourcerow + isourcecol;
														result.realbuf [itarget] = self.realbuf [isource];
														result.imagbuf [itarget++] = self.imagbuf [isource];
													}
												}
											}
											else {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var isourcerow = py_next (__iterator0__);} catch (exception) {break;}
													var __iterator1__ = py_iter (range (...colkey));
													while (true) {
														try {var isourcecol = py_next (__iterator1__);} catch (exception) {break;}
														result.realbuf [itarget++] = self.realbuf [self.ns_ncols * isourcerow + isourcecol];
													}
												}
											}
										}
									}
									return result;
								}
								else {
									if (self.ns_complex) {
										var isource = self.ns_ncols * key [0] + key [1];
										return complex (self.realbuf [isource], self.imagbuf [isource]);
									}
									else {
										return self.realbuf [self.ns_ncols * key [0] + key [1]];
									}
								}
							}
						}, '__getitem__');},
						get __setitem__ () {return __get__ (this, function (self, key, value) {
							if (self.ndim == 1) {
								if (type (key) == tuple) {
									if (key [1] == null) {
										key [1] = self.size;
									}
									else {
										if (key [1] < 0) {
											key [1] += self.size;
										}
									}
									var isource = 0;
									if (self.ns_complex) {
										var __iterator0__ = py_iter (range (...self.shape));
										while (true) {
											try {var itarget = py_next (__iterator0__);} catch (exception) {break;}
											self.realbuf [itarget] = value.realbuf [isource];
											self.imagbuf [itarget] = value.imagbuf [isource++];
										}
									}
									else {
										var __iterator0__ = py_iter (range (...self.shape));
										while (true) {
											try {var itarget = py_next (__iterator0__);} catch (exception) {break;}
											self.realbuf [itarget] = value.realbuf [isource++];
										}
									}
									return result;
								}
								else {
									if (self.ns_complex) {
										self.realbuf [key] = value.real;
										self.imagbuf [key] = value.imag;
									}
									else {
										self.realbuf [key] = value;
									}
								}
							}
							else {
								var rowkey = key [0];
								var colkey = key [1];
								var rowistup = type (rowkey) == tuple;
								var colistup = type (colkey) == tuple;
								if (rowistup) {
									if (rowkey [1] == null) {
										rowkey [1] = self.ns_nrows;
									}
									else {
										if (rowkey [1] < 0) {
											rowkey [1] += self.ns_nrows;
										}
									}
								}
								if (colistup) {
									if (colkey [1] == null) {
										colkey [1] = self.ns_ncols;
									}
									else {
										if (colkey [1] < 0) {
											colkey [1] += self.ns_ncols;
										}
									}
								}
								if (rowistup || colistup) {
									if (!(rowistup)) {
										var isource = 0;
										if (self.ns_complex) {
											var __iterator0__ = py_iter (range (...colkey));
											while (true) {
												try {var itargetcol = py_next (__iterator0__);} catch (exception) {break;}
												var itarget = self.ns_ncols * rowkey + itargetcol;
												self.realbuf [itarget] = value.realbuf [isource];
												self.imagbuf [itarget] = value.imagbuf [isource++];
											}
										}
										else {
											var __iterator0__ = py_iter (range (...colkey));
											while (true) {
												try {var itargetcol = py_next (__iterator0__);} catch (exception) {break;}
												result.realbuf [self.ns_ncols * rowkey + itargetcol] = self.realbuf [isource++];
											}
										}
									}
									else {
										if (!(colistup)) {
											var isource = 0;
											if (self.ns_complex) {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var itargetrow = py_next (__iterator0__);} catch (exception) {break;}
													var itarget = self.ns_ncols * itargetrow + colkey;
													self.realbuf [itarget] = value.realbuf [isource];
													self.imagbuf [itarget] = value.imagbuf [isource++];
												}
											}
											else {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var isourcerow = py_next (__iterator0__);} catch (exception) {break;}
													self.realbuf [self.ns_ncols * isourcerow + colkey] = value [isource++];
												}
											}
										}
										else {
											var isource = 0;
											if (self.ns_complex) {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var itargetrow = py_next (__iterator0__);} catch (exception) {break;}
													var __iterator1__ = py_iter (range (...colkey));
													while (true) {
														try {var itargetcol = py_next (__iterator1__);} catch (exception) {break;}
														var itarget = self.ns_ncols * itargetrow + itargetcol;
														self.realbuf [itarget] = value.realbuf [isource];
														self.imagbuf [itarget] = value.imagbuf [isource++];
													}
												}
											}
											else {
												var __iterator0__ = py_iter (range (...rowkey));
												while (true) {
													try {var isourcerow = py_next (__iterator0__);} catch (exception) {break;}
													var __iterator1__ = py_iter (range (...colkey));
													while (true) {
														try {var isourcecol = py_next (__iterator1__);} catch (exception) {break;}
														self.realbuf [self.ns_ncols * itargetrow + itargetcol] = value.realbuf [isource++];
													}
												}
											}
										}
									}
								}
								else {
									if (self.ns_complex) {
										var itarget = self.ns_ncols * key [0] + key [1];
										self.realbuf [itarget] = value.real;
										self.imagbuf [itarget] = value.imag;
									}
									else {
										self.realbuf [self.ns_ncols * key [0] + key [1]] = value;
									}
								}
							}
						}, '__setitem__');},
						get real () {return __get__ (this, function (self) {
							return ndarray (self.shape, ns_buffertype (self.dtype), self.realbuf);
						}, 'real');},
						get imag () {return __get__ (this, function (self) {
							return ndarray (self.shape, ns_buffertype (self.dtype), self.imagbuf);
						}, 'imag');},
						get __neg__ () {return __get__ (this, function (self) {
							var result = empty (self.shape, self.dtype);
							if (self.ns_complex) {
								for (var i = 0; i < self.size; i++) {
									result.realbuf [i] = -(self.realbuf [i]);
									result.imagbuf [i] = -(self.imagbuf [i]);
								}
							}
							else {
								for (var i = 0; i < self.size; i++) {
									result.realbuf [i] = -(self.realbuf [i]);
								}
							}
							return result;
						}, '__neg__');},
						get __ns_inv__ () {return __get__ (this, function (self) {
							var result = empty (self.shape, self.dtype);
							if (self.ns_complex) {
								for (var i = 0; i < self.size; i++) {
									var real = self.realbuf [i];
									var imag = self.imagbuf [i];
									var denom = real * real + imag * imag;
									result.realbuf [i] = real / denom;
									result.imagbuf [i] = -(imag) / denom;
								}
							}
							else {
								for (var i = 0; i < self.size; i++) {
									result.realbuf [i] = 1 / self.realbuf [i];
								}
							}
							return result;
						}, '__ns_inv__');},
						get __add__ () {return __get__ (this, function (self, other) {
							var result = empty (self.shape, self.dtype);
							if (type (other) == ndarray) {
								if (self.ns_complex) {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] + other.realbuf [i];
										result.imagbuf [i] = self.imagbuf [i] + other.imagbuf [i];
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] + other.realbuf [i];
									}
								}
							}
							else {
								if (self.ns_complex) {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] + other.real;
										result.imagbuf [i] = self.imagbuf [i] + other.imag;
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] + other;
									}
								}
							}
							return result;
						}, '__add__');},
						get __radd__ () {return __get__ (this, function (self, scalar) {
							return self.__add__ (scalar);
						}, '__radd__');},
						get __sub__ () {return __get__ (this, function (self, other) {
							var result = empty (self.shape, self.dtype);
							if (type (other) == ndarray) {
								if (self.ns_complex) {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] - other.realbuf [i];
										result.imagbuf [i] = self.imagbuf [i] - other.imagbuf [i];
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] - other.realbuf [i];
									}
								}
							}
							else {
								if (self.ns_complex) {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] - other.real;
										result.imagbuf [i] = self.imagbuf [i] - other.imag;
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] - other;
									}
								}
							}
							return result;
						}, '__sub__');},
						get __rsub__ () {return __get__ (this, function (self, scalar) {
							return self.__neg__ ().__add__ (scalar);
						}, '__rsub__');},
						get __mul__ () {return __get__ (this, function (self, other) {
							var result = empty (self.shape, self.dtype);
							if (type (other) == ndarray) {
								if (self.ns_complex) {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] * other.realbuf [i] - self.imagbuf [i] * other.imagbuf [i];
										result.imagbuf [i] = self.realbuf [i] * other.imagbuf [i] + self.imagbuf [i] * other.realbuf [i];
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] * other.realbuf [i];
									}
								}
							}
							else {
								if (self.ns_complex) {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] * other.real - self.imagbuf [i] * other.imag;
										result.imagbuf [i] = self.realbuf [i] * other.imag + self.imagbuf [i] * other.real;
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] * other;
									}
								}
							}
							return result;
						}, '__mul__');},
						get __rmul__ () {return __get__ (this, function (self, scalar) {
							return self.__mul__ (scalar);
						}, '__rmul__');},
						get __div__ () {return __get__ (this, function (self, other) {
							var result = empty (self.shape, self.dtype);
							if (type (other) == ndarray) {
								if (self.ns_complex) {
									for (var i = 0; i < self.size; i++) {
										var real = other.realbuf [i];
										var imag = other.imagbuf [i];
										var denom = real * real + imag * imag;
										result.realbuf [i] = (self.realbuf [i] * real + self.imagbuf [i] * imag) / denom;
										result.imagbuf [i] = (self.imagbuf [i] * real - self.realbuf [i] * imag) / denom;
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] / other.realbuf [i];
									}
								}
							}
							else {
								if (self.ns_complex) {
									var real = other.real;
									var imag = other.imag;
									var denom = real * real + imag * imag;
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = (self.realbuf [i] * real + self.imagbuf [i] * imag) / denom;
										result.imagbuf [i] = (self.imagbuf [i] * real - self.realbuf [i] * imag) / denom;
									}
								}
								else {
									for (var i = 0; i < self.size; i++) {
										result.realbuf [i] = self.realbuf [i] / other;
									}
								}
							}
							return result;
						}, '__div__');},
						get __rdiv__ () {return __get__ (this, function (self, scalar) {
							return self.__ns_inv__ ().__mul__ (scalar);
						}, '__rdiv__');},
						get __matmul__ () {return __get__ (this, function (self, other) {
							var result = empty (tuple ([self.ns_nrows, other.ns_ncols]), self.dtype);
							if (self.ns_complex) {
								var iresult = 0;
								for (var irow = 0; irow < self.ns_nrows; irow++) {
									for (var icol = 0; icol < other.ns_ncols; icol++) {
										result.realbuf [iresult] = 0;
										result.imagbuf [iresult] = 0;
										var iself = self.ns_ncols * irow;
										var iother = icol;
										for (var iterm = 0; iterm < self.ns_ncols; iterm++) {
											result.realbuf [iresult] += self.realbuf [iself] * other.realbuf [iother] - self.imagbuf [iself] * other.imagbuf [iother];
											result.imagbuf [iresult] += self.realbuf [iself] * other.imagbuf [iother] + self.imagbuf [iself++] * other.realbuf [iother];
											iother += other.ns_ncols;
										}
										iresult++;
									}
								}
							}
							else {
								var iresult = 0;
								for (var irow = 0; irow < self.ns_nrows; irow++) {
									for (var icol = 0; icol < other.ns_ncols; icol++) {
										result.realbuf [iresult] = 0;
										var iself = self.ns_ncols * irow;
										var iother = icol;
										for (var iterm = 0; iterm < self.ns_ncols; iterm++) {
											result.realbuf [iresult] += self.realbuf [iself++] * other.realbuf [iother];
											iother += other.ns_ncols;
										}
										iresult++;
									}
								}
							}
							return result;
						}, '__matmul__');}
					});
					var empty = function (shape, dtype) {
						if (typeof dtype == 'undefined' || (dtype != null && dtype .__class__ == __kwargdict__)) {;
							var dtype = 'float64';
						};
						var result = ndarray (shape, dtype);
						result.realbuf = ns_createbuf (false, dtype, result.size);
						result.imagbuf = ns_createbuf (true, dtype, result.size);
						return result;
					};
					var array = function (obj, dtype) {
						if (typeof dtype == 'undefined' || (dtype != null && dtype .__class__ == __kwargdict__)) {;
							var dtype = 'float64';
						};
						if (Array.isArray (obj)) {
							if (len (obj)) {
								if (Array.isArray (obj [0])) {
									var result = empty (tuple ([obj.length, obj [0].length]), dtype);
									var iresult = 0;
									if (result.ns_complex) {
										for (var irow = 0; irow < result.ns_nrows; irow++) {
											for (var icol = 0; icol < result.ns_ncols; icol++) {
												var element = complex (obj [irow] [icol]);
												result.realbuf [iresult] = element.real;
												result.imagbuf [iresult++] = element.imag;
											}
										}
									}
									else {
										for (var irow = 0; irow < result.ns_nrows; irow++) {
											for (var icol = 0; icol < result.ns_ncols; icol++) {
												result.realbuf [iresult++] = obj [irow] [icol];
											}
										}
									}
								}
								else {
									var result = empty (tuple ([obj.length]), dtype);
									if (result.ns_complex) {
										for (var i = 0; i < result.size; i++) {
											var element = complex (obj [i]);
											result.realbuf [i] = element.real;
											result.imagbuf [i] = element.imag;
										}
									}
									else {
										for (var i = 0; i < result.size; i++) {
											result.realbuf [i] = obj [i];
										}
									}
								}
							}
							else {
								var result = empty (tuple ([0]), dtype);
							}
						}
						else {
							var result = empty (obj.shape, dtype);
							result.realbuf.set (obj.realbuf);
							if (obj.ns_complex) {
								result.imagbuf.set (obj.imagbuf);
							}
						}
						return result;
					};
					var copy = function (obj) {
						return array (obj, obj.dtype);
					};
					var hsplit = function (ary, nparts) {
						var result = function () {
							var __accu0__ = [];
							for (var ipart = 0; ipart < nparts; ipart++) {
								__accu0__.append (empty (tuple ([ary.ns_nrows, ary.ns_ncols / nparts]), ary.dtype));
							}
							return __accu0__;
						} ();
						var isource = 0;
						if (ary.ns_complex) {
							for (var irow = 0; irow < ary.ns_nrows; irow++) {
								var __iterator0__ = py_iter (result);
								while (true) {
									try {var part = py_next (__iterator0__);} catch (exception) {break;}
									var itarget = part.ns_ncols * irow;
									for (var icol = 0; icol < part.ns_ncols; icol++) {
										part.realbuf [itarget] = ary.realbuf [isource];
										part.imagbuf [itarget++] = ary.imagbuf [isource++];
									}
								}
							}
						}
						else {
							for (var irow = 0; irow < ary.ns_nrows; irow++) {
								var __iterator0__ = py_iter (result);
								while (true) {
									try {var part = py_next (__iterator0__);} catch (exception) {break;}
									var itarget = part.ns_ncols * irow;
									for (var icol = 0; icol < part.ns_ncols; icol++) {
										part.realbuf [itarget++] = ary.realbuf [isource++];
									}
								}
							}
						}
						return result;
					};
					var vsplit = function (ary, nparts) {
						var result = function () {
							var __accu0__ = [];
							for (var ipart = 0; ipart < nparts; ipart++) {
								__accu0__.append (empty (tuple ([ary.ns_nrows / nparts, ary.ns_ncols]), array.dtype));
							}
							return __accu0__;
						} ();
						var isource = 0;
						if (ary.ns_complex) {
							var __iterator0__ = py_iter (result);
							while (true) {
								try {var part = py_next (__iterator0__);} catch (exception) {break;}
								for (var itarget = 0; itarget < part.size; itarget++) {
									part.realbuf [itarget] = ary.realbuf [isource];
									part.imagbuf [itarget] = ary.imagbuf [isource++];
								}
							}
						}
						else {
							var __iterator0__ = py_iter (result);
							while (true) {
								try {var part = py_next (__iterator0__);} catch (exception) {break;}
								for (var itarget = 0; itarget < part.size; itarget++) {
									part.realbuf [itarget] = ary.realbuf [isource++];
								}
							}
						}
						return result;
					};
					var hstack = function (tup) {
						var ncols = 0;
						var __iterator0__ = py_iter (tup);
						while (true) {
							try {var part = py_next (__iterator0__);} catch (exception) {break;}
							ncols += part.ns_ncols;
						}
						var result = empty (tuple ([tup [0].ns_nrows, ncols]), tup [0].dtype);
						var itarget = 0;
						if (result.ns_complex) {
							for (var irow = 0; irow < result.ns_nrows; irow++) {
								var __iterator0__ = py_iter (tup);
								while (true) {
									try {var part = py_next (__iterator0__);} catch (exception) {break;}
									var isource = part.ns_ncols * irow;
									for (var icol = 0; icol < part.ns_ncols; icol++) {
										result.realbuf [itarget] = part.realbuf [isource];
										result.imagbuf [itarget++] = part.imagbuf [isource++];
									}
								}
							}
						}
						else {
							for (var irow = 0; irow < result.ns_nrows; irow++) {
								var __iterator0__ = py_iter (tup);
								while (true) {
									try {var part = py_next (__iterator0__);} catch (exception) {break;}
									var isource = part.ns_ncols * irow;
									for (var icol = 0; icol < part.ns_ncols; icol++) {
										result.realbuf [itarget++] = part.realbuf [isource++];
									}
								}
							}
						}
						return result;
					};
					var vstack = function (tup) {
						var nrows = 0;
						var __iterator0__ = py_iter (tup);
						while (true) {
							try {var part = py_next (__iterator0__);} catch (exception) {break;}
							nrows += part.ns_nrows;
						}
						var result = empty (tuple ([nrows, tup [0].ns_ncols]), tup [0].dtype);
						var itarget = 0;
						if (result.ns_complex) {
							var __iterator0__ = py_iter (tup);
							while (true) {
								try {var part = py_next (__iterator0__);} catch (exception) {break;}
								for (var isource = 0; isource < part.size; isource++) {
									result.realbuf [itarget] = part.realbuf [isource];
									result.imagbuf [itarget++] = part.imagbuf [isource];
								}
							}
						}
						else {
							var __iterator0__ = py_iter (tup);
							while (true) {
								try {var part = py_next (__iterator0__);} catch (exception) {break;}
								for (var isource = 0; isource < part.size; isource++) {
									result.realbuf [itarget++] = part.realbuf [isource];
								}
							}
						}
						return result;
					};
					var round = function (a, decimals) {
						if (typeof decimals == 'undefined' || (decimals != null && decimals .__class__ == __kwargdict__)) {;
							var decimals = 0;
						};
						var result = empty (a.shape, a.dtype);
						if (a.ns_complex) {
							for (var i = 0; i < a.size; i++) {
								result.realbuf [i] = a.realbuf [i].toFixed (decimals);
								result.imagbuf [i] = a.imagbuf [i].toFixed (decimals);
							}
						}
						else {
							for (var i = 0; i < a.size; i++) {
								result.realbuf [i] = a.realbuf [i].toFixed (decimals);
							}
						}
						return result;
					};
					var zeros = function (shape, dtype) {
						if (typeof dtype == 'undefined' || (dtype != null && dtype .__class__ == __kwargdict__)) {;
							var dtype = 'float64';
						};
						var result = empty (shape, dtype);
						if (result.ns_complex) {
							for (var i = 0; i < result.size; i++) {
								result.realbuf [i] = 0;
								result.imagbuf [i] = 0;
							}
						}
						else {
							for (var i = 0; i < result.size; i++) {
								result.realbuf [i] = 0;
							}
						}
						return result;
					};
					var ones = function (shape, dtype) {
						if (typeof dtype == 'undefined' || (dtype != null && dtype .__class__ == __kwargdict__)) {;
							var dtype = 'float64';
						};
						var result = empty (shape, dtype);
						if (result.ns_complex) {
							for (var i = 0; i < result.size; i++) {
								result.realbuf [i] = 1;
								result.imagbuf [i] = 0;
							}
						}
						else {
							for (var i = 0; i < result.size; i++) {
								result.realbuf [i] = 1;
							}
						}
						return result;
					};
					var identity = function (n, dtype) {
						if (typeof dtype == 'undefined' || (dtype != null && dtype .__class__ == __kwargdict__)) {;
							var dtype = 'float64';
						};
						var result = zeros (tuple ([n, n]), dtype);
						var i = 0;
						var shift = n + 1;
						for (var j = 0; j < n; j++) {
							result.realbuf [i] = 1;
							i += shift;
						}
						return result;
					};
					__pragma__ ('<use>' +
						'itertools' +
					'</use>')
					__pragma__ ('<all>')
						__all__.array = array;
						__all__.copy = copy;
						__all__.empty = empty;
						__all__.hsplit = hsplit;
						__all__.hstack = hstack;
						__all__.identity = identity;
						__all__.ndarray = ndarray;
						__all__.ns_buffertype = ns_buffertype;
						__all__.ns_complex = ns_complex;
						__all__.ns_complextype = ns_complextype;
						__all__.ns_createbuf = ns_createbuf;
						__all__.ns_ctors = ns_ctors;
						__all__.ones = ones;
						__all__.round = round;
						__all__.vsplit = vsplit;
						__all__.vstack = vstack;
						__all__.zeros = zeros;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'numscrypt.linalg', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var ns =  __init__ (__world__.numscrypt);
					var inv = function (a) {
						if (a.ns_complex) {
							return cinv (a);
						}
						else {
							return rinv (a);
						}
					};
					var rinv = function (a) {
						var b = ns.hstack (tuple ([a, ns.identity (a.shape [0], a.dtype)]));
						var real = b.realbuf;
						var __left0__ = b.shape;
						var nrows = __left0__ [0];
						var ncols = __left0__ [1];
						for (var ipiv = 0; ipiv < nrows; ipiv++) {
							if (!(real [ipiv * ncols + ipiv])) {
								for (var irow = ipiv + 1; irow < nrows; irow++) {
									if (real [irow * ncols + ipiv]) {
										for (var icol = 0; icol < ncols; icol++) {
											var t = real [irow * ncols + icol];
											real [irow * ncols + icol] = b [ipiv * ncols + icol];
											real [ipiv * ncols + icol] = t;
										}
										break;
									}
								}
							}
							var piv = real [ipiv * ncols + ipiv];
							for (var icol = ipiv; icol < ncols; icol++) {
								real [ipiv * ncols + icol] /= piv;
							}
							for (var irow = 0; irow < nrows; irow++) {
								if (irow != ipiv) {
									var factor = real [irow * ncols + ipiv];
									for (var icol = 0; icol < ncols; icol++) {
										real [irow * ncols + icol] -= factor * real [ipiv * ncols + icol];
									}
								}
							}
						}
						return ns.hsplit (b, 2) [1];
					};
					var cinv = function (a) {
						var b = ns.hstack (tuple ([a, ns.identity (a.shape [0], a.dtype)]));
						var real = b.realbuf;
						var imag = b.imagbuf;
						var __left0__ = b.shape;
						var nrows = __left0__ [0];
						var ncols = __left0__ [1];
						for (var ipiv = 0; ipiv < nrows; ipiv++) {
							var ipiv_flat = ipiv * ncols + ipiv;
							if (!(real [ipiv_flat] || imag [ipiv_flat])) {
								for (var irow = ipiv + 1; irow < nrows; irow++) {
									var iswap = irow * ncols + ipiv;
									if (real [iswap] || imag [iswap]) {
										for (var icol = 0; icol < ncols; icol++) {
											var isource = irow * ncols + icol;
											var itarget = ipiv * ncols + icol;
											var t = real [isource];
											real [isource] = real [itarget];
											real [itarget] = t;
											var t = imag [isource_flat];
											imag [isource] = imag [itarget];
											imag [itarget] = t;
										}
										break;
									}
								}
							}
							var pivre = real [ipiv_flat];
							var pivim = imag [ipiv_flat];
							var denom = pivre * pivre + pivim * pivim;
							for (var icol = ipiv; icol < ncols; icol++) {
								var icur = ipiv * ncols + icol;
								var oldre = real [icur];
								var oldim = imag [icur];
								real [icur] = (oldre * pivre + oldim * pivim) / denom;
								imag [icur] = (oldim * pivre - oldre * pivim) / denom;
							}
							for (var irow = 0; irow < nrows; irow++) {
								if (irow != ipiv) {
									var ifac = irow * ncols + ipiv;
									var facre = real [ifac];
									var facim = imag [ifac];
									for (var icol = 0; icol < ncols; icol++) {
										var itarget = irow * ncols + icol;
										var isource = ipiv * ncols + icol;
										var oldre = real [isource];
										var oldim = imag [isource];
										real [itarget] -= facre * oldre - facim * oldim;
										imag [itarget] -= facre * oldim + facim * oldre;
									}
								}
							}
						}
						return ns.hsplit (b, 2) [1];
					};
					__pragma__ ('<use>' +
						'numscrypt' +
					'</use>')
					__pragma__ ('<all>')
						__all__.cinv = cinv;
						__all__.inv = inv;
						__all__.rinv = rinv;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'numscrypt.random', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var ns =  __init__ (__world__.numscrypt);
					var rand = function () {
						var dims = tuple ([].slice.apply (arguments).slice (0));
						var result = ns.empty (dims, 'float64');
						for (var i = 0; i < result.size; i++) {
							result.realbuf [i] = Math.random ();
						}
						return result;
					};
					__pragma__ ('<use>' +
						'numscrypt' +
					'</use>')
					__pragma__ ('<all>')
						__all__.rand = rand;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'random', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var _array = function () {
						var __accu0__ = [];
						for (var i = 0; i < 624; i++) {
							__accu0__.append (0);
						}
						return __accu0__;
					} ();
					var _index = 0;
					var _bitmask1 = Math.pow (2, 32) - 1;
					var _bitmask2 = Math.pow (2, 31);
					var _bitmask3 = Math.pow (2, 31) - 1;
					var _fill_array = function () {
						for (var i = 0; i < 624; i++) {
							var y = (_array [i] & _bitmask2) + (_array [(i + 1) % 624] & _bitmask3);
							_array [i] = _array [(i + 397) % 624] ^ y >> 1;
							if (y % 2 != 0) {
								_array [i] ^= 2567483615;
							}
						}
					};
					var _random_integer = function () {
						if (_index == 0) {
							_fill_array ();
						}
						var y = _array [_index];
						y ^= y >> 11;
						y ^= y << 7 & 2636928640;
						y ^= y << 15 & 4022730752;
						y ^= y >> 18;
						_index = (_index + 1) % 624;
						return y;
					};
					var seed = function (x) {
						if (typeof x == 'undefined' || (x != null && x .__class__ == __kwargdict__)) {;
							var x = int (_bitmask3 * Math.random ());
						};
						_array [0] = x;
						for (var i = 1; i < 624; i++) {
							_array [i] = (1812433253 * _array [i - 1] ^ (_array [i - 1] >> 30) + i) & _bitmask1;
						}
					};
					var randint = function (a, b) {
						return a + _random_integer () % ((b - a) + 1);
					};
					var choice = function (seq) {
						return seq [randint (0, len (seq) - 1)];
					};
					var random = function () {
						return _random_integer () / _bitmask3;
					};
					seed ();
					__pragma__ ('<all>')
						__all__._array = _array;
						__all__._bitmask1 = _bitmask1;
						__all__._bitmask2 = _bitmask2;
						__all__._bitmask3 = _bitmask3;
						__all__._fill_array = _fill_array;
						__all__._index = _index;
						__all__._random_integer = _random_integer;
						__all__.choice = choice;
						__all__.randint = randint;
						__all__.random = random;
						__all__.seed = seed;
					__pragma__ ('</all>')
				}
			}
		}
	);
	(function () {
		var __symbols__ = ['__complex__', '__esv6__'];
		var random = {};
		var num =  __init__ (__world__.numscrypt);
		var num_rand =  __init__ (__world__.numscrypt.random);
		var linalg =  __init__ (__world__.numscrypt.linalg);
		__nest__ (random, '', __init__ (__world__.random));
		var result = '';
		var __iterator0__ = py_iter (tuple ([false, true]));
		while (true) {
			try {var useComplex = py_next (__iterator0__);} catch (exception) {break;}
			var __iterator1__ = py_iter (tuple ([false, true]));
			while (true) {
				try {var transpose = py_next (__iterator1__);} catch (exception) {break;}
				if (useComplex) {
					var a = num.array (function () {
						var __accu0__ = [];
						for (var iRow = 0; iRow < 30; iRow++) {
							__accu0__.append (function () {
								var __accu1__ = [];
								for (var iCol = 0; iCol < 30; iCol++) {
									__accu1__.append (complex (random.random (), random.random ()));
								}
								return __accu1__;
							} ());
						}
						return __accu0__;
					} (), 'complex128');
				}
				else {
					var a = num_rand.rand (30, 30);
				}
				var timeStartTranspose = new Date ();
				if (transpose) {
					var a = a.transpose ();
				}
				var timeStartInv = new Date ();
				var ai = linalg.inv (a);
				var timeStartMul = new Date ();
				var id = __matmul__ (a, ai);
				var timeStartScalp = new Date ();
				var sp = __mul__ (a, a);
				var timeStartDiv = new Date ();
				var sp = __div__ (a, a);
				var timeStartAdd = new Date ();
				var sp = __add__ (a, a);
				var timeStartSub = new Date ();
				var sp = __sub__ (a, a);
				var timeEnd = new Date ();
				result += '\n<pre>\na @ ai [0:5, 0:5] =\n\n{}\n'.format (str (num.round (id.__getitem__ ([tuple ([0, 5, 1]), tuple ([0, 5, 1])]), 2)).py_replace (' ', '\t'));
				if (transpose) {
					result += '\nTranspose took: {} ms'.format (timeStartInv - timeStartTranspose);
				}
				result += '\nInverse took: {} ms\nMatrix product (@) took: {} ms\nElementwise product (*) took: {} ms\nDivision took: {} ms\nAddition took: {} ms\nSubtraction took: {} ms\n</pre>\n'.format (timeStartMul - timeStartInv, timeStartScalp - timeStartMul, timeStartDiv - timeStartScalp, timeStartAdd - timeStartDiv, timeStartSub - timeStartAdd, timeEnd - timeStartSub);
			}
		}
		document.getElementById ('result').innerHTML = result;
		__pragma__ ('<use>' +
			'numscrypt' +
			'numscrypt.linalg' +
			'numscrypt.random' +
			'random' +
		'</use>')
		__pragma__ ('<all>')
			__all__.a = a;
			__all__.ai = ai;
			__all__.id = id;
			__all__.result = result;
			__all__.sp = sp;
			__all__.timeEnd = timeEnd;
			__all__.timeStartAdd = timeStartAdd;
			__all__.timeStartDiv = timeStartDiv;
			__all__.timeStartInv = timeStartInv;
			__all__.timeStartMul = timeStartMul;
			__all__.timeStartScalp = timeStartScalp;
			__all__.timeStartSub = timeStartSub;
			__all__.timeStartTranspose = timeStartTranspose;
			__all__.transpose = transpose;
			__all__.useComplex = useComplex;
		__pragma__ ('</all>')
	}) ();
	return __all__;
}
window ['test'] = test ();