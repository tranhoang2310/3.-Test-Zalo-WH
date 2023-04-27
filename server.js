const express = require('express'), 
	app = express(),
    cache = require('memory-cache'),
    Queue = require('better-queue'),
    handlers = require('./modules/handler');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//This is use for Zalo registration domain
app.get('/', (req, res)=> {
	res.send('<html><head><meta name="zalo-platform-site-verification" content="MyIbTj-t9ciYgPDl-QqcSWcRldBbv6KiCJC" /></head><body></body></html>');
  });

//Endpoints to listen web requests from Zalo
app.post('/webhook', (req, res) => {
    const event = req.body;
    switch (event.event_name){
        case 'user_send_text' : 
            processTextMessage(event);
            break;
        case 'follow 2' : 
            break;
        case 'follow 3' : 
            break;
        case 'follow  4' : 
            break;
        default :
            break;

    }

    res.status(200).send('OK');
});

function processTextMessage(event) {
    console.log('Process text message');

    let senderId = event.sender.id;
	let messageText = event.message.text;
	
	if(cache.get(senderId) == null){
		
		cache.put(senderId, {
			zaloSession:{
				talkToAgent: false,
				userId: senderId,
				agentQueue: null
			},
			liveagentSession: {
				agentQueue: null
			}
		});
	}

	if(messageText.toUpperCase() == 'TALK TO AGENT' && cache.get(senderId).zaloSession.talkToAgent==false) {
		cache.get(senderId).zaloSession.talkToAgent = true;

		cache.get(senderId).zaloSession.agentQueue = new Queue(function(pme, cb) {
			pme.then(()=>{
				cb();
			});
		});
		cache.get(senderId).liveagentSession.agentQueue = new Queue(function(pme, cb){
                pme.then(()=>{
                    cb();
                });
            });
		handlers.zaloStartAgent(cache.get(senderId));
	}
    else if(messageText == 'done talking') {
		handlers.zaloStopAgent(cache.get(senderId));
	}
    else {
		if(cache.get(senderId).zaloSession.talkToAgent && cache.get(senderId).liveagentSession.agentQueue != null){
			handlers.zaloTalkToAgent(cache.get(senderId), messageText);
		}
	}

}

//Start the server
app.set('port', process.env.PORT || 8200);
app.listen(app.get('port'), () => {
    console.log(`Express server listening on ${app.get('port')} !`);
});



