const {Router} = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res)=>{
  try{
    const orders = await Order.find({'user.userId':req.user._id}).populate('user.userId');
    res.render('orders', {
      title:'Замовлення', 
      isOrders:true,
      orders:orders.map(ord=>{
        return {
          ...ord._doc,
          price: ord.phones.reduce((total, p)=>{
            return total+=p.count * p.phone.price
          }, 0)
        }
      })
    });
  }
  catch(err){console.log(`Ошибка: ${err}`)}
});

router.post('/', auth, async (req, res)=>{
  try{
    const user = await req.user.populate('cart.items.phoneId');
    const phones = user.cart.items.map(el=>({
      count: el.count,
      phone:{...el.phoneId._doc }
    }));

    const order = new Order({
      user:{
        name: req.user.name,
        userId: req.user
      },
      phones,
    });

    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  }
  catch(err){console.log(`Ошибка: ${err}`)}
});

module.exports = router;