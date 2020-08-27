const jwt = require("jsonwebtoken");

const enviroment = require("../secret/env");

let verifyUserToken = (req, resp, next) => {
  const token = req.headers.token;

  jwt.verify(token, enviroment.token.seed, (err, payload) => {
    if (err) {
      return resp.json({
        ok: false,
        error: "not valid token",
      });
    }

    

    next();
  });
};



let verifyRole = (req, resp, next)=>{

    const role = req.headers.role;

    if(role === 'ADMIN_ROLE'){
        next();
    }

    resp.json({
        ok: false,
        error: 'Not authorization'
    });


}

module.exports = { verifyUserToken, verifyRole };
