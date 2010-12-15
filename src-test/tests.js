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

describe("matchers", function(){

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


var specs = [];

describe('root describe', function() {
  it('nested it', function() {
    specs.push('nested it');
  });
});


describe('root describe with iit', function() {
  it('it as iit sibling', function() {
    specs.push('it as iit sibling');
  });

  iit('nested iit', function() {
    specs.push('nested iit');
  });
});


describe('describe that follows iit with a nested it', function() {
  it('nested it after iit', function() {
    specs.push('nested it after iit');
  });
});


describe('describe with iit followed by it', function() {
  iit('iit that preceeds an it', function() {
    specs.push('iit that preceeds an it');
  });

  it('it that follows an iit', function() {
    specs.push('it that follows an iit');
  });
});


describe('test summary', function() {
  iit('should have executed all iit tests and nothing else', function() {
    expect(specs).toEqual(['nested iit', 'iit that preceeds an it']);
  });
});

})();
