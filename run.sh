#!/bin/bash
while true 
do
	/bin/echo ""
	/bin/echo ""
	/bin/echo -e "\n \nTime: $(date). Starting Node Script." >> run.log
	/usr/local/bin/node ./main.js >> run.log 2>> error.lor
	sleep 5m 
done
