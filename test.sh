if [ $# -eq 1 ]; then
	JSTD=$1
fi

if [ -e $JSTD ]; then
	#statements
	JSTD=`ls ../jstestdriver/[jJ]s[tT]est[dD]river*.jar`
fi

java -jar $JSTD --tests all --reset
