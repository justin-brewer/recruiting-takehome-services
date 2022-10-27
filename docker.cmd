docker build --pull -t recruiting-takehome-services . 
docker run --name get-load-services --rm -it -p 5000:5000 -p 5001:5001 recruiting-takehome-services