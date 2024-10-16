// Globals
// file system module to perform file operations
const fs      = require('fs');
const moment  = require("moment"); 
const config  = require('./app/config/server.js'); 
const utils   = require('./app/functions/utils');

async function main() 
{
    const rootPath = config.GENESES.data_process_outbox;
    await utils.removeLogFile_15d(rootPath);
}
  
main()
