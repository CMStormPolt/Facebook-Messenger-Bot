"use strict";

require("dotenv").config();

const BotStack = require('./src/botstack.js');
const ParaBot = new BotStack('ParaBot')
ParaBot.startServer()


// module.exports = require('./src/botstack.js');
// module.exports = require('./src/BotFunctions/ParadiseBot.js');
// module.exports = require('./src/MongoApparel/MongoDB.js');



/* MongoDB tests

MongoDB.Add({'fName':'Danail',
             'lName':'Irinkov',
             'Nick':'Dan',
             'Address':'ul. Aleko Konstantinov 10'
        })
*/

/*
const botstart = require('./src/botstack')
console.log(botstart)
new botstart.BotStack()  

const bbb = new BotStack.startServer()
bbb()
*/