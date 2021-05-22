import { Request, Response, NextFunction } from 'express'
import * as user from '../users/User';

//signup
const signup = (req: Request, res: Response, next: NextFunction) => {

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
  
  };

export default { signup }