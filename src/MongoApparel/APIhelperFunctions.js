const Promise = require('bluebird')
let mongoose = require('mongoose')
mongoose = Promise.promisifyAll(mongoose)
mongoose.Promise = require('bluebird');
const schemas = require('./SchemaModels')
const co = Promise.coroutine;
const fs = Promise.promisifyAll(require('fs'))
const http = require('http');
const botData = require('../BotFunctions/BotData');

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
                            .then((Product)=>{
                                Product[ObjDestination].push(Schema); return Product
                            })
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
//sasho code

  //CreateProduct Sasho implementation (more simple);
function CreateProduct(DataObj){
    return new Promise(function(resolve,reject){
        let NewProduct = new schemas.Product();
                NewProduct.code = DataObj.code
                NewProduct.date_added = DataObj.date_added
                NewProduct.tags = DataObj.tags
                NewProduct.colors = DataObj.colors
                NewProduct.category = DataObj.category
                NewProduct.onsale = DataObj.onsale;
                NewProduct.fit = DataObj.fit;
                NewProduct.fabric_quality = DataObj.fabric_quality;
                NewProduct.manufacturing_quality = DataObj.manufacturing_quality;
                NewProduct.season = DataObj.season;
                NewProduct.restockable = DataObj.restockable;
                NewProduct.new_delivery_expected = DataObj.new_delivery_expected;
                NewProduct.related_products = DataObj.related_products;
                NewProduct.product_speed = DataObj.product_speed;
                NewProduct.weight = DataObj.weight
                NewProduct.sizes = DataObj.sizes;
                NewProduct.prices = DataObj.prices;
                NewProduct.images = DataObj.images;
            NewProduct.save()
                      .then(resolve)
                      .catch(reject)
        })
    }



module.exports.CreateProduct = CreateProduct;



    //creates new user and saves it to db
function createUser(senderId,pageId){
    return new Promise(function(resolve,reject){
        let newUser = new schemas.User;
        let fbinfo;
        const gen = co(function* (){
            fbinfo = yield botData.GetUserNames(senderId);
            console.log(fbinfo);
            newUser.FBpage_id = pageId;
            newUser.FBinfo = {
                'SenderId': senderId,
                'f_name': fbinfo.first_name,
                'l_name': fbinfo.last_name,
                'gender': fbinfo.gender
            }
            let savedUser = yield newUser.save();
            resolve(savedUser);
    })
     gen();
    })
}
module.exports.createUser = createUser;


//finds user by facebook ID
function findUserByFbId(senderId){
    return new Promise(function(resolve,reject){    
      schemas.User.findOne({'FBinfo.SenderId': senderId})
                              .then(function(dbres){
                                  resolve(dbres);
            });
    })
}
module.exports.findUserByFbId = findUserByFbId;

//checks if user is registered in db
function proccessUser(senderId,pageId){
    return new Promise(function(resolve,reject){
        const func = co(function* (){
        let isOldUser = yield findUserByFbId(senderId);
        if (isOldUser){
            resolve(false);
        } else {
           let newUser = yield createUser(senderId,pageId);
           resolve(newUser);
            }
        })
        func();
    })
}
module.exports.proccessUser = proccessUser;


//finds and updates user
function findByFbIdAndUpdate(senderId,args){
    return new Promise(function(resolve,reject){
        schemas.User.update({'FBinfo.SenderId': senderId},args)
                    .then(resolve);
    })
}
module.exports.findByFbIdAndUpdate = findByFbIdAndUpdate;


//finds total number of collection items
function findCountFromDb(collectionName){
    schemas[collectionName].count()
                           .then(console.log);
}
module.exports.findCountFromDb = findCountFromDb;

//gets single Product by product code from DB;
function getProductFromDb(productCode){
    return new Promise(function(resolve,reject){
        schemas.Product.findOne({'code':productCode})
                       .then(resolve)
                       .catch(reject);
    })
}
module.exports.getProductFromDb = getProductFromDb;
//gets a random product from the db
function getRandomProductFromDb(){
    return new Promise(function(resolve,reject){
        schemas.Product.find({})
            .then(function(allProducts){
                let len = allProducts.length;
                let randomNumber = Math.floor(Math.random() * len);
                let randomProduct = allProducts[randomNumber];
                    resolve(randomProduct);
                       })
    })
}
module.exports.getRandomProductFromDb = getRandomProductFromDb
// gets last seen product form the user in db
function getLastSeenProductFromDb(userObj){
    let len = userObj.FBinfo.products_seen.length;
    let lastSeenProduct = userObj.FBinfo.products_seen[len - 1];
        return lastSeenProduct;
}
module.exports.getLastSeenProductFromDb = getLastSeenProductFromDb;

function getLastSeenProductCode(senderId){
      return new Promise(function(resolve,reject){
        findUserByFbId(senderId)
                       .then(function(userObj){
                         let product = getLastSeenProductFromDb(userObj)
                        resolve(product);
                       })
        })
    }
module.exports.getLastSeenProductCode = getLastSeenProductCode;

//gets sizes of a product
function getLastSeenProductSize(product){
    let product_size = '';
    for(let size of product.sizes){    
        product_size += (size.title + ',');
     }
        product_size = product_size.slice(0,-1)
        return product_size;
}
module.exports.getLastSeenProductSize = getLastSeenProductSize
// gets price of a product
function getLastSeenProductPrice(product){
    let product_price = product.prices[0].price;
        return product_price;
}
module.exports.getLastSeenProductPrice = getLastSeenProductPrice;

//gets a random picture for a product
function getRandomImageOfProduct(product){
    let randomRange = product.images.length,
        randomNumber = Math.floor(Math.random() * randomRange);
        return product.images[randomNumber].url;
}
module.exports.getRandomImageOfProduct = getRandomImageOfProduct;

//gets random product in same category
function getRandomConnectedProduct(product){
    return new Promise(function(resolve,reject){
          schemas.Product.find({'category': product.category})
          .then(function(connectedProducts){
              let len = connectedProducts.length;
              let singleConnected =  connectedProducts[Math.floor(Math.random()*len)];
              resolve(singleConnected);
          })
    })
}
module.exports.getRandomConnectedProduct = getRandomConnectedProduct;


//gets a product by a posted fb picture
function getProductByFbPic(fb_pic){
    //  let array = fb_pic.url.split('/'), //commented for now when we get the id system going uncomment
    //      id = array[array.length - 2]   //commented for now when we get the id system going uncomment
          id = fb_pic.url;
         return new Promise(function(resolve,reject){
            schemas.Product.findOne({'images.url':id})
                   .then(function(product){
                       resolve(product)
                   })
                   .catch(reject);
         })
}
module.exports.getProductByFbPic = getProductByFbPic;

//Return all products added within specified dates
function findProductsbyDateRange(startDate, endDate){
    return new Promise(function(resolve,reject){    
      schemas.Product.find({code: { $not: /MS*/ },date_added: {$gte: startDate, $lte: endDate}}).where('code')
                              .then((data)=>{
                                  resolve(data);
                                 });
        });
    }
module.exports.findProductsbyDateRange = findProductsbyDateRange;

function mongoDB_addProductToUserWishList(user){
    return new Promise(function(resolve,reject){
        let product = getLastSeenProductFromDb(user);
        user.FBinfo.wish_list.push(product);
        user.save().then(function(savedResult){
            resolve(true);
        })
            .catch(function(MongoError){
                resolve(console.log(MongoError));
            })
    })
}
module.exports.mongoDB_addProductToUserWishList = mongoDB_addProductToUserWishList;

function getBestSellersProducts(){
    return new Promise(function(resolve,reject){
        schemas.Product.find().limit(4).then(function(products){
            if(products){
                resolve(products);
            } else {
                resolve(false);
            }
        })
    })
}
module.exports.getBestSellersProducts = getBestSellersProducts;

//filters the product by removing the products the user has already seen
function filterProductsToShowWithSeenProducts(allProducts,user){
    return new Promise(function(resolve,reject){
        let func = co(function*(){
    //gets the seen products array from the user
    let seenProducts = user.FBinfo.products_seen;
    //the array we will return to show
    let productsToShow = [];
    // filter the allProducts array by removing the already seen products
    productsToShow = allProducts.filter( function( productAll ) {
     return !(seenProducts.find( function(seenProduct){
      return productAll.code == seenProduct.code
         }));
    });
    //if user has seen all products cleans user products seen and returns all the products
    if(productsToShow.length == 0){
        yield deleteProductsSeenFromUser(user)
        resolve(allProducts)
    }
    //resolves with the filtered products we want to show
    resolve(productsToShow);
        })
        func();
    })
}
module.exports.filterProductsToShowWithSeenProducts = filterProductsToShowWithSeenProducts;

//gets a random product from already recieved array and returns it
function getRandomProductFromArray(productsArray){
    let len = productsArray.length;
    let randomNumber = Math.floor(Math.random() * len);
    let randomProduct = productsArray[randomNumber];
    return randomProduct;
}
module.exports.getRandomProductFromArray = getRandomProductFromArray;

// cleans all products from user products seen array
function deleteProductsSeenFromUser(user){
    return new Promise(function(resolve,reject){
        user.FBinfo.products_seen = [];
        user.save()
            .then(function(mongoResult){
                resolve(true);
            })
    })   
}
module.exports.deleteProductsSeenFromUser = deleteProductsSeenFromUser;