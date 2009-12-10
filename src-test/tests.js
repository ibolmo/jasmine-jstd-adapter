var decrement = 0;
var mult = 1;

beforeEach(function(){
	decrement--;
});

afterEach(function(){
	mult *= 2;
});

describe('Example', function(){

	var increment = 0;
	var list = [];

	beforeEach(function(){
		increment++;
	});

	afterEach(function(){
		list.push(0);
	});

	it('should pass', function(){
		expect(0).toBe(0);
	});

	it('should fail', function(){
		expect(0).toBe(1);
	});

	it('beforeEach should have incremented', function(){
		expect(increment).toBe(3);
	});

	it('afterEach should have appended an element to the list', function(){
		expect(list.length).toBe(3);
	});

});

describe('Another example', function(){

	it('should pass again', function(){
		expect(0).toBe(0);
	});

});

describe('beforeEach and afterEach example', function(){

	it('beforeEach suite should decrement', function(){
		expect(decrement).toBe(-3);
	});

	it('afterEach suite should multiply', function(){
		expect(mult).toBe(4);
	});

});
