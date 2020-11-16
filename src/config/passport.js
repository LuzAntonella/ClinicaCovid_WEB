const passport = require('passport');
//autenticacion local
const LocalStrategy = require('passport-local').Strategy;
//accedemos a la coleccion
const User = require('../models/User');
//hay una funcion para autenticar
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});//devuelve un usuario de acuerdo a la busqueda
    if(!user){
        return done(null, false, { message: 'Not User Found.'});
    } else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        } else{
            return done(null, false, { message: 'Incorrect Password'});
        }
    }

}));
//ya no volver a pedir autenticar si se que existe
passport.serializeUser((user, done) => {
     done(null, user.id);
});

passport.deserializeUser((id,done) => {
    User.findById(id, (err,user) => {
        done(err, user);
    });
});