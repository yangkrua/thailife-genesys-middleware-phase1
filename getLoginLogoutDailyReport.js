const log            = require("./app/functions/logger.js").LOG;
const config         = require('./app/config/server.js');
const genesys        = require('./app/functions/genesys.js');

async function main() 
{
    genesys.GetLoginLogoutDailyReport();
}

main()
