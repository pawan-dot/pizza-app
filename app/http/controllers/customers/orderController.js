const Order = require('../../../models/order')
const moment = require('moment')
function orderController(){
    return {
        store(req,res){
            //check requist console.log(req.body)
            // Validate request
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }

            const order = new Order({
                customerId: req.user._id,//direct take user id from passport
                items: req.session.cart.items,//take from session
                phone,
                address
            })
            order.save().then(result => {
               // Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                     req.flash('success', 'Order placed successfully')
                     delete req.session.cart//delete cart after order place
                     return res.redirect('/customers/orders')

                    // // Stripe payment
                    // if(paymentType === 'card') {
                    //     stripe.charges.create({
                    //         amount: req.session.cart.totalPrice  * 100,
                    //         source: stripeToken,
                    //         currency: 'inr',
                    //         description: `Pizza order: ${placedOrder._id}`
                    //     }).then(() => {
                    //         placedOrder.paymentStatus = true
                    //         placedOrder.paymentType = paymentType
                    //         placedOrder.save().then((ord) => {
                    //             // Emit
                    //             const eventEmitter = req.app.get('eventEmitter')
                    //             eventEmitter.emit('orderPlaced', ord)
                    //             delete req.session.cart
                    //             return res.json({ message : 'Payment successful, Order placed successfully' });
                    //         }).catch((err) => {
                    //             console.log(err)
                    //         })

                //         }).catch((err) => {
                //             delete req.session.cart
                //             return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                //         })
                //     } else {
                //         delete req.session.cart
                //         return res.json({ message : 'Order placed succesfully' });
                //     }
                // })
            }).catch(err => {
                return res.status(500).json({ message : 'Something went wrong' });
            })
        },

        //fetch data from database and show frontent
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },//fetch all orders from order model by customerid
                null,
                { sort: { 'createdAt': -1 } } )//sort order in deccending order(last is first)
                //console.log(orders)
                res.header('Cache-Control', 'no-store')//if click back button not found symbol
            res.render('customers/orders', { orders: orders,moment: moment })//show all order at frontant
        
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)//fetch order 
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
     }
}
module.exports=orderController