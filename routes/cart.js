const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const Phone = require('../models/phone');

function mapCartItems(units) {
  return units.items.map((p) => ({
    ...(p.phoneId && p.phoneId._doc ? p.phoneId._doc : {}),
    count: p.count,
  }));
}
  
function getCount(phones) {
  return phones.reduce((total, phone) => total+= phone.price * phone.count, 0);
}

router.post('/add', auth, async (req, res)=>{
  const phone = await Phone.findById(req.body.id);
  await req.user.addToCart(phone);
  res.redirect('/cart');
});

router.get('/', auth, async (req, res)=> {
  const user = await req.user.populate('cart.items.phoneId');
  const phones = mapCartItems(user.cart);
  res.render('cart', {title:'Кошик', isCart:true, phones:phones, price:getCount(phones)});
});

router.delete('/remove/:id', auth, async (req, res) =>{
  req.user.removeElement(req.params.id);
  const user = await req.user.populate('cart.items.phoneId');
  const phones = mapCartItems(user.cart);
  const cart = {phones, price:getCount(phones)}
  res.status(200).json(cart);
});

module.exports = router;