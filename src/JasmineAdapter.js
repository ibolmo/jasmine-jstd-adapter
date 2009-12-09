/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author ibolmo@gmail.com (Olmo Maldonado)
 */


jasmine.Env.prototype.describe = (function(describe){

	// TODO(ibolmo): Support nested describes.
	return function(description, specDefinitions){
		this.currentTestCase = TestCase(description);
		return describe.call(this, description, specDefinitions);
	};

})(jasmine.Env.prototype.describe);


jasmine.Env.prototype.it = (function(it){

	return function(desc, func){
		var spec = it.call(this, desc, func);
		this.currentTestCase.prototype['test that it ' + desc] = func;
		return spec;
	};

})(jasmine.Env.prototype.it);


jasmine.Env.prototype.beforeEach = (function(beforeEach){

	// TODO(ibolmo): Support beforeEach TestCase.
	return function(beforeEachFunction) {
		beforeEach.call(this, beforeEachFunction);
		this.currentTestCase.prototype.setUp = beforeEachFunction;
	};

})(jasmine.Env.prototype.beforeEach);


jasmine.Env.prototype.afterEach = (function(afterEach){

	// TODO(ibolmo): Support afterEach TestCase.
	return function(afterEachFunction) {
		afterEach.call(this, afterEachFunction);
		this.currentTestCase.prototype.tearDown = afterEachFunction;
	};

})(jasmine.Env.prototype.afterEach);


jasmine.NestedResults.prototype.addResult = (function(addResult){

	return function(result) {
		addResult.call(this, result);
		if (result.type != 'MessageResult' && !result.passed()) fail(result.message);
	};

})(jasmine.NestedResults.prototype.addResult);


// Reset environment with overriden methods.
jasmine.currentEnv_ = null;
jasmine.getEnv();
