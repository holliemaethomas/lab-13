'use strict';

import User from './model.js';

export default (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;

    if( authHeader.match(/basic/i)) {

      let base64Header = authHead.replace(/Basic\s+/,'');
      let base64Buffer = Buffer.from(base64Header, 'base64');
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');
      let auth = {username, password};


      // BASIC Auth
      if(authHeader.match(/basic/i)) {
      // Create a {user:password} object to send into the model to authenticate the user

      // Start the authentication train
        User.authenticateBasic(auth)
          .then(user => _authenticate(user))
          .catch(_authError);
      }
    }
    // BEARER Auth
    else if(authHeader.match(/bearer/i)) {
      // Send the bearer token to the model to authenticate the user
      User.authenticateToken(token)
        .then(user => _authenticate(user))
        .catch(_authError);
    }
    else { _authError(); }
  } catch(e) {
    _authError();
  }

  function _authenticate(user) {
    if(!user) { _authError(); }
    else {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
  }

  // In all cases, force a server error ...
  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }
};

