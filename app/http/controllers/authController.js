const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController() {

    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },


        //post log in data for matching
        postLogin(req, res, next) {
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {//if user not exist 
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {//if user exist
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))//make private method for admin and costmer logged identify
                })
            })(req, res, next)//when passport authenticate fn return a fn then call it here returntype fn
        },


        register(req, res) {
            res.render('auth/register');
        },


        //data send from form
        async postRegister(req, res) {
            const { name, email, password } = req.body
            //console.log(req.body)
            //validate requist
            if (!name || !email || !password) {
                //showing erroer on frontent
                req.flash('error', 'All field are required !!')
                //if any field empty then remaining data not erage
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            //check if email already exit(same email  for 2nd time register)
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already exist !!')
                    //if any field empty then remaining data not erage
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })


            //hash password
            const hashed_pass = await bcrypt.hash(password, 10)
            //create a user
            const user = new User({
                name: name,
                email: email,
                password: hashed_pass
            })
            user.save().then((user) => {
                //login
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong !!')
                return res.redirect('/register')
            })

        },
        //log in functionality at passport
        logout(req, res) {
            req.logout()
            return res.redirect('/login')  
          }

    }
}
module.exports = authController;