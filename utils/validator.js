const {body} = require('express-validator');
const User = require('../models/user');

exports.regValidators = [
  body('email')
    .isEmail().withMessage('Введіть правильний email!')
    .custom(async(value, {req})=>{
      try{
        const user = await User.findOne({email: value});
        if(user) return Promise.reject('Такий email вже існує!');
      }
      catch(err){console.log(`Error: ${err}`)}; 
    }).normalizeEmail(),
  body('password', 'Пароль має складатися від 8 до 25 символів!').isLength({min:8, max:25}).isAlphanumeric(),
  body('confirm').custom((value,{req})=>{
    if(value !== req.body.password){
      throw new Error('Паролі не співпадають!');
    }
    return true;
  }),
  body('name').isLength({min:3}).withMessage('Ім\'я закоротке (мінімально 3 символа)!'),
];

exports.phonesValidators = [
  body('title').isLength({min: 5}).withMessage('Мінімальна довжина назви має бути 5 символів!').trim(),
  body('price').isNumeric().withMessage('Введіть правильну суму!'),
  body('image', 'Введіть правильний url!').isURL().trim(),
];