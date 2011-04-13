/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author misko@hevery.com (Misko Hevery)
 */

(function(window) {
	
	var rootDescribes = new Describes(window);
	rootDescribes.collectMode();

	var template = TestCase('Jasmine Adapter Tests', null, 'jasmine test case');

	jstestdriver.pluginRegistrar.register({
		
		name: 'jasmine',
			
		runTestConfiguration: function(config, onTestDone, onTestRunConfigurationComplete){
			if (config.testCaseInfo_.template_ !== template) return;

			var jasmineEnv = jasmine.currentEnv_ = new jasmine.Env();
				
			rootDescribes.playback();
				
			var start, specLog = jstestdriver.console.log_ = [];
				
			jasmineEnv.specFilter = function(spec) {
				return rootDescribes.isExclusive(spec);
			};
				
			jasmineEnv.reporter = {
					
				log: function(str){
					specLog.push(str);
				},

				reportRunnerStarting: function(){},

				reportSpecStarting: function(){
					specLog = jstestdriver.console.log_ = [];
					start = +new Date();
				},

				reportSpecResults: function(spec){
					var elapsed = +new Date() - start, results = spec.results();
					if (results.skipped) return;
					var item, state = 'passed', items = result.getItems(), l = items.length, messages = new Array(l);
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
						onTestDone(new jstestdriver.TestResult(
							spec.suite.getFullName(),
							spec.description,
							state,
							jstestdriver.angular.toJson(messages),
							specLog.join('\n'),
							elapsed
					));
				},

				reportSuiteResults: function(){},

				reportRunnerResults: function(){
					onTestRunConfigurationComplete();
				}
					
			};
				
			jasmineEnv.execute();
			return true;
		},
			
		onTestsFinish: function(){
			jasmine.currentEnv_ = null;
			rootDescribes.collectMode();
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

	function Describes(window){
		var describes = {};
		var beforeEachs = {};
		var afterEachs = {};
		// Here we store:
		// 0: everyone runs
		// 1: run everything under ddescribe
		// 2: run only iits (ignore ddescribe)
		var exclusive = 0;
		var collectMode = true;
		intercept('describe', describes);
		intercept('xdescribe', describes);
		intercept('beforeEach', beforeEachs);
		intercept('afterEach', afterEachs);

		function intercept(functionName, collection){
			window[functionName] = function(desc, fn){
				if (collectMode) {
					collection[desc] = function(){
						jasmine.getEnv()[functionName](desc, fn);
					};
				} else {
					jasmine.getEnv()[functionName](desc, fn);
				}
			};
		}
		window.ddescribe = function(name, fn){
			if (exclusive < 1) {
				exclusive = 1; // run ddescribe only
			}
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


		this.collectMode = function() {
			collectMode = true;
			exclusive = 0; // run everything
		};
		this.playback = function(){
			collectMode = false;
			playback(beforeEachs);
			playback(afterEachs);
			playback(describes);

			function playback(set) {
				for ( var name in set) {
					set[name]();
				}
			}
		};

		this.isExclusive = function(spec) {
			if (exclusive) {

				var blocks = spec.queue.blocks;
				for ( var i = 0; i < blocks.length; i++) {
					if (blocks[i].func.exclusive >= exclusive) {
						return true;
					}
				}
				return false;
			}
			return true;
		};
	}

})(window);

// Patch Jasmine for proper stack traces
jasmine.Spec.prototype.fail = function (e) {
	var result = new jasmine.ExpectationResult({
		passed: false,
		message: e ? jasmine.util.formatException(e) : 'Exception'
	});
	if(e) result.trace = e;
	this.results_.addResult(result);
};
