const log            = require("./app/functions/logger.js").LOG;
const config         = require('./app/config/server.js');
const genesys        = require('./app/functions/genesys.js');
const morganBody     = require('morgan-body');
const fs             = require('fs');
const path           = require('path');
const rfs            = require('rotating-file-stream');
const moment         = require('moment');

async function main() 
{
    let pDateLists = [
        // '2024-03-23',
        // '2024-03-24',
        // '2024-03-25',
        // '2024-03-26',
        // '2024-03-27',
        // '2024-03-28',
        // '2024-03-29',
        // '2024-03-30',
        // '2024-03-31',
        // '2024-04-01',
        // '2024-04-02',
        // '2024-04-03',
        // '2024-04-04',
         '2024-04-05',
        //'2024-05-07',
    ];

    for( const pDate of pDateLists){
        log.info(`RUN-pDate======>>: ${pDate}`); 
        await genesys.ManualGenAbandonPhoneListByDate(await pDate);
        //await genesys.ManualGenAbandonQueueByDate(await pDate);
        //await genesys.ManualGenA_Number_Report_ByDate(await pDate);
    }
    
}
  
main()
