(function(){

var depth;

beforeEach(function(){
  depth = 1;
});

afterEach(function(){
  expect(depth).toEqual(1);
});

describe('describe', function(){
  beforeEach(function(){
	depth++;
  });

  afterEach(function(){
	depth--;
  });

  it('should map it', function(){
	expect(depth).toEqual(2);
  });

  describe('nested', function(){
	beforeEach(function(){
	  depth++;
	});

	afterEach(function(){
	  depth--;
	});

	it('should exectue nested', function(){
	  expect(depth).toEqual(3);
	});
  });
});

describe('matchers', function(){

  beforeEach(function(){
	this.addMatchers({
	  toBePersonNamed: function(name){
		return this.actual == name;
	  }
	});
  });

  it('should work across multiple tests', function(){
	expect('misko').toBePersonNamed('misko');
  });

  it('should allow a creation of new matcher', function(){
	this.addMatchers({
	  toBeMe: function(){
		return this.actual == 'misko';
	  }
	});
	this.addMatchers({
	  toBeMe2: function(arg){
		return this.actual == arg;
	  }
	});
	expect('misko').toBeMe();
	expect('misko').toBeMe2('misko');
	expect('adam').toBePersonNamed('adam');
  });
});

describe('runs', function(){
  it('should execute a runs block', function(){
	runs(function(){
	  this.runsFunction = function(){
		return true;
	  };
	  spyOn(this, 'runsFunction');
	});

	runs(function(){
	  this.runsFunction();
	});

	runs(function(){
	  expect(this.runsFunction).wasCalled();
	});
  });
});
  
var ran = false;
xdescribe('should not execute', function(){
	it('no-op', function(){
		ran = true;
	});
});

describe('should not have run', function(){
	it('should still be false', function(){
		expect(ran).toBe(false);
	});
});

xdescribe('a failing suite, ignore', function(){
	it('should fail', function(){
		expect(false).toBe(true);
	});
	
	describe('nested failure', function(){
		it('1 + 1 != 2', function(){
			expect(1 + 1).toNotBe(2);
		});
	});
});

describe('should support multiple spies and subsequent actual calls', function(){
	var testObject = {
		functionToBeSpied : function(){
			return -1;
		},

		caller : function(){
			return this.functionToBeSpied();
		}
	};

	it('first test case to spy the function', function(){
		spyOn(testObject, 'functionToBeSpied').andReturn(7);
		expect(testObject.caller()).toEqual(7);
	});

	it('second test case to spy the function', function(){
		spyOn(testObject, 'functionToBeSpied').andReturn(70);
		expect(testObject.caller()).toEqual(70);
	});

	it('last test case which calls the actual function', function(){
		expect(testObject.caller()).toEqual(-1);
	});
});

describe("jasmine#Waits", function() {
	var interval = 200;
	var now = +new Date();	
	it('waits for async assertions', function() {
		waits(interval);
		runs(function() {
			expect(+new Date() - now).toBeGreaterThan(interval);
		});
	});
});

})();
