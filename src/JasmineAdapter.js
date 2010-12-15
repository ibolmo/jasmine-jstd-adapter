/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author misko@hevery.com (Misko Hevery)
 */

(function(window) {
  var testNameFilter;
  var describePath = [];
  var exclusive = {
      count: 0
  };
  function exclusiveRemove(name) {
    var name = describePath.join(' ') + ':' + (name||'');
    if (exclusive[name]) {
      exclusive.count--;
      delete exclusive[name];
    }
  }
  function exclusiveAdd(name) {
    var name = describePath.join(' ') + ':' + (name||'');
    if (!exclusive[name]) {
      exclusive.count++;
      exclusive[name] = true;
    }
  }
  window.it = function(name, fn){
    exclusiveRemove(name);
    jasmine.getEnv().it(name, fn);
  };
  window.iit = function(name, fn){
    exclusiveAdd(name);
    jasmine.getEnv().it(name, fn);
  };
  window.describe = function(name, fn){
    try {
      describePath.push(name);
      exclusiveRemove();
      jasmine.getEnv().describe(name, fn);
    } finally {
      describePath.pop(name);
    }
  };
  window.ddescribe = function(name, fn){
    try {
      describePath.push(name);
      exclusiveAdd();
      jasmine.getEnv().describe(name, fn);
    } finally {
      describePath.pop(name);
    }
  };
  var jasminePlugin = {
      name:'jasmine',
      getTestRunsConfigurationFor:function(testCaseInfos, filterExpressions, testRunsConfiguration) {
        testNameFilter = function(name){
          return !filterExpressions ||
            filterExpressions == 'all' ||
            filterExpressions == '*' ||
            name.indexOf(filterExpressions) > -1;
        };
        var describe = new jstestdriver.TestCaseInfo('jasmine runner', function(){});
        testRunsConfiguration.push(new jstestdriver.TestRunConfiguration(describe, []));
      },
      runTestConfiguration: function(testRunConfiguration, onTestDone, onTestRunConfigurationComplete){
        var jasmineEnv = jasmine.getEnv();
        var specLog = jstestdriver.console.log_ = [];
        var start;
        jasmineEnv.specFilter = function(spec) {
          var name = spec.suite.getFullName() + ':';
          var fullName = name + spec.description;
          return testNameFilter(fullName) && 
            (!exclusive.count || exclusive[name] || exclusive[fullName]);
        };
        jasmineEnv.reporter = {
          log: function(str){
            specLog.push(str);
          },

          reportRunnerStarting: function(runner) { },

          reportSpecStarting: function(spec) {
            specLog = jstestdriver.console.log_ = [];
            start = new Date().getTime();
          },

          reportSpecResults: function(spec) {
            var suite = spec.suite;
            var results = spec.results();
            if (results.skipped) return;
            var end = new Date().getTime();
            var messages = [];
            var resultItems = results.getItems();
            var state = 'passed';
            for ( var i = 0; i < resultItems.length; i++) {
              if (!resultItems[i].passed()) {
                state = resultItems[i].message.match(/AssertionError:/) ? 'error' : 'failed';
                messages.push(resultItems[i].toString());
                messages.push(resultItems[i].trace.stack);
              }
            }
            onTestDone(
              new jstestdriver.TestResult(
                suite.getFullName(), 
                spec.description, 
                state, 
                messages.join('\n'), 
                specLog.join('\n'),
                end - start));
          },

          reportSuiteResults: function(suite) {},
          
          reportRunnerResults: function(runner) {
            onTestRunConfigurationComplete();
          }
        };
        jasmineEnv.execute();
        return true;
      },
      onTestsFinish: function(){}
  };
  jstestdriver.pluginRegistrar.register(jasminePlugin);
})(window);

// Patch Jasmine for proper stack traces
jasmine.Spec.prototype.fail = function (e) {
  var expectationResult = new jasmine.ExpectationResult({
    passed: false,
    message: e ? jasmine.util.formatException(e) : 'Exception'
  });
  // PATCH
  if (e) {
    expectationResult.trace = e;
  }
  this.results_.addResult(expectationResult);
};
