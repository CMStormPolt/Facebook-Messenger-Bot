"use strict";
const fb = require("../fb.js");
const Promise = require('bluebird');
const co = Promise.coroutine
const {FB, FacebookApiException} = require("fb")
const time = require('date-and-time')
const fs = require('fs')

const MongoDB = require('../MongoApparel/MongoDB')


//Useful Objects for Facebook - not used yet
function SwitchPback2Reply(PostbackPayload){
    switch(PostbackPayload){
        case 'GoToFAQ':GoToFAQ;break;
        case 'FAQdelivery':FAQdelivery;break;
        case 'startFAQ':startFAQ;break;
        case 'startfindProducts':startfindProducts;break;
        case 'startOffers':startOffers;break;
        case 'startGPSpics':startGPSpics;break;
        case 'QuickReplies':QuickReplies;break;
    }
    return location
}

const BotCommands = ['BOT_Track_Suits','FAQdelivery','startFAQ', 'startfindProducts', 'startOffers', 'startGPSpics', 'BOTOn_Sale']
exports.BotCommands = BotCommands

    //ParadiseBot functions

    //Checks if the FB.postback is an internal command and redirects execution to our Bot functions
    function BotCmdCheck(message, SenderID) {
      let payload
      if (message.postback){
      payload = message.postback.payload
    }
      else if (message.quick_reply){
          payload = message.quick_reply.payload
        }

if(payload !== undefined){
      if (BotCommands.indexOf(payload) !== -1) {
        //console.log(postback.postback.payload+'()')
        eval(payload + '(SenderID)')
        return true
      }}

      else {
        return false
      }
    };
    
exports.BotCmdCheck = BotCmdCheck


  function startFAQ(SenderID) {
      let FAQ = {
        'title':'Which topic bugs you?',
        'replies':['Delivery', 'Exchanges', 'Quality']
      }
      fb.reply(fb.quickReply(FAQ), SenderID)
    };
exports.startFAQ = startFAQ

    function startfindProducts(SenderID) {
      let Search = {
        'title':'Ok, Great :)) You can pick a category, or simply type a product code :)',
        'replies':['New Arrivals', "Women's", "Men's", 'On Sale']
      }
      fb.reply(fb.quickReply(Search), SenderID)
    };
exports.startfindProducts = startfindProducts

    function BOT_Track_Suits(SenderID){
      let Buttons = {}
      Buttons.replies = ['Horrid',"It's ok",'Like it :)', 'Show All Images']
      let QR = fb.ImageQR(Buttons)

      fb.reply({
            quick_replies:QR.quick_replies,
            attachment: {
                  type: "image",
                  payload: {url: 'https://cms.flameflame.eu/uploads/1/1485862218SD110_(1)_resized.jpg'}
             },
        }, SenderID)
    };
exports.BOT_Track_Suits = BOT_Track_Suits


    function BOT_New_Arrivals(SenderID){
      let Buttons = {}
      Buttons.replies = ['Horrid',"It's ok",'Like it :)', 'Show All Images']
      let QR = fb.ImageQR(Buttons)

      fb.reply({
            quick_replies:QR.quick_replies,
            attachment: {
                  type: "image",
                  payload: {url: 'https://cms.flameflame.eu/uploads/1/1485862218SD110_(1)_resized.jpg'}
             },
        }, SenderID)
    };
exports.BOT_New_Arrivals = BOT_New_Arrivals


    function startOffers(SenderID) {
      let Promo = {
        'title':'Lovely <3 :)) You can click on the button to show next items :)',
        'replies':["Keep 'em coming"]
      }
      fb.reply(fb.quickReply(Promo), SenderID)
    };
exports.startOffers = startOffers



    function startGPSpics(SenderID) {
      GetUserData(SenderID)
    };
exports.startGPSpics = startGPSpics


    function FAQdelivery(){
      fb.reply(QuickReplies(FAQ.delivery, 'Go Back', 'startFAQ'))
    };
exports.FAQdelivery = FAQdelivery

    
    
    function GreetForTimeOfDay() {
      let t = new Date()
      let t2 = time.format(t, 'HH');
      console.log(Greetings[t2]+': was sent as a greeting')
      return Greetings[t2]
    }
 
    function RecordNickName(nick, SenderID){};


    function GetUserNames(SenderID, FirstOrLast) {
      return new Promise((resolve, reject)=>{
      FB.setAccessToken(process.env.FB_PAGE_ACCESS_TOKEN);
      FB.api(
        '/'+SenderID,
        'GET',
        {"fields":"first_name,last_name,gender"}, (names)=>{console.log(names);resolve(names)}
      )
  })

      };
exports.GetUserNames = GetUserNames

function AppropriateRespect(message,senderId){
    return new Promise((res,rej)=>{
    GetUserNames(senderId)
    .then((names)=>{
            let gender = names.gender
            names.MrMs = ()=>{if(gender == 'male'){return ('Mr.')}else if(gender == 'female'){return ('Ms.')}}

            if (gender == null){names.first_name="";names.last_name="";names.MrMs=":)"} 

            message.text = message.text.replace('$MrMs',names.MrMs)
            message.text = message.text.replace('$f_name',names.first_name)
            message.text = message.text.replace('$l_name',names.last_name)
            res(message)
        })
    })
}
exports.AppropriateRespect = AppropriateRespect

    //End of ParadiseBot functions

//This function creates an OBJECT for fb.reply to use
function QuickReplies(message, Button1Title, Button1Payload, Button2Title, Button2Payload, Button3Title, Button3Payload, Button4Title, Button4Payload) {
  if (message == "") {
    return null;
  } else {
    return {
      "text": message,
      "quick_replies": [
        {
          "content_type": "text",
          "title": Button1Title,
          "payload": Button1Payload
        },
        {
          "content_type": "text",
          "title": Button2Title,
          "payload": Button2Payload
        },
        {
          "content_type":"text",
          "title":Button3Title,
          "payload":Button3Payload
        },
        /* 
        {
          "content_type":"text",
          "title":Button4Title,
          "payload":Button4Payload
        },
       {
          "content_type":"text",
          "title":Button5Title,
          "payload":Button5Payload
        },
        {
          "content_type":"text",
          "title":Button6Title,
          "payload":Button6Payload
        }*/
      ]
    }
  }
};
exports.QuickReplies = QuickReplies


    //Object of Persistent Menu
    // For more information Google - Facebook Messanger docs Persistent Menu 
    const BotMenu = {
      "setting_type": "call_to_actions",
      "thread_state": "existing_thread",
      "call_to_actions": [
        {                     //Initiates a Button in the menu
          "type": "postback", //type of response from the button
          "title": "Delivery, Returns & Quality", //Text shown on the button and chat
          "payload": "startFAQ"  //payload = string, sent back to the Bot
        },
        {
          "type": "postback",
          "title": "New Arrivals & Search",
          "payload": "startfindProducts"
        },
        {
          "type": "postback",
          "title": "Promo Offers",
          "payload": "startOffers"
        },
        {
          "type": "postback",
          "title": "Show user-test",
          "payload": "startGPSpics"
        },
        {
           "type": "web_url",
           "title": "Go to www.ParadiseShop.eu",
           "url": "https://paradiseshop.eu",
           "webview_height_ratio": "full",
           "messenger_extensions": false
         }
       
        /*-Maximum number of menu items allowed 5 
         {
          "type": "web_url",
          "title": "View Website",
          "url": "https://paradiseshop.eu"
        },
         */
      ]
    };
exports.BotMenu = BotMenu

//Buttons Object for Facebook (for Tests)
function ButtonsObj(postBackButton1, postBackButton2) {
return {
    attachment: {
          type: 'template',
          payload: {
              template_type: 'button',
              text: 'Melinda Here :) Choose your destiny:',
              buttons: [postBackButton1, postBackButton2]
        }
      }
    }};

//End of Useful Objects for Facebook

//sasho code
  //class for proccessing api ai action calls
class ProccessActioner{
  constructor(){
  }
  //main function calls other class methods
  processAction(senderId,action,result){
      if(this[action]){
        return Promise.resolve(this[action](senderId,result))
    } else {
      return Promise.resolve(true);
    }
  } //save names to db user
   setNames(senderId,result){
      return new Promise(function(resolve,reject){
         MongoDB.helpers.findByFbIdAndUpdate(senderId.toString(),{'FBinfo.f_name': result.parameters.f_name,'FBinfo.l_name': result.parameters.l_name})
         .then(function(result){
           resolve(true);
         })
      })
      
   } //save city to db user
   setCity(senderId,result){
     return new Promise(function(resolve,reject){
      MongoDB.helpers.findByFbIdAndUpdate(senderId.toString(),{'FBinfo.living_in': result.parameters.city.city,'FBinfo.country': result.parameters.city.country})
                     .then(function(result){
                       resolve(true);
                     })
     })
     return 
   } //save nickname to db user
   setNickname(senderId,result){
     let nickname = result.parameters.nickname;
     return new Promise(function(resolve,reject){
         MongoDB.helpers.findByFbIdAndUpdate(senderId.toString(),{'nick': nickname,})
                         .then(function(result){
                            resolve(true)
               })
          })
   }


   // gets the product by its code and resolves its price
   getPriceProduct(senderId,result){
     //gets code from context about product
     return new Promise(function(resolve,reject){
      let productCode = result.contexts.find(function(context){
       return context.name = 'imagesended-followup' }).parameters.product_code;
      let func = co(function* () {
        let product = yield MongoDB.helpers.getProductFromDb(productCode);
       if(product){
         let product_price = product.prices[0].price;
         //sends product price to api ai proccesser
        resolve(
          {
          $product_price: product_price
        });
       }
     })
     func();
     })
   }


   // finds product and returs its size
   getSizeProduct(senderId,result){
     //gets code from context about product
     return new Promise(function(resolve,reject){
      let productCode = result.contexts.find(function(context){
       return context.name = 'imagesended-followup' }).parameters.product_code;
      let func = co(function* () {
        let product = yield MongoDB.helpers.getProductFromDb(productCode);
       if(product){
         let product_size = '';
         for(let size of product.sizes){
           product_size += (size.title + ',');
         }
         product_size = product_size.slice(0,-1)
         //sends product price to api ai proccesser
        //  console.log(product_size);
        resolve(
          {
          $product_size: product_size
        });
       }
     })
     func();
     })
   }   

    getRandomProduct(senderId,result){
      return new Promise(function(resolve,reject){
        let func = co(function* (){
          let randomProduct = yield MongoDB.helpers.getRandomProductFromDb();
          let userUpdated = yield MongoDB.helpers.findByFbIdAndUpdate(senderId,{$push:{'FBinfo.products_seen':randomProduct}});
          let randomPhoto = MongoDB.helpers.getRandomImageOfProduct(randomProduct);
          console.log('get random photo =============================================================')
          console.log(randomPhoto);
            resolve({
              attachment: randomPhoto
            })
        })
        func();
      })
   }
   // gets names and honorifics for current user 
    greetings(senderId,result){
      return new Promise(function(resolve,reject){
        let func = co(function* (){
          let user = yield MongoDB.helpers.findUserByFbId(senderId);
          let $mrms = 't/a';
          if(user.FBinfo.gender == 'male'){ //PROBLEM - If we dont know the gender? Always Ms? - Danny
            $mrms  = 'Mr'
          } else {
            $mrms = 'Ms'
          }
           resolve({
             $f_name: user.FBinfo.f_name,
             $l_name: user.FBinfo.l_name,
             $mrms: $mrms
           });
        })
        func();
      })
    }



    //gets random photo of connected product and sends it to api ai
    getRandomConnectedProductPic(senderId,result){
      return new Promise(function(resolve,reject){
        let func = co(function* (){
          let code = result.parameters.product_code
          let currentProduct = yield MongoDB.helpers.getProductFromDb(code);
          let connectedProduct = yield MongoDB.helpers.getRandomConnectedProduct(currentProduct);
          let userUpdated = yield MongoDB.helpers.findByFbIdAndUpdate(senderId,{$push:{'FBinfo.products_seen':connectedProduct}});
          let randomPhoto = MongoDB.helpers.getRandomImageOfProduct(connectedProduct);
           resolve({
             attachment: randomPhoto
           });
        })
        func();
      })

    }
    getLastSeenSizes(senderId,result){
      return new Promise(function(resolve,reject){
        MongoDB.helpers.findUserByFbId(senderId)
                       .then(function(user){
                         let product = MongoDB.helpers.getLastSeenProductFromDb(user)
                         let product_size = MongoDB.helpers.getLastSeenProductSize(product);
                        resolve(
                          {
                         $product_size: product_size
                          });
                       })
        })
    }
    getLastSeenPrice(senderId,result){
      return new Promise(function(resolve,reject){
        MongoDB.helpers.findUserByFbId(senderId)
                       .then(function(user){
                         let product = MongoDB.helpers.getLastSeenProductFromDb(user)
                         let product_price = MongoDB.helpers.getLastSeenProductPrice(product);
                        resolve(
                          {
                         $product_price: product_price
                          });
                       })
        })
    }
    getProductDetails(senderId,result){
      return new Promise(function(resolve,reject){
        MongoDB.helpers.findUserByFbId(senderId)
                       .then(function(user){
                         let product = MongoDB.helpers.getLastSeenProductFromDb(user)
                         let product_size = MongoDB.helpers.getLastSeenProductSize(product);
                         let product_price = MongoDB.helpers.getLastSeenProductPrice(product);
                        resolve(
                          {
                            $product_size: product_size,
                            $product_price: product_price
                          });
                       })
      })
    }

   // gets names and honorifics for current user 
    greetings(senderId,result){
      return new Promise(function(resolve,reject){
        let func = co(function* (){
          let user = yield MongoDB.helpers.findUserByFbId(senderId);
          let $mrms = 't/a';
          if(user.FBinfo.gender == 'male'){
            $mrms  = 'Mr'
          } else {
            $mrms = 'Ms'
          }
           resolve({
             $f_name: user.FBinfo.f_name,
             $l_name: user.FBinfo.l_name,
             $mrms: $mrms
           });
        })
        func();
      })
    }
  



    //gets random photo of connected product and sends it to api ai
getRandomNewArrivalsProductPic(senderId, category){
      //Setup dates for the Mongoose query for new arrivals
      let monthCount = 1 //how many months behind to show products
        var now = new Date()

          if (new Date().getMonth()<=monthCount){
              var lastYear =  (new Date().getFullYear()-1)
          }
          else {var lastYear =  new Date().getFullYear()};

        var lastMonth = (new Date().getMonth()-monthCount) //Returns one the preset amount of months behind
        if(lastMonth < 0){lastMonth = 12-monthCount} //corrects the month for January -1 to 12
        var lastMonthDate = new Date().getDate() //Same day of tyhe month as today

        var NewArrivalsDate = new Date()
              NewArrivalsDate.setYear(lastYear)
              NewArrivalsDate.setMonth(lastMonth)
              NewArrivalsDate.setDate(lastMonthDate)
              //END of Setup dates for the Mongoose query for new arrivals

      return new Promise(function(resolve,reject){
        let func = co(function* (){
          let NewArrivals = yield MongoDB.helpers.findProductsbyDateRange(NewArrivalsDate, now)
          let randomNumber = Math.floor(Math.random() * NewArrivals.length);
          let code = NewArrivals[randomNumber].code
          console.log(code)
          let currentProduct = yield MongoDB.helpers.getProductFromDb(code);
          let userUpdated = yield MongoDB.helpers.findByFbIdAndUpdate(senderId,{$push:{'FBinfo.products_seen':currentProduct}});
          let randomPhoto = MongoDB.helpers.getRandomImageOfProduct(currentProduct);
          console.log(randomPhoto);
          resolve({attachment: randomPhoto});
        })
        func();
      })
    }


// customize a message if custom data from bot action is presented and returs it to api ai proccessor
   messageCustomization(message,data){
     console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',message,'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', data)
     // if text repsonse - this customize text response
     if(message.speech){
    for(let variable_name in data){
    if (message.speech.indexOf(variable_name.toString()) > 0) {
      message.speech = message.speech.replace(variable_name.toString(),data[variable_name]);
    }
  }
   } 
   // if message is with quick replies - customize the quick replies
    if(message.replies){
       let message_replies_concat = message.replies.join('@@@@'); //joining the strings to process the string without a loop
       for(let variable_name in data){
         message_replies_concat = message_replies_concat.replace(variable_name.toString(),data[variable_name])
        }
        message.replies = message_replies_concat.split('@@@@'); //Splitting the string back to an array
       }
     if(message.speech == 'this message will be redacted'){
        message = {};
        message.attachment = fb.imageAttachment(data.attachment)
        message.attachment.type = 'image';
        message.quick_replies = fb.quickReplyMaker(['product detail','next','add to wish list'])
        message.type = 5;
     }
        return message

   }
}
module.exports.ProccessActioner = ProccessActioner;




















//Objects of startFAQ
const FAQ = {
  "delivery": "Our partners are Speedex.gr, DPD.com/ro & speedy.bg - For details on their services, please refer to corresponding service for your location. The specific service is called 'Balkan Express(202)'",
  "returns": "We accept all returns, as long as they are purchased from us and they havent been worn, washed or modified in any way.",
  "quality": "We have a range of fabrics. An easy way to estimate the quality is by looking at the prices. All items that cost more than 35EUR will be made of first quality materials, but if you are still unsure please ask our colleagues to aid you further.  ",
  "why": "To make sure its all nice for you"
};
const Greetings = {
  "00":"Good Evening, ",
  "01":"Good Evening, ",
  "02":"Good Evening, ",
  "03":":) Early-Bird Moringing, ",
  "04":":) Early-Bird Moringing, ",
  "05":":) Early-Bird Moringing, ",
  "06":"Good Morning, ",
  "07":"Good Morning, ",
  "08":"Good Morning, ",
  "09":"Good Morning, ",
  "10":"Good Morning, ",
  "11":"Good Morning, ",
  "12":"Good Afternoon, ",
  "13":"Good Afternoon, ",
  "14":"Good Afternoon, ",
  "15":"Good Afternoon, ",
  "16":"Good Afternoon, ",
  "17":"Good Afternoon, ",
  "18":"Good Evening, ",
  "19":"Good Evening, ",
  "20":"Good Evening, ",
  "21":"Good Evening, ",
  "22":"Good Evening, ",
  "23":"Good Evening, ",
  }




