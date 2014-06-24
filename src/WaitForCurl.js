/**
 * Makes JasmineAdapter waiting for CurlJS dependencies
 */
(function() {

    //wrap around curl() function to inform JasmineAdapter about loading dependencies
    if(typeof window.curl == "function" && !window.curl.asyncJasmineInstrumented) {
        var origCurl = window.curl;
        window.curl = function() {
            var args = [];
            for(var i=0; i<arguments.length; i++) {
                args[i] = arguments[i];
            }
            var code = "["+args.join(",")+"]";
            jasmine.dependencyLoading(code);
            return origCurl.apply(this, args).then(function(res) {
                jasmine.dependencyLoaded(code);
            }, function(err) {
                console.error("Failed to load dependencies", err);
            });
        }
        window.curl.asyncJasmineInstrumented = true; //avoid double instrumentation
    } else {
        console.warn("curl.js not loaded");
    }

    /**
     * Get URL of the folder from which last script was loaded.
     */
    jasmine.util.getLastScriptFolder = function () {
        var scripts = document.getElementsByTagName("script");
        if(!scripts || scripts.length < 1)
            return null;
        var scriptUrl = scripts[scripts.length-1].attributes.src.value;
        var lastSlash = scriptUrl.lastIndexOf("/");
        var folderUrl = lastSlash>0?scriptUrl.substring(0, lastSlash+1):scriptUrl;
        return folderUrl;
    }

    /**
     * Resolves references to parent folder. For example, foo/bar/../baz would became foo/baz
     */
    jasmine.util.normalizeUrl = function(url) {
        var redundantFolderRegex = /\/[\w\d_]+\/\.\.\//;
        do {
            var urlLength = url.length;
            url = url.replace(redundantFolderRegex, "/");
        } while(urlLength != url.length)
	    return url;
    }

})();
