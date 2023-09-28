const {Schema, model} = require('mongoose');
const mongoose = require('mongoose');
const uuid = require('uuid');
const order = new Schema({
  phones:[{
    phone:{type: Object, required:true},
    count:{type:Number, required:true}
  }],
  user:{
    name:String,
    userId:{type: Schema.Types.ObjectId, ref:'User', required:true}
  },
  date:{
    type: Date,
    default: Date.now
  },
  orderNumber: {
    type: String,
    default: () => uuid.v4().substring(0, 5),
  },
},
{versionKey:false});

module.exports = model('Order', order);