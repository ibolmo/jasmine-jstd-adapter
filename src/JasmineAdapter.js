/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author ibolmo@gmail.com (Olmo Maldonado)
 */

jasmine.Env.prototype.describe = (function(describe){

	return function(description, specDefinitions){
		this.currentTestCase = TestCase(description);
		describe.call(this, description, specDefinitions);
		console.log('describe', this.currentTestCase);
	};

})(jasmine.Env.prototype.describe);


jasmine.Env.prototype.it = (function(it){

	return function(desc, func){
		it.call(this, desc, func);
		this.currentTestCase.prototype['test that it ' + desc] = func;
	};

})(jasmine.Env.prototype.it);


jasmine.Matchers.prototype.toBe = function(expected){
	return assertSame(expected, this.actual);
};

jasmine.Matchers.prototype.toNotBe = function(expected){
	return assertNotSame(expected, this.actual);
};

jasmine.Matchers.prototype.toEqual = function(expected){
	return assertEquals(expected, this.actual);
};

jasmine.Matchers.prototype.toNotEqual = function(expected){
	return assertNotEquals(expected, this.actual);
};

jasmine.Matchers.prototype.toMatch = function(expected){
	return assertMatch(expected, this.actual);
};

jasmine.Matchers.prototype.toNotMatch = function(expected){
	return assertNotMatch(expected, this.actual);
};

jasmine.Matchers.prototype.toBeDefined = function(){
	return assertNotUndefined(this.actual);
};

jasmine.Matchers.prototype.toBeUndefined = function(){
	return assertUndefined(this.actual);
};

jasmine.Matchers.prototype.toBeNull = function(){
	return assertNull(this.actual)
};

jasmine.Matchers.prototype.toBeTruthy = function(){
	return assertTruthy(this.actual);
};

jasmine.Matchers.prototype.toBeFalsy = function(){
	return assertFalsey(this.actual);
};

// Reset environment with overriden methods.
jasmine.currentEnv_ = null;
jasmine.getEnv();


// Assertions Extensions
assertNotEquals = function(msg, expected, actual){
	try {
		assertEquals(expected, actual);
	    fail(msg + 'expected ' + prettyPrintEntity_(expected) + ' is actual ' + prettyPrintEntity_(actual))
	} catch(e){
		return true;
	}
};

assertMatch = function(msg, expected, actual){
	return new RegExp(expected).test(actual) || fail(msg + 'actual ' + prettyPrintEntity_(actual) + ' did not match expected ' + prettyPrintEntity_(expected));
};

assertNotMatch = function(msg, expected, actual){
	try {
		assertMatch(expected, actual);
		fail(msg + 'actual ' + prettyPrintEntity_(actual) + ' did matched expected ' + prettyPrintEntity_(expected));
	} catch(e){
		return true;
	}
};

assertTruthy = function(msg, actual){
	return !!actual || fail(msg + 'actual ' + prettyPrintEntity_(actual) + ' is not truthy');
};

assertFalsey = function(msg, actual){
	return !actual || fail(msg + 'actual ' + prettyPrintEntity_(actual) + ' is not falsey');
};