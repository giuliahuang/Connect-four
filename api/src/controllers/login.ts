import passport = require('passport');
import passportHTTP = require('passport-http');  // implements Basic and Digest authentication for HTTP (used for /login endpoint)
import jsonwebtoken = require('jsonwebtoken');  // JWT generation
import * as user from '../users/User';

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

passport.use( new passportHTTP.BasicStrategy(
    function(username, password, done) {
      // "done" callback (verify callback) documentation:  http://www.passportjs.org/docs/configure/

      // Delegate function we provide to passport middleware
      // to verify user credentials

      console.log('New login attempt from ' + username)
      user.getModel().findOne({ mail: username }, (err, user) => {
        if (err) {
          return done({ statusCode: 500, error: true, errormessage: err })
        }

        if (!user) {
          return done(null, false, {
            statusCode: 500,
            error: true,
            errormessage: 'Invalid user',
          })
        }

        if (user.validatePassword(password)) {
          return done(null, user)
        }

        return done(null, false, {
          statusCode: 500,
          error: true,
          errormessage: 'Invalid password',
        })
      })
    }
));

const login = (passport.authenticate('basic', { session: false }), (req,res,next) => {

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
      var secret = "secret";
      jsonwebtoken.sign(tokendata, secret, { expiresIn: '1h' } );
    }
    
    // Note: You can manually check the JWT content at https://jwt.io
  
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
  
  });

  export default { login }