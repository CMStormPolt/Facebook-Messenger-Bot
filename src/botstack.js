"use strict";
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const restify = require('restify');
const fb = require('./fb.js');
const botmetrics = require('./bot-metrics.js');
const apiai = require('./api-ai.js');
const log = require('./log.js');
const sessionStore = require('./session.js');
const db = require('./dynamodb.js');
const s3 = require('./s3.js');
const co = Promise.coroutine;

const serveStatic = require('serve-static-restify')

const MongoDB = require('./MongoApparel/MongoDB.js')
const BotData = require('./BotFunctions/BotData.js')


let https_options = {
                    certificate: fs.readFileSync('./paradiseshop.eu.cert'),     // If you want to create an HTTPS server, pass in the PEM-encoded certificate and key
                    key: fs.readFileSync('./paradiseshop.eu.key'),             // If you want to create an HTTPS server, pass in the PEM-encoded certificate and key
                }
                
let conf = {};

function checkConfig() {
    const basePath = path.dirname(require.main.filename);
    const configPath = path.join(basePath, "conf/conf.json");
    if (fs.existsSync(configPath)) {
        conf = require(configPath);
    }
}

class BotStack {
    constructor(botName) {
        botName = typeof(botName) !== 'undefined' ? botName: "default bot";
        this.botName = botName;
        this.server = restify.createServer();
        // this.https_server = restify.createServer(https_options);

        checkConfig();

        if ('BOTSTACK_STATIC' in process.env) {
            if (!('BOTSTACK_URL' in process.env)) {
                throw new Error("BOTSTACK_URL not found");
                return;
            } else {
                // console.log(process.env.BOTSTACK_STATIC) 
                // this.server.pre(serveStatic(__dirname + '/MongoApparel'))
                // restify.serveStatic is BUGGED....
                // console.log(process.env.BOTSTACK_STATIC) 
                // this.server.get(/\/public\/?.*/, restify.serveStatic({
                //     directory: './public',
                //     default: 'index.html',
                //     appendRequestPath: true,
                // }));
            }
        }


        this.server.use(restify.queryParser());
        this.server.use(restify.bodyParser());

        // utils
        this.fb = fb;
        this.apiai = apiai;
        this.s3 = s3;
        this.log = log;
        this.BotData = BotData
        this.MongoDB = MongoDB

        if (Object.keys(conf).length == 0) {
            // log.debug("Started with default config (no configuration file found)", { module: "botstack:constructor"});
        } else {
            // log.debug("Custom config file loaded", { module: "botstack:constructor"});
        }

        if ('getStartedButtonText' in conf) {
            this.fb.getStartedButton(conf.getStartedButtonText).then(x => {
                // log.debug("Started button done", { module: "botstack:constructor", result: x.result});
            });
        } else {
            this.fb.getStartedButton().then(x => {
                // log.debug("Started button done", { module: "botstack:constructor", result: x.result});
            });
        };

        if ('persistentMenu' in conf) {
            this.fb.persistentMenu(conf.persistentMenu).then(x => {
                // log.debug("Persistent menu done", { module: "botstack:constructor", result: x.result});
            })
        };

        if ('welcomeText' in conf) {
            this.fb.greetingText(conf.welcomeText).then(x => {
                // log.debug("Welcome text done", { module: "botstack:constructor", result: x.result});
            })
        };

        this.server.get('/abc', (req, res, next) => {
            res.send('Nothing to see here...');
        });
        // this.server.post('/product', (req, res, next) => {
        //     console.log(req.body);
        //     res.send('Nothing to see here...');
        // });
        this.server.get('/webhook/', (req, res, next) => {
            let token = req.query.hub.verify_token;
            if (token === process.env.FB_VERIFY_TOKEN) {
                res.write(req.query.hub.challenge);
                res.end();
            } else {
                res.send("Error, wrong validation token");
            }
            return next();
        });

        this.server.post('/webhook/', this._webhookPost(this));

        this.server.post('/apiaidb/', (req, res, next) => {
            res.json({
                speech: req.body.result.fulfillment.speech,
                displayText: req.body.result.fulfillment.speech,
                source: this.botName
            });
            res.end();
            log.debug("Received a database hook from API.AI", {
                module: "botstack:apiaidb"
            });
            //add to db
            if(req.body) {
                db.logApiaiObject(req.body);
            } else {
                log.debug("No body to put in DB", {
                    module: "botstack:apiaidb"
                });
            }
            return next();
        });
    };

    textMessage(message, senderID) {
        co(function* (){
            let text = message.message.text;
            botmetrics.logUserRequest(text, senderID);
            log.debug("Process text message", {
                module: "botstack:textMessage",
                senderId: senderID,
                message: message
            });
            log.debug("Sending to API.AI", {
                module: "botstack:textMessage",
                senderId: senderID,
                text: text
            });
            try {
                let apiaiResp = yield apiai.processTextMessage(text, senderID);
                fb.processMessagesFromApiAi(apiaiResp, senderID);
                botmetrics.logServerResponse(apiaiResp, senderID);
            } catch (err) {
                fb.reply(fb.textMessage("I'm sorry, I didn't understand that"), senderID);
                log.error(err, {
                    module: "botstack:textMessage",
                    senderId: senderID,
                    reason: "Error on API.AI request"
                });
                botmetrics.logServerResponse(err, senderID);
            }
        })();
    };

    _webhookPost(context) {
        let self = context;
        return function(req, res, next) {
            
            co(function* (){
                res.end();
                let entries = req.body.entry;
                //Gathering Data
                for (let entry of entries) {
                    let messages = entry.messaging;
                    let pageId = entry.id;
                    for (let message of messages) {
                        // console.log(message.message);
                        let senderID = message.sender.id;
                        //check Reddis if New Session
                        let isNewSession = yield sessionStore.checkExists(senderID);
                                                    //if new session check mongo if User Exist
                                                    // if(isnewSession){
                                                    //     let userProccessed = yield self.MongoDB.helpers.proccessUser(senderID,pageId);
                                                    // }
                        let userToBeProccessed = yield self.MongoDB.helpers.proccessUser(senderID,pageId); //Temporarily for testing as if we are a new user                        
                        const isPostbackMessage = message.postback ? true : false;
                        //Checks if message is a Quick Reply
                        let isQuickReply = false
                        if (message.message){
                            if(message.message.quick_reply){
                            isQuickReply = true
                                }}
                        //Check if message is a Text-Only msg
                        let isTextMessage = false;
                        if ('message' in message && 'text' in message.message && !(isQuickReply)) {
                            isTextMessage = true;
                        }
                        yield sessionStore.set(senderID); //Set Facebook ID in Redis session

                        // Processing of the data
                        if (isTextMessage) { //Process Text-Only-Message
                            if (userToBeProccessed) {
                                self.welcomeMessage(message.message.text, senderID);
                            } else {
                                self.textMessage(message, senderID);
                            }

                        } else if (isPostbackMessage) { //Process PostbackMessage
                            if (userToBeProccessed) {
                                self.welcomeMessage(message.postback.payload, senderID);
                            } else {
                                self.postbackMessage(message, senderID);
                            }

                        } else if (isQuickReply) { //Quick Reply
                                self.QuickReplyCommand(message.message, senderID);
                            }
                            else if (message.message){
                            if (message.message.attachments){ //TOVA IZGLEJDA BUGAVO!! - Danny // should be fixed now
                                if(message.message.attachments.type == 'image'){
                                     self.imageProccess(message.message.attachments,senderID);
                                }
                            }}
                        else {  //If everything fails Fallback
                            self.fallback(message, senderID);
                        }
                     
                    }
                }
            })();
        }
    }

    postbackMessage(postback, senderID) { //Used processing Postback Buttons from Facebook Messenger
        co(function* () {
            let text = postback.postback.payload;
            log.debug("Process postback", {
                module: "botstack:postbackMessage",
                senderId: senderID,
                postback: postback,
                text: text
            });
            botmetrics.logUserRequest(text, senderID);
            log.debug("Sending to API.AI", {
                module: "botstack:postbackMessage",
                senderId: senderID,
                text: text
            });
            //Diverts normal API.ai query to executing internal ParadiseBot commands DISCLAIMER: not used right now
            // if (BotData.BotCmdCheck(postback, senderID) == true) {
            //     console.log('\n REMARK-ParadiseBot: ' + postback.postback.payload + '()'+' was executed internally \n')
            // }
            // else 
            try {
                let apiaiResp = yield apiai.processTextMessage(text, senderID);
                fb.processMessagesFromApiAi(apiaiResp, senderID);
                botmetrics.logServerResponse(apiaiResp, senderID);
            } catch (err) {
                log.error(err, {
                    module: "botstack:postbackMessage",
                    senderId: senderID,
                    reason: "Error in API.AI response"
                });
                fb.reply(fb.textMessage("I'm sorry, I didn't understand that"), senderID);
                botmetrics.logServerResponse(err, senderID);
            }
        })();
    };

    QuickReplyCommand(postback, senderID) { //Used processing QuickReply Buttons from Facebook Messenger
        co(function* () {
            let text = postback.quick_reply.payload;
            log.debug("Process QuickReply", {
                module: "botstack:QuickReply",
                senderId: senderID,
                postback: postback,
                text: text
            });
            botmetrics.logUserRequest(text, senderID);
            log.debug("Sending to API.AI", {
                module: "botstack:QuickReply",
                senderId: senderID,
                text: text
            });
            //Diverts normal API.ai query to executing internal ParadiseBot commands
            // if (BotData.BotCmdCheck(postback, senderID) == true) {
            //     console.log('\n REMARK-ParadiseBot: ' + postback.quick_reply.payload + '()'+' was executed internally \n')
            // } else
             try {
                let apiaiResp = yield apiai.processTextMessage(text, senderID);
                fb.processMessagesFromApiAi(apiaiResp, senderID);
                botmetrics.logServerResponse(apiaiResp, senderID);
            } catch (err) {
                log.error(err, {
                    module: "botstack:QuickReply",
                    senderId: senderID,
                    reason: "Error in API.AI QuickReply response"
                });
                fb.reply(fb.textMessage("I'm sorry, I didn't understand that QuickReply"), senderID);
                botmetrics.logServerResponse(err, senderID);
            }
        })();
    };

    welcomeMessage(messageText, senderID) { //Initiates the NewUser Routine from API.ai
        botmetrics.logUserRequest(messageText, senderID);
        log.debug("Initiates the NewUser Routine from API.ai", {
            module: "botstack:welcomeMessage",
            senderId: senderID
        });
        co(function* (){
            let text = 'Hi, I am a new User' //API.ai Routine init text
            try {
                let apiaiResp = yield apiai.processTextMessage(text, senderID);
                log.debug("Facebook welcome result", {
                    module: "botstack:welcomeMessage",
                    senderId: senderID
                });
                fb.processMessagesFromApiAi(apiaiResp, senderID);
                botmetrics.logServerResponse(apiaiResp, senderID);
            } catch (err) {
                log.error(err, {
                    module: "botstack:welcomeMessage",
                    senderId: senderID,
                    reason: "Error in API.AI response"
                });
                fb.reply(fb.textMessage("I'm sorry, I didn't understand that"), senderID);
                botmetrics.logServerResponse(err, senderID);
            }
        })();
    };



    imageProccess(image, senderID) { //Processing an images sent from the SenderID
        // console.log(image);

        log.debug("Process Image message", {
            module: "botstack:imageMessage",
            senderId: senderID
        });
        co(function* (){
            let product = yield MongoDB.helpers.getProductByFbPic(image)
            console.log(product);
            if(product){             
            try {
                let text = `Image sended ${product.code}`;
                let apiaiResp = yield apiai.processTextMessage(text, senderID);
                log.debug("Facebook image result", {
                    module: "botstack:imageProccess",
                    senderId: senderID
                });
                fb.processMessagesFromApiAi(apiaiResp, senderID);
                botmetrics.logServerResponse(apiaiResp, senderID);
            } catch (err) {
                log.error(err, {
                    module: "botstack:welcomeMessage",
                    senderId: senderID,
                    reason: "Error in API.AI response"
                });
                fb.reply(fb.textMessage("I'm sorry, I didn't understand that"), senderID);
                botmetrics.logServerResponse(err, senderID);
            }
        }
        })();
    };

    fallback(message, senderID) {
        log.debug("Unknown message", {
            module: "botstack:fallback",
            senderId: senderID,
            message: message
        });
        //fb.reply(fb.textMessage("I'm sorry, I didn't understand that"), senderID);
    };

    startServer() {
        MongoDB.RestifySetup(this.server, restify, this.log)
        MongoDB.WebhookSetup(this.server, this.log)
        const port = process.env.PORT || 1337;
        const https_port = process.env.HTTPS_PORT || 1337;
        // this.server.listen(port, () => {
        //     console.log(`Bot '${this.botName}' is ready`);
        //     console.log("HTTP listening on port:%s %s %s", port, this.server.name, this.server.url);
        // });
        this.server.listen(https_port, () => {
            console.log(`Bot '${this.botName}' is ready`);
            console.log("HTTPS listening on port:%s %s %s", https_port, this.server.name, this.server.url);
        });
    }
}
module.exports = BotStack;
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     

