const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController')

function initRoutes(app) {

    // app.get('/',(req,res)=>{
    //     res.render("home");
    //     });
    //in place of above we use
    app.get('/', homeController().index);

    // app.get('/login',(req,res)=>{
    //     res.render('auth/login');
    //     });

    //in place of above we use
    app.get('/login', authController().login);

    //     app.get('/register',(req,res)=>{
    //         res.render('auth/register');
    //         });
    
    //in place of above we use
    app.get('/register', authController().register);

    // app.get('/cart', (req, res) => {
    //     res.render('customers/cart');
    // });  

    //in place of above we use
    app.get('/cart', cartController().index);

    app.post('/update-cart',cartController().update);

}
module.exports = initRoutes;