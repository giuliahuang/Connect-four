
const result = require('dotenv').config()     // The dotenv module will load a file named ".env"
                                              // file and load all the key-value pairs into
                                              // process.env (environment variable)
if (result.error) {
  console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
  process.exit(-1);
}
if( !process.env.JWT_SECRET ) {
  console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found");
  process.exit(-1);
}

import express = require('express');
import logger from './logger/logger';
import health from './routes/health';
import config from './config/config';
import http = require('http');
import jwt = require('express-jwt');            // JWT parsing middleware for express
import jsonwebtoken = require('jsonwebtoken');  // JWT generation
import cors = require('cors');                  // Enable CORS middleware
import passport = require('passport');
import passportHTTP = require('passport-http');  // implements Basic and Digest authentication for HTTP (used for /login endpoint)
import mongoose = require('mongoose');
import * as user from './users/User';
import io = require('socket.io');               // Socket.io websocket library
import colors = require('colors');
import bodyparser = require('body-parser');
import { nextTick } from 'process';

declare global {
  namespace Express {
      interface User {
        mail:string,
        username: string,
        roles: string[],
        id: string
      }
    }
}

const NAMESPACE = 'Server'
var ios = undefined;
const app = express()
var auth = jwt( {secret: process.env.JWT_SECRET} );
//app.use([express.urlencoded({ extended: false }), express.json()])
app.use( cors() );

// Request logger
app.use((req, res, next) => {
  logger.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  )
  res.on('finish', () => {
    logger.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    )
  })
  next()
})

app.use('/health', health)
/*
// Catch undefined endpoints
app.use((req, res, next) => {
  const error = new Error('Error 404: Resource not found')
  return res.status(404).json({ message: error.message })
})
*/
app.use( bodyparser.json() );

app.use( (req,res,next) => {
  console.log("------------------------------------------------".inverse)
  console.log("New request for: "+req.url );
  console.log("Method: "+req.method);
  next();
})

// Add API routes to express application
//

app.get("/", (req,res) => {

    res.status(200).json( { api_version: "1.0", endpoints: [ "/messages", "/tags", "/users", "/login" ] } ); // json method sends a JSON response (setting the correct Content-Type) to the client

});

// Signup routes
/*Funziona se viene passato un json come segue:
{
    "username": "username",
    "mail": "mail",
    "password": "pass"
}
*/
app.post('/users', (req,res,next) => {
  console.log("POST USERS: "+req.body)

  var u = user.newUser( req.body );
  if( !req.body.password ) {
    return next({ statusCode:404, error: true, errormessage: "Password field missing"} );
  }
  u.setPassword( req.body.password );

  u.save().then( (data) => {
    return res.status(200).json({ error: false, errormessage: "", id: data._id });
  }).catch( (reason) => {
    if( reason.code === 11000 )
      return next({statusCode:404, error:true, errormessage: "User already exists"} );
    return next({ statusCode:404, error: true, errormessage: "DB error: "+reason.errmsg });
  })

});

app.get('/users', auth, (req,res,next) => {

  user.getModel().find( /*{}, {digest:0, salt:0}*/ ).then( (users) => {
    return res.status(200).json( users );
  }).catch( (reason) => {
    return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
  })

});

//signup
app.post('/users', (req,res,next) => {

  var u = user.newUser( req.body );
  if( !req.body.password ) {
    return next({ statusCode:404, error: true, errormessage: "Password field missing"} );
  }
  u.setPassword( req.body.password );

  u.save().then( (data) => {
    return res.status(200).json({ error: false, errormessage: "", id: data._id });
  }).catch( (reason) => {
    if( reason.code === 11000 )
      return next({statusCode:404, error:true, errormessage: "User already exists"} );
    return next({ statusCode:404, error: true, errormessage: "DB error: "+reason.errmsg });
  })

});


// Login routes

// Configure HTTP basic authentication strategy 
// trough passport middleware.
// NOTE: Always use HTTPS with Basic Authentication

passport.use( new passportHTTP.BasicStrategy(
  function(username, password, done) { //ho dovuto esplicitare any sennò da errore

    // "done" callback (verify callback) documentation:  http://www.passportjs.org/docs/configure/

    // Delegate function we provide to passport middleware
    // to verify user credentials 

    console.log("New login attempt from " + username );
    user.getModel().findOne( {mail: username} , (err, user)=>{
      if( err ) {
        return done( {statusCode: 500, error: true, errormessage:err} );
      }

      if( !user ) {
        return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid user"});
      }

      if( user.validatePassword( password ) ) {
        return done(null, user);
      }

      return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid password"});
    })
  }
));

app.get("/login", passport.authenticate('basic', { session: false }), (req,res,next) => {

  // If we reach this point, the user is successfully authenticated and
  // has been injected into req.user

  // We now generate a JWT with the useful user data
  // and return it as response

  var tokendata = {
    username: req.user?.username,
    roles: req.user?.roles,
    mail: req.user?.mail,
    id: req.user?.id
  };

  console.log("Login granted. Generating token" );
  var token_signed;

  if(process.env.JWT_SECRET){
    token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' } );
  }else{
    //TODO: cambiare questo chiedendo al prof. Senza l'if else da errore perche ts non mi garantisce l'esistenza di process.env.JWT_SECRET quindi da errore
    var secret = "secret";
    jsonwebtoken.sign(tokendata, secret, { expiresIn: '1h' } );
  }
  
  // Note: You can manually check the JWT content at https://jwt.io

  return res.status(200).json({ error: false, errormessage: "", token: token_signed });

});

// The very last middleware will report an error 404 
// (will be eventually reached if no error occurred and if
//  the requested endpoint is not matched by any route)
//
app.use( (req,res,next) => {
  res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
})

// Connect to mongodb and launch the HTTP server trough Express
//
mongoose.connect( 'mongodb://localhost:27017/connectfourdb' )
.then( 
  () => {
    console.log("Connected to MongoDB");
    return user.getModel().findOne( {mail:"admin@postmessages.it"} );
  }
).then(
  (doc) => {
    if (!doc) {
      console.log("Creating admin user");

      var u = user.newUser({
        username: "admin",
        mail: "admin@connectfour.it"
      });
      u.setAdmin();
      u.setModerator();
      u.setPassword("admin");
      return u.save()
    } else {
      console.log("Admin user already exists");
    }
  }
).then(      
  () => {
    let server = http.createServer(app);
    
    server.listen(8080, () => console.log("HTTP Server started on port 8080"));
  }
).catch(
  (err) => {
    console.log("Error Occurred during initialization");
    console.log(err);
  }
)
/*
const httpServer = http.createServer(app)
httpServer.listen(config.server.port, () =>
  logger.info(
    NAMESPACE,
    `Server is running on ${config.server.hostname}:${config.server.port}`
  )
)*/
