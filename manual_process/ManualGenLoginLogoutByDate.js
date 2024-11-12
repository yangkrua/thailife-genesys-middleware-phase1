const log            = require("../app/functions/logger.js").LOG;
const config         = require('../app/config/server.js');
const genesys        = require('../app/functions/genesys.js');

async function main() 
{

    let pDateLists = [
        '2024-04-08',
        '2024-04-09',
    ];

    for( const pDate of pDateLists){
        log.info(`RUN-pDate======>>: ${pDate}`); 
        await genesys.ManualGenLoginLogoutByDateReport(await pDate);
    }
}

main()
