const log            = require("./app/functions/logger").LOG;
const config         = require('./app/config/server');
const genesys        = require('./app/functions/genesys');

async function main() 
{
    genesys.AnalyticsConversationsDetailsQuery();
}

main()
