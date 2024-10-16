const log            = require("./app/functions/logger").LOG;
const config         = require('./app/config/server');
const genesys        = require('./app/functions/genesys');
const sftp           = require("./app/functions/sftp.js");
const morganBody     = require('morgan-body');
const fs             = require('fs');
const path           = require('path');
const rfs            = require('rotating-file-stream');
const moment         = require('moment');

async function main() 
{
    genesys.GetCDRtFlowAbandonCall();
}
  
main()
