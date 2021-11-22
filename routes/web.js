const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
//middlewares
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");


function initRoutes(app) {
  // app.get('/',(req,res)=>{
  //     res.render("home");
  //     });
  //in place of above we use
  app.get("/", homeController().index);

  // app.get('/login',(req,res)=>{
  //     res.render('auth/login');
  //     });

  //in place of above we use
  //app.get('/login', authController().login);
  app.get("/login", guest, authController().login); //if log in then not going to loginurl;
  app.post("/login", authController().postLogin);

  //     app.get('/register',(req,res)=>{
  //         res.render('auth/register');
  //         });

  //in place of above we use
  //app.get('/register', authController().register);
  app.get("/register", guest, authController().register); //if resister in then not going to resisternurl only go guest;
  app.post("/register", authController().postRegister);

  //logout routes
  app.post("/logout", authController().logout);

  // app.get('/cart', (req, res) => {
  //     res.render('customers/cart');
  // });

  //in place of above we use
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  //order control(customer route)
  //app.post('/orders', orderController().store)
  app.post("/orders", auth, orderController().store); //user log in then show order page if not then log in page
  // app.get('/customers/orders',orderController().index)
  app.get("/customers/orders", auth, orderController().index); //user log in then show order page if not then log in page
  app.get('/customer/orders/:id', auth, orderController().show)//show status to your order
 
  // Admin routes
  app.get("/admin/orders", admin, adminOrderController().index);
  app.post('/admin/order/status', admin, statusController().update)//only admin change status of order
}
module.exports = initRoutes;
