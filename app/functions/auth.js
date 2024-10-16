const log      = require("./logger.js").LOG;
const jwt      = require("jsonwebtoken");
const config   = require('../config/server');

const secret_key = config.Authorize.Api_Secret;

function verifyToken (req, res, next) {
    let token = '';
    if(req.header("Authorization")){
      token = req.header("Authorization").split(' ')[1];
      log.info(`Authorization: ${token}`);
    }
    
   
    if (!token) return res.status(401).json({ error: "Access denied" });
    try {
      const decoded = jwt.verify(token, secret_key);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }

 
module.exports = verifyToken 