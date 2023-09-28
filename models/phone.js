const {Schema, model} = require('mongoose');

const phone = new Schema({
  title: {type: String, required: true},
  price: {type: Number, required: true},
  image: String,
  description: {type: String, required: true},
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  brand: {type: String, required: true},
},
  {versionKey:false}
);

module.exports = model('Phone', phone);