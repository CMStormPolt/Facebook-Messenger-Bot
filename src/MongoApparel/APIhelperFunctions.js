const Promise = require('bluebird')
let mongoose = require('mongoose')
mongoose = Promise.promisifyAll(mongoose)
mongoose.Promise = require('bluebird');
const schemas = require('./SchemaModels')
const co = Promise.coroutine;
const fs = Promise.promisifyAll(require('fs'))
const http = require('http');

//API response functions
function _respond(res, next, status, data, http_code){
    let response ={
    'status': status,
    'data': data
    }
    res.setHeader('content-type', 'application/json')
    res.writeHead(http_code)
    res.end(JSON.stringify(response)) 
    return next()
}

function _respond2(status, data, http_code){
    let response ={
    'status': status,
    'data': data
    }
    res.setHeader('content-type', 'application/json')
    res.writeHead(http_code)
    res.end(JSON.stringify(response)) 
    return
}

function success(res, next, data){
    _respond(res, next, 'success', data, 200)
}
exports.success = success

function failure(res, next, data, http_code){
    _respond(res, next, 'failure', data, http_code)
}
exports.failure = failure

//=================Find products and return image location================== to be improved
function FilterWomensCategory() {
    return new Promise((res,rej)=>{
        ProductModel.findAsync({code:'SD'})
        .then((product)=>{
            res(product.pictures[0])
        })
          })
    }
exports.FindWomensRandom = FindWomensRandom

function FindWomensRandom(req, res, next) {
    return new Promise((res,rej)=>{
        let pic
        FilterWomensCategory().then((loc)=>{
        pic = fs.read
        //ProductModel.findOneAsync({code:req.params.code})
          })
    })
    }
exports.FindWomensRandom = FindWomensRandom

//=================ID generators================== to be improved

function CreateHelperDbs(mongoose){ //Initiates global variables DB
    const HelperDbs = mongoose.model('HelperDbs')
    HelperDbs.find({}, (err, data)=>{
                if (data.length > 0) { //checks if there is a helper dbs existing
                console.log('HelperDbs Already exist, you no wanna reset them..')
                return 'HelperDbs Already exist'
                }
    else {
        let NewHelperDbs = new HelperDbs
        NewHelperDbs.save()
        .then((data)=>{
            console.log(NewHelperDbs)
            console.log('HelperDbs initiated with default values of 0')
            return
        })}
    })
}
module.exports.CreateHelperDbs = CreateHelperDbs;


// ===================USAGE EXAMPLE=======================
// ===================Id-Incrementer=======================
// helpers.IncrId('HelperDbs', 'picture_id')     //helpers. is an arbitrary ref to the file iwth helper functions

function IncrId(collection, IdKey){  //Use this to increment any of our ids when creating new Documents that need it
    const collectionObj = mongoose.model(collection); //Default collection: 'HelperDbs'
    return new Promise((resolve, reject, err)=>{
            collectionObj.find((IdKey))             //IdKey is the name of the id variable in the DB
            .then((data)=>{data = data[0][IdKey]; return data}) //just for visualizing the id before the callback
            .then((idOld)=>{    let id =new Promise((resolve, reject ,err)=>{
                                let updated={}
                                updated[IdKey] = idOld + 1
                                collectionObj.findOneAndUpdate(IdKey, {$set:updated},{new: true},function(err, data){
                                                if (err){resolve(err)}
                                                //else{console.log('New '+IdKey+' generated:', data[IdKey])}
                                                resolve(data[IdKey])
                                            })
                                    }); resolve(id)})
            .catch(err)
        })
}
module.exports.IncrId = IncrId;

//=================Switch between Id tags======================

function SwitchId2Location(IdTag){
    let location = null
    switch(IdTag){
        case 'Address':location="postal_addresses";break;
        case 'Cart':location="shopping_cart";break;
        case 'SenderId':location="FBinfo";break;
        case 'Interaction':location=["user_stats","user_interactions"];break;
        case 'Order':location="past_orders";break;
        case 'SalesAgent':location="SalesAgent";break;
        case 'Item':location=["shopping_cart","Items"];break;
    }
    return location
}
module.exports.SwitchId2Location = SwitchId2Location;
// ===================Add a created Schema Type to the User Profile=======================
function addSchemaToUser(userQuery, SchemaName, SchemaId){  //User query should usualyl be the User Id, SchemaName = Model name, SchemaId = individual schema id from our Helpers dbs
    let collectionObj = mongoose.model('User');
    let schemaObj = mongoose.model(SchemaName);
    let SchemaKey = Object.keys(SchemaId)[0]
    let ObjDestination = SwitchId2Location(SchemaName)
    return new Promise(function(resolve, reject) {
        schemaObj.findOne(SchemaId)
                .then((Schema)=>{
                    let UserObj = Schema
                    //console.log('Schema Id added:',Schema._id)
                    collectionObj.findOne(userQuery)
                            .then((User)=>{
                                    if(!(ObjDestination instanceof Array))
                                    {User[ObjDestination].push(Schema); return User}
                                    else {if (ObjDestination[0] === 'shopping_cart') // A Hack around the nested Array issue; MAYBE? OK?
                                            {User.shopping_cart[0].Items.push(Schema); return User}
                                            else { User[ObjDestination[0]][ObjDestination[1]].push(Schema); return User}}})
                            .then((User)=>{User.save();console.log('Adding '+SchemaName+' to User with Id:',User._id);return User})
                            .then((User)=>{resolve(User)})    //injects into the user
            })
        })};
module.exports.addSchemaToUser = addSchemaToUser;
// // ===================Add a created Schema Type to the User Profile========END============

// ===================Add a created Schema Type to the User Profile=======================
function addSchemaToProduct(ProductQuery, SchemaName, SchemaId){  //Product query should usualyl be the Product Id, SchemaName = Model name, SchemaId = individual schema id from our Helpers dbs
    let collectionObj = mongoose.model('Product');
    let schemaObj = mongoose.model(SchemaName);
    let SchemaKey = Object.keys(SchemaId)[0]
        let ObjDestination = SchemaName.toLowerCase()+'s'
    return new Promise(function(resolve, reject) {
        schemaObj.findOne(SchemaId)
                .then((Schema)=>{
                    let ProductObj = Schema
                    //console.log('Schema Id added:',Schema._id)
                    collectionObj.findOne(ProductQuery)
                            .then((Product)=>{Product[ObjDestination].push(Schema); return Product})
                            .then((Product)=>{Product.save();console.log('Adding '+SchemaName+' to Product with Id:',Product._id);return Product})
                            .then((Product)=>{resolve(Product)})    //injects into the Product
            })
        })};
module.exports.addSchemaToProduct = addSchemaToProduct;
// // ===================Add a created Schema Type to the Product Profile========END============

// ===================Create a NEW SchemaObj===============================
function CreateSchema(SchemaTag, DataObj, AddObject){  //creates a new Schema and updates the User_id
    let collectionObj = mongoose.model(SchemaTag);
    return new Promise((resolve, reject, err)=>{
        let Response, id
        collectionObj.create(DataObj)
            .then((data)=>{id = IncrId('HelperDbs', SchemaTag+'_id'); Response = data; return id})
            .then((id)=>{
                         collectionObj.findOne(Response._id,function(err, Schema){
                                if (err){return err}
                                else{return Schema}
                            })
            .then((Schema)=>{if(AddObject){Schema = Object.assign(Schema,AddObject)}; return Schema})
            .then((Schema)=>{Schema.save(); return Schema}) //saves the User_id to Mongo
            .then((Schema)=>{resolve(Schema)})
            .catch(err)
        })
    })}
module.exports.CreateSchema = CreateSchema;
// ===================Create a NEW ItemObj=======================END=============
function SavePictures(DataObj,ProductCode){
            let i = 0
            let length = DataObj.length
            ProductCode = ProductCode.replace(/ /g,"_")
            let dest = __dirname+'/pictures/'+ProductCode

            if (!fs.existsSync(dest)){fs.mkdirSync(dest)} //creates the dir if its new

            const download = function(url, file_dest,i,length) { //downloads a single file and saves
                return new Promise((resolve, reject, err)=>{
                            let file_dest = dest+'/'+ProductCode+'-'+i+'.jpg'
                            let file = fs.createWriteStream(file_dest);
                            let request = http.get(url, function(response) {
                                response.pipe(file);
                                file.on('finish', function() {
                                    file.close()  // close() is async, call cb after close completes.
                                    resolve(file_dest);
                                });
                            }).on('error', function(err) { // Handle errors
                                fs.unlink(dest); // Delete the file async. (But we don't check the result)
                        });
                    })};
        return new Promise((resolve, reject, err)=>{
                new Promise.map(DataObj, (DataNode)=>{ //executes a function for each value of DataObj and returns an Array
                i++
                return download(DataNode,dest,i,length)
        },{concurrency:2}).then((data)=>{if(data.length=i){resolve(data)}})
    })
}
module.exports.SavePictures = SavePictures;

function CreatePictureSchemas(PicLocationArray, ProductCode){
            let i = -1
            let len = PicLocationArray.length
                return new Promise((resolve, reject, err)=>{
                new Promise.map(PicLocationArray,(DataNode)=>{     //executes a function for each value of DataObj and returns an Array
                i++
                let ThePicture = new schemas.Picture
                let AddObject = {'location':PicLocationArray[i],'code':ProductCode}
                return CreateSchema('Picture', ThePicture, AddObject)
        },{concurrency:1}).then((data)=>{if(data.length=len){resolve(data)}})
    })
}

module.exports.CreatePictureSchemas = CreatePictureSchemas;

function CreatePriceSchema(PricesArray, ProductCode){
                let ThePrice = new schemas.Price
                let len = PricesArray.length
                for(i=0; i<len; i++){
                    let a = PricesArray[i].currency
                    if(a==="LEI"){a='RON'}
                    let b = PricesArray[i].price
                    ThePrice[a]=b
                }
                ThePrice.code = ProductCode
                return new Promise((resolve, reject, err)=>{
                    //console.log('==============',ThePrice)
                CreateSchema('Price', ThePrice)
                .then((data)=>{if(data.length=len){resolve(data)}})
         })}


module.exports.CreatePictureSchemas = CreatePictureSchemas;

function CreateProduct(DataObj){
    let NewProduct = new schemas.Product
    const gen = co(function* (){
                let PicLocationArray = yield SavePictures(DataObj.images, DataObj.code)
                let PicturesIDsArray = yield CreatePictureSchemas(PicLocationArray, DataObj.code)
                let SizesArray = DataObj.sizes
                let PriceObj = yield CreatePriceSchema(DataObj.prices, DataObj.code)
                NewProduct.pictures = PicturesIDsArray
                NewProduct.sizes = SizesArray
                NewProduct.prices = PriceObj
                NewProduct.code = DataObj.code
                NewProduct.title = DataObj.Title
                NewProduct.date_added = DataObj.date_added
                NewProduct.tags = DataObj.tags
                NewProduct.colors = DataObj.colors
                NewProduct.supplier = DataObj.supplier
                NewProduct.weight = DataObj.weight
                NewProduct.comments = DataObj.comments
                //console.log(NewProduct)
                let Product = yield CreateSchema('Product', NewProduct)
                console.log(Product._id+'Product generated: '+Product.code+'\n')
                        })
        gen()

}
module.exports.CreateProduct = CreateProduct;