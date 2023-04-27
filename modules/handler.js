const messenger = require('./messenger');

exports.zaloStartAgent = async (current_session, msg) => {
	const userProfile = await messenger.getZaloUserInfo(current_session.zaloSession.userId);
	console.log('zalStartAgent userProfile:' + JSON.stringify(userProfile));
	current_session.zaloSession.displayName = userProfile.data.display_name;
	messenger.zalo_push_send('Hang on a sec.', current_session);
	messenger.getLiveAgentSession().then(session => {
		console.log('Zalo Session %j', session);
		current_session.liveagentSession.id = session.id;
		current_session.liveagentSession.key = session.key;
		current_session.liveagentSession.affinityToken = session.affinityToken;
		current_session.liveagentSession.pollTimeout = session.clientPollTimeout;
		current_session.liveagentSession.initialFetchTime = Date.now();
		current_session.liveagentSession.currentFetchTime = Date.now();

		messenger.chasitorInit(
			current_session.liveagentSession.key,
			current_session.liveagentSession.affinityToken,
			current_session.liveagentSession.id,
			current_session.zaloSession
		).then(chasitor => {
			console.log('Zalo Chasitor %j', chasitor);
			console.log('Zalo Chasitor Session %j', session);
			//-1 for init
			current_session.liveagentSession.sequence = -1;
			current_session.liveagentSession.timer = null;

    		function initialPooling(current_session){
    			estabishedLp(current_session);
    		};

    		function estabishedLp(current_session){
    			messenger.messages(current_session.liveagentSession, current_session.sequence).then(newmsg =>{
    				
    				//code 204
    				if(newmsg==''){

    					var diffFromCurrent = (Date.now() - current_session.liveagentSession.currentFetchTime)/1000;

    					var deadlineTime = (current_session.liveagentSession.warningTime)?
    										current_session.liveagentSession.warningTime:
    										current_session.liveagentSession.connectionTimeout;
						console.log('Zalo diff v dead',diffFromCurrent,deadlineTime);
    					if(diffFromCurrent > deadlineTime){
    						current_session.zaloSession.talkToAgent = false;
	    					current_session.liveagentSession.agentQueue = null;
	    					messenger.zalo_push_send('Thank you for conversation. Have a nice day.', current_session);
	    					messenger.sendLAEnd(current_session, 'timeout');
    					}else{
    						initialPooling(current_session);
    					}

    				}else {

    					current_session.liveagentSession.currentFetchTime = Date.now();
	    				var newmsg_json = JSON.parse(newmsg);
	    				
	    				if(newmsg_json.messages[0].type == 'ChatRequestSuccess'){
							console.log('ChatRequestSuccess');
							//update sequence
							//can check queue here 1 = 0 queue
							current_session.liveagentSession.connectionTimeout = newmsg_json.messages[0].message.connectionTimeout;
	    					current_session.liveagentSession.sequence = newmsg_json.sequence;
	    					initialPooling(current_session);
	    				}
	    				else if(newmsg_json.messages[0].type == 'ChatEstablished'){
							console.log('ChatEstablished');
							let chasitorInfo = newmsg_json.messages[0].message;
							console.log(chasitorInfo);
							current_session.liveagentSession.warningTime = chasitorInfo.chasitorIdleTimeout.warningTime;
							current_session.liveagentSession.timeout = chasitorInfo.chasitorIdleTimeout.timeout;
							messenger.zalo_push_send( `Hello, This is Agent ${chasitorInfo.name}. How may I help you?`, current_session);
							initialPooling(current_session);
	    				}
	    				else if(newmsg_json.messages[0].type == 'QueueUpdate'){
							console.log('QueueUpdate');
							// message
							// setTimeout(function() {
								// console.log('timeout',current_session);
								initialPooling(current_session);
							// }, 2000);
	    				}
	    				else if(newmsg_json.messages[0].type == 'ChatMessage' || newmsg_json.messages.length > 1){
							console.log('ChatMessage');
							current_session.liveagentSession.sequence = newmsg_json.sequence;

							var tmpmsg = [];
							// for(var mess in newmsg_json.messages){
							for (var i = 0; i < newmsg_json.messages.length; ++i) {
								if(newmsg_json.messages[i].type == 'ChatMessage'){
									tmpmsg.push(newmsg_json.messages[i].message.text);
								}
							}
							//newmsg_json.messages[0].message.text
							messenger.zalo_push_send(tmpmsg, current_session);
							initialPooling(current_session);
	    				}
	    				else if(newmsg_json.messages[0].type == 'ChatEnded'){
							console.log('ChatEnded');
							current_session.zaloSession.talkToAgent = false;
							current_session.liveagentSession.agentQueue = null;
							messenger.zalo_push_send(`Thank you for conversation. Have a nice day.`, current_session);
	    				}
	    				else if(newmsg_json.messages[0].type == 'ChatRequestFail'){
							console.log('ChatRequestFail');
							messenger.zalo_push_send(`No Agent Available.`, current_session);
							current_session.zaloSession.talkToAgent = false;
							current_session.liveagentSession.agentQueue = null;
	    				}
	    				else if(newmsg_json.messages[0].type == 'AgentTyping'){
							console.log('AgentTyping');
							initialPooling(current_session);
	    				}
	    				else if(newmsg_json.messages[0].type == 'AgentNotTyping'){
							console.log('AgentNotTyping');
							initialPooling(current_session);
	    				}
	    			}
    			}).catch((err)=>{
    				console.log('err',err);
    			});
    		};
    		initialPooling(current_session);
		});
	});
};

exports.zaloStopAgent = (current_session, msg) => {
	current_session.zaloSession.talkToAgent = false;
	messenger.sendLAEnd(current_session, 'EndedByClient');
	current_session.liveagentSession.agentQueue = null;
}

exports.zaloTalkToAgent = (current_session, msg) => {
	messenger.sendLAMessage(current_session, msg);
}