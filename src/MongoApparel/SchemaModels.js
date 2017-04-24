const mongoose = require('mongoose')
const {Schema} = mongoose

//Definitions of Schema Objects; fwi, each {} document gets _id property automatically generated

        const Remark = new Schema({  //all unique to the user commentaries, issues, compliments, stories, etc..
                                    'Remark_id':Number,  //global remarks Id
                                    'date':{type:Date, default: Date.now}, //initialization date of the remark
                                    'Data':String
                                    })
        module.exports.Remark = mongoose.model('Remark', Remark);

                const Size = new Schema({ //creates a new size object for the products db
                                'title':{type: String, required: true},  //The title of the address object
                                'quantity':{type: Number, required: true}, //how many items we have from this particular size of the set product
                                'dimensions':{type: String}, //the particular dimentions of this size of the prodcut. for ex. top lenght/chest/trousers
                        })
        module.exports.Size = mongoose.model('Size', Size);

                const Item = new Schema({ //any product in the ShoppingCart
                                'Item_id':Number,
                                'date':{type:Date, default: Date.now}, //date of creation of the instance of the item for the cart for ex.
                                'code':String, //product code - sd154
                                'size':[Size],  //product size - s,m,l,xl...
                                'quantity':Number,
                                'comment':String //if the customer has specified additional requests
                            })
        module.exports.Item = mongoose.model('Item', Item);

        const Interaction = new Schema({  //will collect info about what the user was doing with the bot
                            'Interaction_id':Number, //Global interaction id from our list
                            'date':{type:Date, default: Date.now}, //exact date and time of occurance
                            'type':String, //the backend handle for the event
                            'result':String //the result/reply given back from the customer
                        })
        module.exports.Interaction = mongoose.model('Interaction', Interaction);
       
       const Image = new Schema({  // use this to add a picture to the db
                        url:{type:String}
                                })
        module.exports.Image = mongoose.model('Image', Image);

        const Cart = new Schema({
                            'Cart_id':Number, // Global __shopping cart Id
                            'date':{type:Date, default: Date.now},  //initialization date
                            'date_last_modify':Date,
                            'recovery_attempts':{type:Number, default:0},
                            'recovery_ids':[Number, Number, Number],
                            'Items':[Item]
        })
        module.exports.Cart = mongoose.model('Cart', Cart);

        const Address = new Schema({
                                'Address_id':{type:Number, unique: false},
                                'title':{type: String, required: false},  //The title of the address object
                                'f_name':{type: String, required: false},
                                'l_name':{type: String, required: false},
                                'telephone':{type: String, required: false},
                                'country':{type: String, required: false},
                                'postal_code':{type: String, required: false},
                                'city':{type: String, required: false},
                                'street':{type: String, required: false},
                                'GPS':[Number, Number],  //gps result from the google API query
                                'details':String,
                        })
        module.exports.Address = mongoose.model('Address', Address);

        const SalesAgent = new Schema({
                                'SalesAgent_id':{type:Number, unique: false},
                                'f_name':{type: String, required: false},
                                'l_name':{type: String, required: false},
                                'telephone':{type: String, required: false},
                                'country':{type: String, required: false},
                                'postal_code':{type: String, required: false},
                                'city':{type: String, required: false},
                                'street':{type: String, required: false},
                                'email':String,
                                'details':String,
                        })
        module.exports.SalesAgent = mongoose.model('SalesAgent', Address);

        const Order = new Schema({    //Create a new order
                            'Order_id':Number, //global __Order.No
                            'confirmed_on':Date,
                            'shipped_on':Date,
                            'delivered_on':Date,
                            'SalesAgent':[SalesAgent], //the sales agent name associated with the order
                            'Items':[Item],  //lets you inject only items from the Item Schema
                            'EUR_amount':Number, //total order value
                            'payment_method':String,
                            'rating':{type:Number, min:1, max:5}, //rating requested from user after a confirmed order
                            'remarks':[Remark],
                            'postal_address':[Address],
                        })
        module.exports.Order = mongoose.model('Order', Order);

//=====================Producs Database=======================


        const Price = new Schema({ //creates a new size object for the products db
                        price:{type: Number},
                        country:{type: String},
                        currency:{type: String}
                })          
        module.exports.Price = mongoose.model('Price', Price);

        const Color = new Schema({ //creates a new color object for the products db
                                'Color_id':Number, //global color's Id list for easy reusability
                                'title':{type: String, required: true},  //The title of the address object
                                'Data':{type: String, required: true}, //color hex id
                                'type':{type: String, required: true}, // name so we know data is a string, or hex if data is a hex color id
                        })
        module.exports.Color = mongoose.model('Color', Color);

        const Product = new Schema({
                'code':{type: String, required: true},
                'date_added':{type:Date, default: Date.now},
                'tags':{type: String, required: false}, //for ex. brand, style, type of clothing, etc.
                'fit':{type:String},
                'colors':{type:String}, //Color tags for the color filter
                'category':{type:String},
                'onsale':{type:String,default: ''},
                'fabric_quality':{type:String}, //ranging from: Not-satisfactory, average, good, excellent
                'manufacturing_quality':{type:String},
                'season':{type:String}, //winter fabric or summer fabrics?
                'restockable':{type:Boolean},
                'new_delivery_expected':{type:Boolean},
                'related_products':{type:String},
                'product_speed':'',
                'weight':{type: Number, required: false}, // weight of a single product in kgs
                'sizes':[Size],  //Stores sizes and quantities
                'prices':[Price], //takes only a Price object
                'images':[Image], //Stores available pictures
                'product_id':{type: Number, required: false},
                })
        module.exports.Product = mongoose.model('Product', Product);


//=====================Facebook Pages List====================
        const Page = new Schema({    //Create a new FB Page under the bot control
                            'Page_id':Number, //global __Order.No
                            'title':String,
                            'date':{type:Date, default: Date.now}, //date added to the db
                            'FBpage_id':Number, //the page id from which the customer got in touch with us
                            'url':String,
                            'country':String, //default country and language, for ex. Greece, Bulgaria, Romania
                            'fans':[Number]//the actual number to be pushed every day chron job
                        })
        module.exports.Page = mongoose.model('Page', Page);

        //=====================HelperDbs Schema======================= here we collect global variables
const HelperDbs = new Schema({    //Create a new FB Page under the bot control
                            'User_id':{type:Number, default:0, unique: true}, //last used paradise id
                            'Address_id':{type:Number, default:0, unique: true},
                            'Color_id':{type:Number, default:0, unique: true},
                            'Order_id':{type:Number, default:0, unique: true}, //last used order id
                            'Price_id':{type:Number, default:0, unique: true},
                            'Product_id':{type:Number, default:0, unique: true},
                            'Remark_id':{type:Number, default:0, unique: true}, 
                            'Item_id':{type:Number, default:0, unique: true},
                            'Page_id':{type:Number, default:0, unique: true},
                            'Cart_id':{type:Number, default:0, unique: true},
                            'Size_id':{type:Number, default:0, unique: true},
                            'Picture_id':{type:Number, default:0, unique: true},
                            'Interaction_id':{type:Number, default:0, unique: true},
                            'SalesAgent_id':{type:Number, default:0, unique: false},
                        })
        module.exports.HelperDbs = mongoose.model('HelperDbs', HelperDbs);

        // model for the complaints schema
 const Complaint = new Schema({
        'user_FB_ID': {type: String},
        'category': {type: String},
        'text': {type: String},
        'date': {type: Date, default: Date.now},
        'page': {type: String}
        })        
        module.exports.Complaint = mongoose.model('Complaint',Complaint)
        
 const AccessToken = new Schema({
        'user_FB_ID': {type: String},
        'category': {type: String},
        'text': {type: String}
        })        
        module.exports.AccessToken = mongoose.model('AccessToken',AccessToken);
        
        //=====================Users Database=======================

const EveryUserSchema = new Schema({
            'User_id':{ //customer id from our customer list
                            type: Number, //the type of content that will be held by this object
                            required: false, //will throw an err if the field is not supplied
                        },
            'f_name':{type: String},
            'l_name':{type: String},
            'nick':String,  //a short name for our customer, chosen by him/her
            'email':{type: String}, //NEEDS A CUSTOM EMAIL VALIDATOR
            'notes':{type: String, required: false}, //Random notes for the user
            'isLoyal':Boolean, //has >=3 net green orders(green-grey)
            'isBlacklisted':Boolean, //has more gray orders than green
            'SalesAgent':[SalesAgent],
            'FBpage_id':{type: String,required: true}, //the page ids from which the customerhas been contacting us
            'validation':{ //records which validations have been completed for the user
                        'email':{type:Boolean, default:false},
                        'telephone':{type:Boolean, default:false},
                        'address':{type:Boolean, default:false},
                        },
            'user_stats':{
                        'enagement_rating':{type:Number, default:0, min:0, max:100},  //Danny will build this one day
                        'average_rating_given':{type:Number, min:1, max:5}, //the average of user.past_orders[all].rating
                        'user_interactions':[Interaction],  //will collect info about what the user was doing with the bot
                        'total_number_of_interactions':Number,
                        'inbetween_interactions_time_avg':Number, //in minutes
                        'total_number_of_conversations':Number, //idle>15min = new conversation
                        'inbetween_conversations_time_avg':Number, //in days
                        'total_spent':Number,
                        'orders_count':Number,
                        'inbetween_orders_time_avg':Number, //in days
                        },
            'FBinfo':{
                    'SenderId':{type: String}, //the user's global facebook Id.
                    'Token': {type: String}, // the token used for graph api calls
                    'f_name':{type: String, required: false},
                    'l_name':{type: String, required: false},
                    'gender':{type: String},
                    'birthday':{type: Date},
                    'home_town':String,  //a city
                    'living_in':{type: String},  //a city
                    'country': {type: String},
                    'fb_main_id': {type: String},
                    'followers':Number,
                    'age':Number,
                    'profile_pic':[Image], //collects an array of the profile pics of our customers
                    'cover_pic':[Image], //collects an array of the cover pics of our customers
                    'email':{type: String},
                    'products_seen': [],
                    'wish_list':[]
                    },
            'postal_addresses':[Address], // A collection of all addresses used by the customer
            'shopping_cart':[Cart], //what the customer has currently selected
            'past_orders':[Order], //Cart goes to an order after customer confirmation
            isAdmin:{type:Boolean, default: false},
            isDeleted:{type:Boolean, default: false},
            createdAt:{type:Date, default: Date.now},
            updatedAt:{type:Date, default: Date.now},
            'updates_counter':Number, //to be incremented on every update of the profile
        })
        module.exports.User = mongoose.model('User', EveryUserSchema);