module.exports.FakeUser = function(schemas, helpers, co){

const TheUser = new schemas.User
TheUser.f_name = 'dan12'
TheUser.l_name = 'Irinkov12'
TheUser.FBinfo.l_name = 'Irinkov12'
TheUser.nick = 'Home 1'
TheUser.email = 'Home@1.som'
TheUser.telephone = '+35988865965'
TheUser.notes = 'ring my phone, we have no door bell'


const TheAddress = new schemas.Address 
TheAddress.f_name = 'dan12'
TheAddress.l_name = 'Irinkov12'
TheAddress.Title = 'Home 1'
TheAddress.telephone = '+35988865965'
TheAddress.details = 'ring my phone, we have no door bell'


const TheOrder = new schemas.Order
TheOrder.confirmed_on = Date.now()
TheOrder.EUR_amount = 36
TheOrder.payment_method = 'COD'

const TheCart = new schemas.Cart

const TheAgent = new schemas.SalesAgent
TheAgent.f_name='Stef'
TheAgent.l_name='Strat'
TheAgent.city='Varna'

const TheInteraction = new schemas.Interaction
TheInteraction.type='What coke do you like?'
TheInteraction.result='Zero'

const TheItem = new schemas.Item
TheItem.code='SD154'
TheItem.quantity= 1

const TheRemark = new schemas.Remark
TheRemark.Data= 'That`s Great!'

const TheSize = new schemas.Size
TheSize.Title='S'
TheSize.quantity=7
TheSize.fit='Classic'

const ThePicture = new schemas.Picture
ThePicture.isBranded=true
ThePicture.Data='fetch an URL'

const ThePrice = new schemas.Price
ThePrice.EUR=31
ThePrice.cost_price_BGN=26

const TheColor = new schemas.Color
TheColor.Title='White'
TheColor.Data='ffffff'
TheColor.type='Color Hex'

const TheProduct = new schemas.Product
TheProduct.Title='rozovo kop4e'
TheProduct.code='SD154'
TheProduct.tags='adidas, track, pink, grey'
TheProduct.supplier='Alper'
TheProduct.weight=0.5

const ThePage = new schemas.Page
ThePage.Title='Active Fashion 420'
ThePage.FBPage_id=987432972134923
ThePage.country='Greece'
ThePage.fans.push(74322)

const gen = co(function* (){
            console.time('Filling User completed in')

//CREATE an User
                let User = yield helpers.CreateSchema('User', TheUser)
                  console.log('User generated: ',User._id,'\n')

                let Address = yield helpers.CreateSchema('Address', TheAddress)
                  console.log('Address is: ',Address._id)
                let addA = yield helpers.addSchemaToUser(User._id, 'Address', Address._id)
                  console.log('Address was added:',addA._id !== undefined,'\n')

                let SalesAgent = yield helpers.CreateSchema('SalesAgent', TheAgent)
                  console.log('SalesAgent is: ',SalesAgent._id)
                let addSA = yield helpers.addSchemaToUser(User._id, 'SalesAgent', SalesAgent._id)
                console.log('SalesAgent was added:',addSA._id !== undefined,'\n')

                let Interaction = yield helpers.CreateSchema('Interaction', TheInteraction)
                  console.log('Interaction is: ',Interaction._id)
                let addI = yield helpers.addSchemaToUser(User._id, 'Interaction', Interaction._id)
                console.log('Interaction was added:',addI._id !== undefined,'\n')

//CREATE A Product
                let Product = yield helpers.CreateSchema('Product', TheProduct)
                  console.log('Product generated: ',Product._id,'\n')

                let Picture = yield helpers.CreateSchema('Picture', ThePicture)
                  console.log('Picture is: ',Picture._id)
                let addPic = yield helpers.addSchemaToProduct(Product._id, 'Picture', Picture._id)
                  console.log('Picture was added:',addPic._id !== undefined,'\n')

                let Size = yield helpers.CreateSchema('Size', TheSize)
                  console.log('Size is: ',Size._id)
                let addSize = yield helpers.addSchemaToProduct(Product._id, 'Size', Size._id)
                  console.log('Size was added:',addSize._id !== undefined,'\n')

                let Color = yield helpers.CreateSchema('Color', TheColor)
                  console.log('Color is: ',Color._id)
                let addCo = yield helpers.addSchemaToProduct(Product._id, 'Color', Color._id)
                  console.log('Color was added:',addCo._id !== undefined,'\n')
//CREATE A Product End

//CREATE A Shopping cart
                let Cart = yield helpers.CreateSchema('Cart', TheCart)
                  console.log('Cart is: ',Cart._id)
                let addC = yield helpers.addSchemaToUser(User._id, 'Cart', Cart._id)
                console.log('Cart was added:',addC._id !== undefined,'\n')

//Add Item to Cart
                let Item = yield helpers.CreateSchema('Item', TheItem)
                  console.log('Item is: ',Item._id)
                let addItem = yield helpers.addSchemaToUser(User._id, 'Item', Item._id)
                console.log('Item was added:',addItem._id !== undefined,'\n')

//Create an order and add it to the User
                let Order = yield helpers.CreateSchema('Order', TheOrder)
                  console.log('Order is: ',Order._id)
                let addO = yield helpers.addSchemaToUser(User._id, 'Order', Order._id)
                console.log('Order was added:',addO._id !== undefined,'\n')

                  console.timeEnd('Filling User completed in')
                })
                gen()
}
