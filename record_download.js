// Globals
const fs = require('fs');
const path = require('path')

const dTime = require("moment"); 
let newJob = null;

// Get client credentials from environment variables
// Create API instances
const platformClient        = require('purecloud-platform-client-v2');
const client                = platformClient.ApiClient.instance;

const conversationsApi      = new platformClient.ConversationsApi();
const recordingApi          = new platformClient.RecordingApi();

// Get client credentials from environment variables
//const CLIENT_ID             = '4589c421-7a55-4ecd-897f-35b82c4a7724';  //'1a6e1437-9e4a-4db6-8b66-0f658994fafa';
//const CLIENT_SECRET         = 'rH-6DVqjmmFlJgFbD4eZ6ZthXlCdlNCjsaU80uhDsJM';  //'rz15nLXha0MNey79xv6ydhy7Olfm41qnDd1j677g7pk';
const CLIENT_ID             = '1a6e1437-9e4a-4db6-8b66-0f658994fafa';
const CLIENT_SECRET         = 'rz15nLXha0MNey79xv6ydhy7Olfm41qnDd1j677g7pk';
const ENVIROMENT            = 'https://mypurecloud.jp'; 

if(ENVIROMENT) client.setEnvironment(ENVIROMENT);

//======================================================================================
//======================================================================================
//======================================================================================
//======================================================================================

// OAuth input
client.loginClientCredentialsGrant(CLIENT_ID, CLIENT_SECRET)

    .then(() => {
        let dates = "2022-04-04T00:00:00.000Z/2022-04-08T00:00:00.000Z";
        downloadAllRecordings(dates);
    })

    .catch((err) => {
        // Handle failure response
        console.log(err);
    });

// Process and build the request for downloading the recordings
// Get the conversations within the date interval and start adding them to batch request
function downloadAllRecordings (dates) {
    console.log('Start batch request process');

    let body = {
        interval: dates
    }; // Object | query

    conversationsApi.postAnalyticsConversationsDetailsQuery(body)
        .then((conversationDetails) => {
            let conversationDetail = [];
            for (conversations of conversationDetails.conversations) {
                conversationDetail.push(addConversationRecordingsToBatch(conversations.conversationId));
            }
            return Promise.all(conversationDetail);
        })
        // Send a batch request and start polling for updates
        .then(() => {
            return recordingApi.postRecordingBatchrequests(batchRequestBody);
        })
        // Start downloading the recording files individually
        .then((result) => {
            return getRecordingStatus(result);
        })
        .then((completedBatchStatus) => {
            for (recording of completedBatchStatus.results) {
                // If there is an errorMsg skip the recording download
                if (recording.errorMsg) {
                    console.log("Skipping this recording. Reason:  " + recording.errorMsg)
                    continue;
                } else {
                    downloadRecording(recording);
                }
            }
        })
        .catch((err) => {
            console.log('There was an error: ');
            console.error(err);
        });
}


// Get all the recordings metadata of the conversation and add it to the global batch request object
function addConversationRecordingsToBatch (conversationId) {
    return recordingApi.getConversationRecordingmetadata(conversationId)
        .then((recordingsData) => {
            // Iterate through every result, check if there are one or more recordingIds in every conversation
            for (recording of recordingsData) {
                let batchRequest = {};
                batchRequest.conversationId = recording.conversationId;
                batchRequest.recordingId = recording.id;
                batchRequestBody.batchDownloadRequestList.push(batchRequest);
                console.log('Added ' + recording.conversationId + ' to batch request');
            }
        })
        .catch((err) => {
            console.log('There was a failure calling getConversationRecordingmetadata');
            console.error(err);
        });
}


// Plot conversationId and recordingId to request for batchdownload Recordings
function getRecordingStatus (recordingBatchRequest) {
    return new Promise((resolve, reject) => {
        let recursiveRequest = () => {
            recordingApi.getRecordingBatchrequest(recordingBatchRequest.id)
                .then((result) => {
                    if (result.expectedResultCount !== result.resultCount) {
                        console.log('Batch Result Status:' + result.resultCount + '/' + result.expectedResultCount)

                        // Simple polling through recursion
                        setTimeout(() => recursiveRequest(), 5000);
                    } else {
                        // Once result count reach expected.
                        resolve(result);
                    }
                })
                .catch((err) => {
                    console.log('There was a failure calling getRecordingBatchrequest');
                    console.error(err);
                    reject(err);
                });
        };
        recursiveRequest();
    });
}

// Get extension of every recording
function getExtension (recording) {
    // Store the contentType to a variable that will be used later to determine the extension of recordings
    let contentType = recording.contentType;
    // Split the text and gets the extension that will be used for the recording
    let ext = contentType.split('/').slice(-1);
    ext = String(ext);

    // For the JSON special case
    if (ext.length >= 4) {
        console.log('length' + ext.length);
        ext = ext.substring(0, 4);
        return ext;
    } else {
        return ext;
    }
}


// Download Recordings
function downloadRecording (recording) {
    console.log('Downloading now. Please wait...');
    let ext = getExtension(recording);
    let conversationId = recording.conversationId;
    let recordingId = recording.recordingId;
    let sourceURL = recording.resultUrl;
    let targetDirectory = '.';
    let fileName = conversationId + '_' + recordingId;

    const file = fs.createWriteStream((targetDirectory + fileName + '.' + ext));
    http.get(sourceURL, function (response) {
        response.pipe(file);
    });
}

