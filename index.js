const express = require('express');
const path = require('path');
const csurf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config({path:'./keys/index'});
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const MongoSS = require('connect-mongodb-session')(session);
const app = express();
const User = require('./models/user');
const homeRoute = require('./routes/home');
const phonesRoute = require('./routes/phones');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const sessionMid = require('./middleware/sessions');
const userMid = require('./middleware/user');
const { asyncify } = require('async');
const fileMid = require('./middleware/file');
const errorURL = require('./middleware/error');
const keys = require('./keys');

const PORT = process.env.PORT || 3000;
// const HOST = process.env.host || '127.0.0.2';

async function start() {
  try { 
    await mongoose.connect(keys.MONGODB_URI, {useNewUrlParser:true});
    const visitor = await User.findOne();
    app.listen(PORT, () => console.log(`Server works on port ${PORT}`));
  }
  catch(err){console.log(`Error: ${err}`)};
}

start();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const store = MongoSS({
  collection: 'session',
  uri: keys.MONGODB_URI,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/user-imgs', express.static(path.join(__dirname, 'user-imgs')));
app.use(express.urlencoded({extended:false}));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(fileMid.single('avatar'));
app.use(csurf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(sessionMid);
app.use(userMid);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "*"], // Разрешить загрузку изображений из всех источников
    },
  })
);

// app.use((req, res, next) => {
//   console.log('req.user:', req.user); // Выведет объект пользователя из middleware userMid
//   next();
// });

app.use('/', homeRoute);
app.use('/phones', phonesRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(errorURL);


