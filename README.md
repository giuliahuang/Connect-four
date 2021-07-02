# Connect Four
![Kiku](https://www.unive.it/pag/fileadmin/user_upload/extra/pid/img/loghi/logo_CF_1.png)  
This was the university project for the course of web development. It was required to design and develop a MEAN application that allows users to register and play the classical game of Connect Four.

# System architecture
The project was structured according to the Clean Architecture style to better redistribute code, increase readability and improve comprehension. TypeScript was used in-place of JavaScript to introduce robust type checking at compile time.</br>
The backend is mainly comprised of a Node application, specifically the Express framework. This handles all HTTP requests and processing but some of the features are served to the clients through Socket.io, a non-standard websocket implementation.</br>
For data persistence a MongoDB server was employed, which was accessed through the library Mongoose, alongside Node’s file system for storing images.</br>
A Redis server was also used to offload some aspects of the gaming features, specifically two in-memory hashmaps get instantiated to allow for a lightweight implementation of certain events. This has the benefits of freeing the backend’s volatile memory and also of maximizing the availability since all hashmap operations are asynchronous and are put into the events loop.

# User Authentication
User authentication is handled through the Passport.js library. The mechanism works as follows:</br>
The user needs first to authenticate at the login endpoint by providing a valid combination of email and password. Subsequently, the server replies with a newly issued Json Web Token, which needs to be sent back by the client alongside each and every request which tries to access a protected endpoint. All endpoints under the /auth/ hierarchy require a valid JWT, otherwise, the server simply replies with a 401 error. The token needs to be set into the authorization header with the prefix ’Bearer ’.</br>
When a valid token is supplied during an HTTP request, the Passport middleware automatically verifies and loads the user’s information from the database. Afterward, they are readily available on the property req.user. The same process happens during Socket.io events, thanks to the authentication middleware provided by the library SocketIO JWT Auth. The mechanism is totally similar to the Passport authentication, the biggest difference is that the user’s information can be accessed at socket.request[’user’]. These middlewares provide the assurance that every time a user tries to interact with the server, they have to be authenticated and that their information is already available to be manipulated.

# Setup
The full stack app can be run with local installations of the required services, although to facilitate the deployment a Docker setup is provided.

By launching:
```sh
docker compose up
```
the application gets brought online and is ready to be used. Manual installation of npm packages is still required.
