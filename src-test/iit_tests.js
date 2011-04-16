(function(){

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