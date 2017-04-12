"use strict";

require("dotenv").config();

const BotStack = require('./src/botstack.js');
const ParaBot = new BotStack('ParaBot')
ParaBot.startServer()






