const path = require('path');
const fs = require('fs');
const pathOne = path.join(path.dirname(process.mainModule.filename), 'data', 'basket.json');

class Basket{
  static async add(phone){
    const basket = await Basket.fetchData();
    const unit = basket.phones.findIndex(ps => ps.id === phone.id);
    const phoneRev = basket.phones[unit];
    if(phoneRev){
      phoneRev.count++;
      basket.phones[unit] = phoneRev;
    }
    else{
      phone.count = 1;
      basket.phones.push(phone);
    }
    basket.price += phone.price;
    return new Promise((res, rej)=>{
      fs.writeFile(pathOne, JSON.stringify(basket), 
        err=>{
          if(err) rej(err);
          else res();
        }
      );
    });
  };

  static async fetchData(){
    return new Promise((res, rej)=>{
      fs.readFile(pathOne, 'utf-8', 
        (err, data)=>{
          if(err) rej(err);
          else res(JSON.parse(data));
        }
      );
    });
  };

  static async remove(id){
    const basket = await Basket.fetchData();
    //Если кол-во книг == 1, поле удаляем, если > 1 уменьшаем кол-во и цену:
    const unit = basket.phones.findIndex(ps => ps.id === id);
    const onePhone = basket.phones[unit];
    if(onePhone.count === 1){
      //Удаляем с помощью метода filter:
      basket.phones = basket.phones.filter(ps => ps.id !== id);
    }
    else{
      // уменьшаем количество одинаковых книг в корзине:
      basket.phones[unit].count--;   
    }
    basket.price -= onePhone.price;
    return new Promise((res, rej)=>{
      fs.writeFile(pathOne, JSON.stringify(basket), 
        err=>{
          if(err) rej(err);
          else res(basket);
        }
      );
    });
  }
}


module.exports = Basket;