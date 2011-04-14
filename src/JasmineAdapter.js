/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author misko@hevery.com (Misko Hevery)
 * @author olmo.maldonado@gmail.com (Olmo Maldonado)
 */
(function(){

var Reporter = function(onTestDone, onTestRunConfigurationComplete){
	this.onTestDone = onTestDone;
	this.onTestRunConfigurationComplete = onTestRunConfigurationComplete;
	this.reset();
};

jasmine.util.inherit(Reporter, jasmine.Reporter);


Reporter.prototype.reset = function(){
	this.specLog = jstestdriver.console.log_ = [];
};


Reporter.prototype.log = function(str){
	this.specLog.push(str);
};


Reporter.prototype.reportSpecStarting = function(){
	this.reset();
	this.start = +new Date();
};


Reporter.prototype.reportSpecResults = function(spec){
	var elapsed = +new Date() - this.start, results = spec.results();
	
	if (results.skipped) return;
	
	var item, state = 'passed', items = results.getItems(), l = items.length, messages = new Array(l);
	for (var i = 0; i < l; i++){
		item = items[i];
		if (item.passed()) continue;
		state = (item.message.indexOf('AssertionError:') != -1) ? 'error' : 'failed';
		messages.push({
			message: item + '',
			name: item.trace.name,
			stack: formatStack(item.trace.stack)
		});
	}
	
	this.onTestDone(new jstestdriver.TestResult(
		spec.suite.getFullName(),
		spec.description,
		state,
		jstestdriver.angular.toJson(messages),
		this.specLog.join('\n'),
		elapsed
	));
};


Reporter.prototype.reportRunnerResults = function(){
	this.onTestRunConfigurationComplete();
};


	var describes = [], beforeEachs = [], afterEachs = [];
	
	// Here we store:
	// 0: everyone runs
	// 1: run everything under ddescribe
	// 2: run only iits (ignore ddescribe)
	var exclusive = 0, collectMode = true;

	intercept('describe', describes);
	intercept('beforeEach', beforeEachs);
	intercept('afterEach', afterEachs);

	var template = TestCase('Jasmine Adapter Tests', null, 'jasmine test case');

	jstestdriver.pluginRegistrar.register({
		
		name: 'jasmine',
			
		runTestConfiguration: function(config, onTestDone, onTestRunConfigurationComplete){
			if (config.testCaseInfo_.template_ !== template) return;

			var jasmineEnv = jasmine.currentEnv_ = new jasmine.Env();
				
			collectMode = false;
			playback(beforeEachs);
			playback(afterEachs);
			playback(describes);
			
			jasmineEnv.specFilter = function(spec) {
				if (!exclusive) return true;
				var block, blocks = spec.queue.blocks, l = blocks.length;
				for (var i = 0; i < l; i++) if (blocks[i].func.exclusive >= exclusive) return true;
				return false;
			};
				
			jasmineEnv.reporter = new Reporter(onTestDone, onTestRunConfigurationComplete);
				
			jasmineEnv.execute();
			return true;
		},
			
		onTestsFinish: function(){
			jasmine.currentEnv_ = null;
			collectMode = true;
			exclusive = 0; // run everything
		}		

	});

	function formatStack(stack) {
		var line, lines = (stack || '').split(/\r?\n/), l = lines.length, frames = new Array(l);
		for (var i = 0; i < l; i++){
			line = lines[i];
			if (line.match(/\/jasmine[\.-]/)) continue;
			frames.push(line.replace(/https?:\/\/\w+(:\d+)?\/test\//, '').replace(/^\s*/, '			'));
		}
		return frames.join('\n');
	}
	
	function playback(set) {
		for (var i = 0, l = set.length; i < l; i++) set[i]();
	}

	function intercept(functionName, collection){
		window[functionName] = function(desc, fn){
			if (collectMode){
				collection.push(function(){
					jasmine.getEnv()[functionName](desc, fn);
				});
			} else {
				jasmine.getEnv()[functionName](desc, fn);
			}
		};
	}
	
	window.ddescribe = function(name, fn){
		if (exclusive < 1) exclusive = 1; // run ddescribe only
		
		window.describe(name, function(){
			var oldIt = window.it;
			window.it = function(name, fn){
				fn.exclusive = 1; // run anything under ddescribe
				jasmine.getEnv().it(name, fn);
			};
			
			try {
				fn.call(this);
			} finally {
				window.it = oldIt;
			};
			
		});
	};
	
	window.iit = function(name, fn){
		exclusive = fn.exclusive = 2; // run only iits
		jasmine.getEnv().it(name, fn);
	};

})();

// Patch Jasmine for proper stack traces
jasmine.Spec.prototype.fail = function (e) {
	var result = new jasmine.ExpectationResult({
		passed: false,
		message: e ? jasmine.util.formatException(e) : 'Exception'
	});
	if(e) result.trace = e;
	this.results_.addResult(result);
};
