
const options        = require("../app/functions/logger.js").OPTIONS;
const log            = require("../app/functions/logger.js").LOG;

const config         = require('../app/config/server.js');
const genesys        = require('../app/functions/genesys.js');

async function main() 
{
    options.rotateFile.filename = './logs/test.log';

    log.info('=======TEST======');

    let pDateLists = [
        '2024-04-08',
    ];

    for( const pDate of pDateLists){
        log.info(`RUN-pDate======>>: ${pDate}`); 
        await genesys.ManualGenLoginLogoutByDateReport(await pDate);
    }
}

main()
