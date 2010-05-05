var depth;

beforeEach(function(){
  depth = 1;
});

afterEach(function(){
  expect(depth).toEqual(1);
});

describe('describe', function(){
  beforeEach(function(){
    depth ++;
  });

  afterEach(function(){
    depth--;
  });

  it('should map it', function(){
    expect(depth).toEqual(2);
  });

  describe('nested', function(){
    beforeEach(function(){
      depth ++;
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
      toBeMe: function(arg){
        return this.actual == 'misko';
      }
    });
    this.addMatchers({
      toBeMe2: function(arg){
        return this.actual == 'misko';
      }
    });
    expect('misko').toBeMe();
    expect('misko').toBeMe2();
    expect('adam').toBePersonNamed('adam');
  });
});
