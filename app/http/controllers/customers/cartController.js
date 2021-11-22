const { json } = require("express")
function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart');
        },

        update(req, res) {

            //basic structure of cart
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },        
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }


            // //for the first time create cart and add basic object structure ) 
            if (!req.session.cart) {
                //create empty cart
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            let cart = req.session.cart
            //console.log(req.body)
            // check if item does not exist in cart
             if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {// if same pizza already present in cart
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
            }
            //return res.json({ totalQty: req.session.cart.totalQty })
            return res.json({ data: 'alll j the best' })
            
            
            
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }


            
            // //return res.json({data:'alll j the best'})
        }
    }
}


module.exports = cartController;