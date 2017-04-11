//Server Functions to be enabled - it basically adds new methods to the req and res objects
module.exports.Setup = function Setup(server, restify, log) {

server.use(restify.acceptParser(server.acceptable)) //confirms that the API request is in the correct formatting
//server.use(restify.authorizationParser()); //Unplugged for development stage
//server.use(restify.bodyParser()) //enables req.params object to be accesable
server.use(restify.CORS());
//server.use(restify.queryParser()) //enables x-www-form-urlencoded data format to be used
server.use(restify.throttle({  //throttles all inbound connections to 
        burst: 1000, //max rate requests per sec, if available resources
        rate: 700, //avg rate requests per sec
        ip: true, //
        overrides: {
                    '192.168.1.1': {
                    rate: 0,        // unlimited
                    burst: 0
                    }
                }
        }))
    log.debug('Custom Restify setup passed', {
    module: "MongoDB:WebhookController",
    });
}
//Server Functions to be enabled END


//Load helper API Helper Functions
// const schemas = require('./SchemaModels.js')
const helpers = require('./APIhelperFunctions')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
const Promise = require('bluebird')

const UserModel = mongoose.model('User')
const ProductModel = mongoose.model('Product')

module.exports.Webhooks = function Webhooks(server, log){

    //Retrieve all user - temporarily on
    server.post('/clientAPI/:cmd', (req, res, next) => {
        console.log('Cmd request recieved:',req.params.cmd)
            if(req.params.cmd == undefined){
                helpers.failure(res, next, 'Function not found',404)
            }
            let result = eval(req.params.cmd)
            console.log('result?',result)
            helpers.success(res, next, result)

         })
       
    //Retrieve a single user
    server.get('/user/:id', (req, res, next) => {
        
        ProductModel.findOne({_id:req.params.id}, (err, user)=>{
            //console.log(user)
            if(user === undefined){
                helpers.failure(res, next, 'User not found',404)
            }
            helpers.success(res, next, user)
            console.log('User data retrieved and sent')
         })
    })
    //Retrieve a single product

    server.get('/product/:code', (req, res, next) => {
        ProductModel.findOne({code:req.params.code}, (err, product)=>{
            if(product === undefined){
                helpers.failure(res, next, 'Product not found',404)
            }
            helpers.success(res, next, product)
            console.log('Product data retrieved and sent')
         })
         
    })
        //Recieve a single Product
    server.post('/product', (req, res, next) => {
        let array = req.body;
            array.forEach(function(product,index){
                helpers.CreateProduct(product)
                console.log(product)
            })
        res.send('Let\'s see if it works...');
    })

    //Update an user
    server.put('/user/:id', (req, res, next) => {
        UserModel.findOne({_id:req.params.id}, (err, user)=>{
            if(user === undefined){
                helpers.failure(res, next, 'User not found',404)
            }
            let updates = req.params
            delete updates.id //remove Mongo ID from the loop
            for (let field in updates) {
                user[field] = updates[field]
            }
            helpers.success(res, next, user)
            console.log('User data retrieved and updated')
         })
        })

    //Add a new user
    server.post('/user', (req, res, next) => {
        let user = new UserModel()
        let options = req.params
            let userId = options.id
            options.User_id = helpers.GetParadiseId()
            delete options.id //remove Mongo ID from the loop
            /*for (let field in options) {
                user[field] = options[field]
            }*/
            user.create(options, function (err) { //actually saving to the database
                    if (err) return handleError(err);
                    else {
                        console.log('New User created with id: s%', userId)
                    }
                    })
            helpers.success(res, next, user)
    })

    //Delete an user
    server.del('/user/:id', (req, res, next) => {
        delete users[parseInt(req.params.id)]
         UserModel.findOne({_id:req.params.id}, (err, user)=>{
            if(user === undefined){
                helpers.failure(res, next, 'User not found',404)
            }
            var updates = req.params
            delete updates.id //remove Mongo ID from the loop
            for (let field in updates) {
                user[field] = updates[field]
            }
            helpers.success(res, next, user)
            console.log('User data retrieved and updated')
         })
    })
log.debug('Custom Webhooks setup passed', {
      module: "MongoDB:WebhookController",
  });
};