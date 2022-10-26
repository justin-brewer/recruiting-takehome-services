
post () {
	echo "arg 1: $1"
	echo "arg 2: $2"
	echo "arg 3: $3"
	curl -k -X POST https://localhost:5001/api/robots/closest \
	-H 'Content-Type: application/json' \
	-d '{"loadId":"'$1'","x":"'$2'", "y": "'$3'"}'
	echo ""
}

posti () {
	echo "arg 1: $1"
	echo "arg 2: $2"
	echo "arg 3: $3"
	curl -X POST http://localhost:5000/api/robots/closest \
	-H 'Content-Type: application/json' \
	-d '{"loadId":"'$1'","x":"'$2'", "y": "'$3'"}'
	echo ""
}
