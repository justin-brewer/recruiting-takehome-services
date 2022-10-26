ROBOT_API="robot-api"

openssl genrsa -out "${ROBOT_API}-key.pem" 1024
openssl req -new -key "${ROBOT_API}-key.pem" -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey "${ROBOT_API}-key.pem" -out "${ROBOT_API}-cert.pem"

