const request = require('request');

const LIVE_AGENT_API_VERSION = 55, SCREEN_RES = '1900x1080', LIVE_AGENT_LANGUAGE = 'en-US',
    /*ORG_ID = process.env.SF_ORG_ID,
    LIVE_AGENT_DEPLOYMENT = process.env.LIVE_AGENT_DEPLOYMENT, 
    LIVE_AGENT_BUTTON = process.env.LIVE_AGENT_BUTTON, 
    LIVE_AGENT_BASE_URL = process.env.LIVE_AGENT_BASE_URL,
    ZALO_OA_BASE_URL = 'https://openapi.zalo.me/v2.0/oa',
    ZALO_OA_TOKEN = process.env.ZL_OA_TOKEN;*/
    ORG_ID = '00D1e0000008rZd',
    LIVE_AGENT_DEPLOYMENT = '5721e0000008Oja', 
    LIVE_AGENT_BUTTON = '5731e0000008Ofa', 
    LIVE_AGENT_BASE_URL = 'https://d.la2-c1cs-hnd.salesforceliveagent.com/chat/rest/',
    ZALO_OA_BASE_URL = 'https://openapi.zalo.me/v2.0/oa',
    ZALO_OA_TOKEN = 'iJnq0DcNQY6mFNGEtfPe8BmwT03MZHTbz51HIjt-D6_r7Kq0-ie5IC8BRn7NrHm_mmbDJA7OLmEC90nGYT1iTeGUS3MKiIrzgrirMP-FQW-JVHbefBHvCePiD62tkbumb1K_JPpURXl_3NK_aDOtQw8tQWwMp7XfdJWYHv7tGoF-AbnJzeij0EHtHLtFYGaRvdfuFONRO5Yu2orsclD44AqRN7t5inW6vaPz8iMFBcMeUMiJnB82CzzR77lfZ5WFv405GCQuJ0tAJ5PJ_xWuFj5r8ct3ZK0rh2SVLBdnNmk53GnMYQ1K6FvQBJ-NaK1dz5XI9zgUA03HIcf0KsfQcIiNtuji9W';
    
exports.getLiveAgentSession = () => {
    return new Promise((resolve, reject) => {
        request({
                url: `${LIVE_AGENT_BASE_URL}/System/SessionId`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-LIVEAGENT-API-VERSION': LIVE_AGENT_API_VERSION,
                    'X-LIVEAGENT-AFFINITY': null,
                },
            },
            (error, response) => {
                if (error) {
                    console.log('Error getting session id: ', error);
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                } else {
                    resolve(JSON.parse(response.body));
                }
            }
        );
    });
};

exports.chasitorInit = (key, token, id, visitor) => {
    //console.log('Visitor: ' + JSON.stringify(visitor));
    console.log('Chasitor Key' + key);
    console.log('Chasitor Token ' + token);
    console.log('Chasitor Id' + id);
    //console.log('visitor:', visitor);

    return new Promise((resolve, reject) => {
        request({
                url: `${LIVE_AGENT_BASE_URL}/Chasitor/ChasitorInit`,
                method: 'POST',
                headers: {
                    'X-LIVEAGENT-API-VERSION': LIVE_AGENT_API_VERSION,
                    'X-LIVEAGENT-AFFINITY': token,
                    'X-LIVEAGENT-SESSION-KEY': key,
                    'X-LIVEAGENT-SEQUENCE': 1,
                },
                json: {
                    organizationId: ORG_ID,
                    deploymentId: LIVE_AGENT_DEPLOYMENT,
                    buttonId: LIVE_AGENT_BUTTON,
                    sessionId: id,
                    userAgent: '',
                    language: LIVE_AGENT_LANGUAGE,
                    screenResolution: SCREEN_RES,
                    visitorName: visitor.displayName,
                    /*
                    prechatDetails: [{
                            label: 'LastName',
                            value: visitor.displayName,
                            entityMaps: [
                                {
                                    entityName : 'Lead',
                                    fieldName : 'LastName'
                                }
                            ],
                            transcriptFields: [

                            ],
                            displayToAgent: true
                        },
                        {
                            label: 'Zalo ID',
                            value: visitor.userId,
                            entityMaps: [
                                {
                                    entityName : 'Lead',
                                    fieldName : 'Zalo_ID__c'
                                }
                            ],
                            transcriptFields: [
                                'Zalo_ID__c'
                            ],
                            displayToAgent: true,
                        },
                        {
                            label: 'LeadSource',
                            value: 'Zalo',
                            entityMaps: [
                                {
                                    entityName : 'Lead',
                                    fieldName : 'LeadSource'
                                }
                            ],
                            transcriptFields: [

                            ],
                            displayToAgent: true
                        },
                    ],
                    prechatEntities: [
                        {
                            entityName:"Lead",         
                            saveToTranscript:"Lead",
                            linkToEntityName:"Lead",
                            linkToEntityField:"LeadId",
                            entityFieldsMaps:[
                                {
                                    fieldName:"LastName",
                                    label:"LastName",
                                    doFind:true,
                                    isExactMatch:true,
                                    doCreate:true
                                },
                                {
                                    fieldName:"Zalo_ID__c",
                                    label:"Zalo ID",
                                    doFind:true,
                                    isExactMatch:true,
                                    doCreate:true
                                },
                                {
                                    fieldName:"LeadSource",
                                    label:"LeadSource",
                                    doFind:false,
                                    isExactMatch:false,
                                    doCreate:true
                                },
                            ]
                        }
                    ],
                    */
                    prechatDetails:[
                        {
                          'label':'Name',
                          'value': visitor.displayName,
                          'entityMaps':[
                             {
                                'entityName':'contact',
                                'fieldName':'LastName'
                             }
                          ],
                          'transcriptFields':[
                                'Zalo_Name__c'
                          ],
                          'displayToAgent':true
                       },
                       {
                            'label':'Zalo_ID',
                            'value': visitor.userId,
                            'entityMaps':[
                                {
                                'entityName':'contact',
                                'fieldName':'Zalo_persona__c'
                                }
                            ],
                            'transcriptFields':[
                                'Zalo_persona__c'
                            ],
                            'displayToAgent':false
                        },
                       {
                          'label':'Status',
                          'value':'New',
                          'entityMaps':[
                             {
                                'entityName':'Case',
                                'fieldName':'Status'
                             }
                          ],
                          'transcriptFields':[
                          ],
                          'displayToAgent':true
                       },
                       {
                          'label':'Origin',
                          'value':'Zalo',
                          'entityMaps':[
                             {
                                'entityName':'Case',
                                'fieldName':'Origin'
                             }
                          ],
                          'transcriptFields':[
                          ],
                          'displayToAgent':true
                       },
                 
                       {
                          'label':'Subject',
                          'value':`Zalo Case from ${visitor.displayName}`,
                          'entityMaps':[
                             {
                                'entityName':'Case',
                                'fieldName':'Subject'
                             }
                          ],
                          'transcriptFields':[
                          ],
                          'displayToAgent':true
                       }
                    ],
                    prechatEntities:[
                        {
                            'entityName':'Contact',         
                            'saveToTranscript':'Contact',
                            'linkToEntityName':'Case',
                            'linkToEntityField':'ContactId',
                            'entityFieldsMaps':[
                                {
                                    'fieldName':'LastName',
                                    'label':'Name',
                                    'doFind':true,
                                    'isExactMatch':true,
                                    'doCreate':true
                                },
                                {
                                    'fieldName':'Zalo_Name__c',
                                    'label':'LastName',
                                    'doFind':false,
                                    'isExactMatch':false,
                                    'doCreate':false
                                },
                                {
                                    'fieldName':'Zalo_persona__c',
                                    'label':'Zalo_ID',
                                    'doFind':false,
                                    'isExactMatch':false,
                                    'doCreate':false
                                },
                            ]
                        },
                        {
                            'entityName':'Case',
                            'showOnCreate':true,          
                            'saveToTranscript':'Case',
                            'entityFieldsMaps':[
                                {
                                    'fieldName':'Status',
                                    'label':'Status',
                                    'doFind':false,
                                    'isExactMatch':false,
                                    'doCreate':true
                                },
                                {
                                    'fieldName':'Origin',
                                    'label':'Origin',
                                    'doFind':false,
                                    'isExactMatch':false,
                                    'doCreate':true
                                },  
                    
                                {
                                    'fieldName':'Subject',
                                    'label':'Subject',
                                    'doFind':false,
                                    'isExactMatch':false,
                                    'doCreate':true
                                }
                            ]             
                            
                        }      
                    ],
                    buttonOverrides: [],
                    receiveQueueUpdates: true,
                    isPost: true,
                },
            },
            (error, response) => {
                if (error) {
                    console.log('Error initializing chat: ', error);
                } else {
                    resolve(response.body);
                }
            }
        );
    });
};

exports.messages = (session, seq) => {
    return new Promise((resolve, reject) => {
        request({
                url: `${LIVE_AGENT_BASE_URL}/System/Messages`,
                method: 'GET',
                qs: {
                    ack: seq
                },
                headers: {
                    'X-LIVEAGENT-API-VERSION': LIVE_AGENT_API_VERSION,
                    'X-LIVEAGENT-AFFINITY': session.affinityToken,
                    'X-LIVEAGENT-SESSION-KEY': session.key,
                },
            },
            (error, response) => {
                if (error) {
                    console.log('Error getting messages: ', error);
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                } else {
                    resolve(response.body);
                }
            }
        );
    });
};

exports.sendLAEnd = (current_session, endCause) => {
    console.log('end', endCause);
    current_session.liveagentSession.agentQueue.push(
        //return
        new Promise((resolve, reject) => {
            // session.agentQueue(function(){

            request({
                    url: `${LIVE_AGENT_BASE_URL}/Chasitor/ChatEnd`,
                    method: 'POST',
                    headers: {
                        'X-LIVEAGENT-API-VERSION': LIVE_AGENT_API_VERSION,
                        'X-LIVEAGENT-AFFINITY': current_session.liveagentSession.affinityToken,
                        'X-LIVEAGENT-SESSION-KEY': current_session.liveagentSession.key,
                        'X-LIVEAGENT-SEQUENCE': current_session.liveagentSession.sequence,
                    },
                    json: {
                        ChatEndReason: {
                            reason: 'client'
                        }, //,
                        //'reason': { reason: 'client' }
                    },
                },
                (error, response) => {
                    if (error) {
                        console.log('Error posting message: ', error);
                    } else {
                        console.log('Response: %j', response.body);

                        resolve(response.body);
                    }
                }
            );
            //});
        })
    );
};

exports.sendLAMessage = (current_session, message) => {
    console.log('Message : ' + message);
    current_session.liveagentSession.agentQueue.push(
        //return
        new Promise((resolve, reject) => {
            // session.liveagentSession.agentQueue(function(){

            request({
                    url: `${LIVE_AGENT_BASE_URL}/Chasitor/ChatMessage`,
                    method: 'POST',
                    headers: {
                        'X-LIVEAGENT-API-VERSION': LIVE_AGENT_API_VERSION,
                        'X-LIVEAGENT-AFFINITY': current_session.liveagentSession.affinityToken,
                        'X-LIVEAGENT-SESSION-KEY': current_session.liveagentSession.key,
                    },
                    json: {
                        text: message,
                    },
                },
                (error, response) => {
                    if (error) {
                        console.log('Error posting message: ', error);
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error);
                    } else {
                        // console.log('Response: %j', response.body);
                        current_session.liveagentSession.sequence =
                            current_session.sequence + 1;

                        resolve(response.body);
                    }
                }
            );
            // });
        })
    );
};

exports.zalo_push_send = (message, current_session) => {
    if (!Array.isArray(message)) {
        console.log('zalo_push_send - msg:', message);
        current_session.zaloSession.agentQueue.push(
            new Promise((resolve, reject) => {
                request({
                        url: `${ZALO_OA_BASE_URL}/message`,
                        qs: {
                            access_token: ZALO_OA_TOKEN
                        },
                        method: 'POST',
                        json: {
                            recipient: {
                                user_id: current_session.zaloSession.userId
                            },
                            message: {
                                text: message
                            },
                        },
                    },
                    (error, response) => {
                        if (error) {
                            console.log('Error sending message: ', error);
                        } else if (response.body.error) {
                            console.log('Error: ', response.body.error);
                        }
                        resolve(response.body);
                    }
                );
            })
        );
    } else {
        for (var i = 0; i < message.length; i++) {
            console.log('msg', message[i]);
            current_session.zaloSession.agentQueue.push(
                new Promise((resolve, reject) => {
                    request({
                            url: `${ZALO_OA_BASE_URL}/message`,
                            qs: {
                                access_token: ZALO_OA_TOKEN
                            },
                            method: 'POST',
                            json: {
                                recipient: {
                                    user_id: current_session.zaloSession.userId
                                },
                                message: {
                                    text: message[i]
                                },
                            },
                        },
                        (error, response) => {
                            if (error) {
                                console.log('Error sending message: ', error);
                            } else if (response.body.error) {
                                console.log('Error: ', response.body.error);
                            }
                            resolve(response.body);
                        }
                    );
                })
            );
        }
    }
};

exports.getZaloUserInfo = (userId) => {
    var userIdString = `{'user_id': '${userId}'}`;
    return new Promise((resolve, reject) => {
        request({
                url: `${ZALO_OA_BASE_URL}/getprofile`,
                qs: {
                    access_token: ZALO_OA_TOKEN,
                    data: userIdString
                },
                method: 'GET',
                headers : {
                    'access_token' : ZALO_OA_TOKEN
                }
            },
            (error, response) => {
                if (error) {
                    console.log('Error sending message: ', error);
                    reject(error);
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                } else {
                    resolve(JSON.parse(response.body));
                }
            }
        );
    });
};