const {Router} = require('express');
const Phone = require('../models/phone');
const auth = require ('../middleware/auth');
const isAdmin = require('../middleware/admin');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const {phonesValidators} = require('../utils/validator');
const router = Router();

router.get('/', auth, isAdmin, (req,res)=>{
  res.render('add', { title: 'Додати телефон', isAdd: true });
});

router.post('/', auth, isAdmin, phonesValidators, async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('add', {
      title: 'Додати телефон', 
      isAdd: true,
      errors: errors.array()[0].msg,
      data:{
        title: req.body.title, 
        price: req.body.price, 
        image: req.body.image,
        description: req.body.description,
        brand: req.body.brand,
      }
    });
  }
  const phones = new Phone({
    title: req.body.title, 
    price: req.body.price, 
    image: req.body.image,
    userId: req.user._id,
    description: req.body.description,
    brand: req.body.brand,
  });
    try{
      await phones.save();
      res.redirect('/phones');
    }
    catch(err){console.log(`Error: ${err}`)};
});

module.exports = router;