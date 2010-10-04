#!/bin/bash
while getopts  "j:t:" flag
do
  if [ $flag == "j" ]; then
    JSTD=$OPTARG
  elif [ $flag == "t" ]; then
    TESTS=$OPTARG
  fi
done

if [ -e $JSTD ]; then
	#statements
	JSTD=`ls ../jstestdriver/[jJ]s[tT]est[dD]river*.jar`
fi

if [ -e $TESTS ]; then
  TESTS="all"
  echo "Running all tests"
else
  echo "Running '$TESTS'"
fi

java -jar $JSTD --reset --tests $TESTS
