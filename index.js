"use strict";

require("dotenv").config();

const BotStack = require('./src/botstack.js');
const ParaBot = new BotStack('ParaBot')
ParaBot.startServer()



let GetRandomNewProduct = require('./src/BotFunctions/BotData').ProccessActioner
let Test = new GetRandomNewProduct()
let gg = Test.getRandomNewArrivalsProductPic()


