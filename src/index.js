const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
//inicialitations
const app = express();
require('./database');
require('./config/passport');
//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs' , exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');
//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
 /*app.get('/modulo', function (req, res) {
   console.log(req.query);
    if(req.query.username === "Ryan Joe") {
      res.render('panelAdmin/tableroAdmin');
    }
    else{
        res.render('panelUsuario/elegirCurso');
    }
    console.log(req.params);
       res.send('Response send to client::'+req.params.name);

  });*/

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables(todas las vistas tengan acceso a los msn)
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg'); 
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//configuro multer
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
}); //recibe un objeto
app.use(multer({storage}).single('image'));
//Routes
app.use(require('./routes'));
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/panelAdmin'));
app.use(require('./routes/panelUsuario'));


//Satatic Files
app.use(express.static(path.join(__dirname, 'public')));
//Server is listenning
app.listen(app.get('port'), () => {
    console.log('Server on port',app.get('port'))
});