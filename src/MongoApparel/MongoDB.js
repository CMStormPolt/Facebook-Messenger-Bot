
// const port = process.env.MONGODB_PORT || 3333
// const DatabaseTitle = 'BotData'
// const url = 'mongodb://localhost:'+port+'/'+DatabaseTitle;
// console.log('MongoDB port @', port,'& Collection name:', DatabaseTitle)
// const restify = require('restify') //restify is a bettter version of express
//const server = require('restify').createServer() //the API core server
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
const log = require('../log.js');

//MongoDB Setup
var requests = 0  //total requests counter made for the session
var request_last = Date //Plans: if connection idle for 5 min=>close, on.request, open connection
const MongoURI = 'mongodb://<dbuser>:<dbpassword>@ds127260.mlab.com:27260/fb-bot'
const MongoOptions = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: 'Backup' },
  user: 'FBbot2',
  pass: 'testtest'
}
mongoose.connect(MongoURI, MongoOptions); //connecting to MongoDB


const helpers = require('./APIhelperFunctions')
module.exports.helpers = helpers
const schemas = require('./SchemaModels')
module.exports.schemas = schemas

//Initiate API Webhooks
module.exports.WebhookSetup = require('./MongoControllers').Webhooks
module.exports.RestifySetup = require('./MongoControllers').Setup

//Initiate the id collection if it doesnt exist
helpers.CreateHelperDbs(mongoose) //checks if id tables have been initiated and initiates them if needed


