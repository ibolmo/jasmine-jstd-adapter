Jasmine adapter for JsTestDriver
================================

Author
------
me@ibolmo.com (Olmo Maldonado)


Installing
----------
Update your JsTestDriver.conf by prepending the jasmine library and the adapter's source files.

For example:

    load:
      - "../jasmine/lib/jasmine-0.10.0.js"
      - "../JasmineAdapter/src/*"
      - "your_source_files.js"
      - "your_test_files.js"


### Directory Layout

 - src: The adapter source code. Intent is to match interface with interface.
 - src-test: The test files that verifies that the adapter works as intended.
