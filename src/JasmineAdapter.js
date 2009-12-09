/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author ibolmo@gmail.com (Olmo Maldonado)
 */

jasmine.Env.prototype.describe = (function(describe){

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

jasmine.NestedResults.prototype.addResult = (function(addResult){

	return function(result) {
		addResult.call(this, result);
		if (result.type != 'MessageResult') {
			if (!result.passed()) fail(result.message);
		}
	};

})(jasmine.NestedResults.prototype.addResult);

// Reset environment with overriden methods.
jasmine.currentEnv_ = null;
jasmine.getEnv();
