#!/bin/bash
while getopts  "j:t:" flag
do
  if [ $flag == "j" ]; then
    JSTD=$OPTARG
  elif [ $flag == "t" ]; then
    TESTS=$OPTARG
  fi
done

if [ -z "$JSTD" ]; then
	#statements
	JSTD="./lib/JsTestDriver.jar"
fi

if [ -z "$TESTS" ]; then
  TESTS="all"
  echo "Running all tests"
else
  echo "Running '$TESTS'"
fi

java -jar $JSTD --reset --tests "$TESTS"
