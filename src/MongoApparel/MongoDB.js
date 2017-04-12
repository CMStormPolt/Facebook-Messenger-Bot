
// const port = process.env.MONGODB_PORT || 3333
// const DatabaseTitle = 'BotData'
// const url = 'mongodb://localhost:'+port+'/'+DatabaseTitle;
// console.log('MongoDB port @', port,'& Collection name:', DatabaseTitle)
// const restify = require('restify') //restify is a bettter version of express
//const server = require('restify').createServer() //the API core server
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
const log = require('../log.js');
const co = require('bluebird').coroutine;

let fakeUser = require('./FakeUser.js').FakeUser;
let schemas = require('./SchemaModels')

//MongoDB Setup
var requests = 0  //total requests counter made for the session
var request_last = Date //Plans: if connection idle for 5 min=>close, on.request, open connection
// const MongoURI = 'mongodb://<dbuser>:<dbpassword>@ds127260.mlab.com:27260/fb-bot'
const MongoURI = process.env.MongoURI //dev db
const MongoOptions = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: 'Backup' },
  user: 'FBbot2',
  pass: 'testtest'
}
// mongoose.connect(MongoURI, MongoOptions); //connecting to MongoDB
mongoose.connect(MongoURI) //dev connection

const helpers = require('./APIhelperFunctions')
// fakeUser(schemas,helpers,co); test user creation

module.exports.helpers = helpers
// const schemas = require('./SchemaModels')
// module.exports.schemas = schemas

//Initiate API Webhooks
module.exports.WebhookSetup = require('./MongoControllers').Webhooks
module.exports.RestifySetup = require('./MongoControllers').Setup

//Initiate the id collection if it doesnt exist
helpers.CreateHelperDbs(mongoose) //checks if id tables have been initiated and initiates them if needed



 //testing DB here
// helpers.getProductByFbPic({'url':'http://cms.flameflame.eu/uploads/523/14828334241467361765-sum15-4_sum15-1_front_resized.jpg'}).then(console.log);
// helpers.getProductFromDb('sd143').then(function(product){
//   helpers.getRandomConnectedProduct(product)
//          .then(console.log);
// })
// helpers.getProductFromDb('sd143').then(function(product){
//   let randompic = helpers.getRandomImageOfProduct(product)
//   console.log(randompic);
// }
// helpers.findByFbIdAndUpdate('1256338254484843',{$push:{'FBinfo.products_seen':'randomProduct'}})
//        .then(console.log);
