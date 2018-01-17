# webpageanalyzer
Small app for analyze web pages, in a scalable way using microservices approach

## Build using Docker
- You need latest or abmove `Docker` `version 17` and above and `docker-compose` `version 1.14`
- `docker-compose up --build -d` should run the app
- If you are running a docker-machine, which has different IP, you might want to edit proxy property of webapp to point to correct docker-machine IP, before building the images to suit to your docker-machine IP address
	i.e.,
		- Open the file `./webApp/package.json`
		- You will see `proxy` property in that json file will be set to something like `"proxy": "http://192.168.99.100:8080/"`, which is the IP address of apigateway service of the webpageanalyzer
		- Edit that to replace the IP & PORT of your `DOCKER_HOST`
		- If you are not using a docker machine, its mostly `localhost`
		- The port is of API gateway, if you have not changed the port in docker-compose.yml for the apigateway, then port remain the same, which is `8080`
		- Once you save the package.json, go ahead and build your docker images and up them

## Building as locally running services
- Clone
- Each folder is a Node JS micro service, do a `yarn` in each to install dependencies and run the script in corresponding folder's package.json (except test)
- Requires or has dependency on Redis and Cassandra, if you are running it else where, each micro service has `config.js`, edit to suit to your need or set the corresponding environment variables
- There are 9 services to run, before you access `http://localhost:3000`, which runs if all is running well
- From UI user adds a URL, which is then analyzed by the each microservice for their part and stored in DB (cassandra), the Details view in UI stitches data from each service and displays it
- API gateway is a quick simulated proxy, currently

## TODO
- Websocket integration with microservices and UI
- UI - Web Document dialog is clunky (goes beyond view port) when content goes out of height, may be Material-UI issue
- UI URL validation to input has to be fixed
- Volume mounting for cassandra (intentionally left out)
- Pagination of Web Documents in UI
- Some more microservices for anlayzing (Authentication, Images, Videos, Keywords)
- Replace existing api-gateway with a full featured on (Kong)
- Need to replace messaging infra with Kafka or RabbitMQ, currently its the weakest part of the app
- Need to document API (intentionally not documented, as purpose was different and not for public currently)
- Need to implement security, authentication
- Yet to test in Docker Swarm mode
