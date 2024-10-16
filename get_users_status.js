// Globals
// file system module to perform file operations
const fs = require('fs');

const dTime = require("moment"); 
const myConfig = require('./app/config/config.js'); 


// Get client credentials from environment variables
// Create API instances
const platformClient        = require('purecloud-platform-client-v2');
const { Console } = require('console');
const client                = platformClient.ApiClient.instance;


let apiInstance = new platformClient.ConversationsApi();
let usersApi    = new platformClient.UsersApi();
let routingApi  = new platformClient.RoutingApi();

// Get client credentials from environment variables

//const CLIENT_ID             = myConfig.LOCUS_CLIENT_ID;  //'4589c421-7a55-4ecd-897f-35b82c4a7724'; 
//const CLIENT_SECRET         = myConfig.LOCUS_CLIENT_SECRET; //'QLLhR5JXLWIJ27yQ4jjC8WtwML0vFoIiCqtLJHJjjS0'; 
//const ENVIROMENT            = myConfig.LOCUS_ENVIROMENT;  //'https://mypurecloud.jp'; 

const CLIENT_ID             = myConfig.TLI_CLIENT_ID;  //'4589c421-7a55-4ecd-897f-35b82c4a7724'; 
const CLIENT_SECRET         = myConfig.TLI_CLIENT_SECRET; //'QLLhR5JXLWIJ27yQ4jjC8WtwML0vFoIiCqtLJHJjjS0'; 
const ENVIROMENT            = myConfig.TLI_ENVIROMENT;  //'https://mypurecloud.jp'; 

if(ENVIROMENT) client.setEnvironment(ENVIROMENT);

// ===================================================================================
// ===================================================================================
// ===================================================================================





client.loginClientCredentialsGrant(CLIENT_ID, CLIENT_SECRET)
.then(()=> {
    //let body = {"interval": "2024-02-01T00:00:00.000Z/2024-02-07T00:00:00.000Z"}; // Object | query
    let body ={
        "interval": "2024-02-12T00:00:00.000+07:00/2024-02-12T23:59:59.000+07:00",
        "presenceFilters": [
          {
            "type": "or",
            "predicates": [
              {
                "dimension": "systemPresence",
                "value": "AVAILABLE"
              }
            ]
          }
        ],
        "presenceAggregations": [
          {
            "type": "termFrequency",
            "dimension": "organizationPresenceId",
            "size": 50
          }
        ],
        "paging": {
          "pageSize": 100,
          "pageNumber": 1
        },
        "order": "asc"
      };

    // Query for conversation details
    usersApi.postAnalyticsUsersDetailsQuery(body)    
    .then((data) => {
        console.log(`postAnalyticsUsersDetailsQuery success! data: ${JSON.stringify(data, null, 2)}`);
        downloadRecording(data);
    })
    .catch((err) => {
        console.log("There was a failure calling postAnalyticsUsersDetailsQuery");
        console.error(err);
    });

})
.catch((err) => {
    console.log("loginClientCredentialsGrant : Error > "+err);
    
});


function downloadRecording (jsonData) 
{
// stringify JSON Object
var jsonContent = JSON.stringify(jsonData, null, 2);

fs.writeFile("output_users_status_sdk_js.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});




};