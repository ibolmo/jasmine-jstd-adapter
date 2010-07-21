/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author ibolmo@gmail.com (Olmo Maldonado)
 * @author misko@hevery.com (Misko Hevery)
 */

(function() {

  var currentFrame = frame(null, null);

  function frame(parent, name){
  	var caseName = '';
  	if (parent && parent.caseName) caseName = parent.caseName + ' ';
  	if (name) caseName += name;

	var before = [],
		after = [];

    return {
      name: name,
      caseName: caseName,
      parent: parent,
      testCase: TestCase(caseName),
      before: before,
      after: after,
      runBefore: function(){
        if (parent) parent.runBefore.apply(this);
        for (var i = 0, l = before.length; i < l; i++) before[i].apply(this);
      },
      runAfter: function(){
        for (var i = 0, l = after.length; i < l; i++) after[i].apply(this);
        if (parent) parent.runAfter.apply(this);
      }
    };
  };

  jasmine.Env.prototype.describe = (function(describe){

    return function(description, context){
      currentFrame = frame(currentFrame, description);
      var result = describe.call(this, description, context);
      currentFrame = currentFrame.parent;
      return result;
    };

  })(jasmine.Env.prototype.describe);


  jasmine.Env.prototype.it = (function(it){
  	
    return function(description, closure){
      var result = it.call(this, description, closure);
      var currentSpec = this.currentSpec;
      var frame = this.jstdFrame = currentFrame;
      this.jstdFrame.testCase.prototype['test that it ' + description] = function(){
        frame.runBefore.apply(currentSpec);
        try {
          closure.apply(currentSpec);
        } finally {
          frame.runAfter.apply(currentSpec);
        }
      };
      return result;
    };

  })(jasmine.Env.prototype.it);


  jasmine.Env.prototype.beforeEach = (function(beforeEach){
  	
    return function(closure) {
      beforeEach.call(this, closure);
      currentFrame.before.push(closure);
    };

  })(jasmine.Env.prototype.beforeEach);


  jasmine.Env.prototype.afterEach = (function(afterEach){
  	
    return function(closure) {
      afterEach.call(this, closure);
      currentFrame.after.push(closure);
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

})();
