const LocalStrategy = require("passport-local").Strategy; //it is class type
const User = require("../models/user");
const bcrypt = require("bcrypt");

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        //object make and pass object
        //login
        //check if email exist
        const user = await User.findOne({ email: email }); //run query
        if (!user) {
          return done(null, false, { message: "No user with this email" });
        }
        //if user exist
        //console.log(user)
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Logged in succesfully" });
            }
            return done(null, false, { message: "Wrong username or password" });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong" });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    //userid store at database of user  after logged in
    return done(null, user._id);
    console.log(user._id);
    //console.log(({id: user.id}))
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      // from database fetch user who logged in and show id
      done(err, user);
    });
  });
}
module.exports = init;
