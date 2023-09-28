const {Schema, model} = require('mongoose');

const user = new Schema({
  email: {type: String, required: true},
  name: String,
  password: {type: String, required: true},
  resetToken:String,
  resetTokenExp:Date,
  avatarUrl: String,
  cart: {
    items:[
      {
        count:{type:Number, required:true, default:0},
        phoneId:{type:Schema.Types.ObjectId, required:true, ref:'Phone'}
      }
    ]
  },
  name:String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
},
  {versionKey:false}
);

user.methods.addToCart = function (phone){
  const cloneItems = this.cart.items.concat();
  const index = cloneItems.findIndex(p => p.phoneId.toString() === phone._id.toString());

  if(index >= 0) {
    cloneItems[index].count = cloneItems[index].count + 1;
  }

  else{
    cloneItems.push({count:1, phoneId: phone._id})
  }
  this.cart = {items:cloneItems};
  return this.save();
}

user.methods.removeElement = function (id){
  let items = [...this.cart.items];
  const index = items.findIndex(p => {
    return p.phoneId.toString() === id.toString();
  });
  if(items[index].count === 1){
    items = items.filter(p => p.phoneId.toString() !== id.toString());
  }
  else{
    items[index].count--;
  }
  this.cart = {items}
  return this.save( );
}

user.methods.clearCart = function(){
  this.cart = {items:[]};
  return this.save();
}

module.exports = model('User', user);