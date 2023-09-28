const { Router } = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const { validationResult } = require('express-validator');
const Phones = require('../models/phone');
const { phonesValidators } = require('../utils/validator');
const router = Router();

// Количество телефонов на одной странице (настроить это значение)
const phonesPerPage = 9;

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * phonesPerPage;

    const phones = await Phones.find()
      .populate('userId', 'email name')
      .select('title price image')
      .skip(startIndex)
      .limit(phonesPerPage);

    const totalPhones = await Phones.countDocuments();
    const totalPages = Math.ceil(totalPhones / phonesPerPage);

    res.render('phones', {
      title: 'Смартфони',
      isPhone: true,
      userId: req.user ? req.user._id.toString() : null,
      phones,
      isAuth: req.session.isAuthenticated === true,
      isAdmin: req.user && req.user.role === 'admin',
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.get('/filter', isAdmin, async (req, res) => {
  const brand = req.query.brand;
  try {
    const phones = await Phones.find({ brand });
    res.render('phones', { phones });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.get('/sort', async (req, res) => {
  const selectedSortOption = req.query.sort;
  try {
    let phones = await Phones.find();
    if (selectedSortOption === 'rating') {
      phones.sort((a, b) => b.rating - a.rating);
    } else if (selectedSortOption === 'min-price') {
      phones.sort((a, b) => a.price - b.price);
    } else if (selectedSortOption === 'max-price') {
      phones.sort((a, b) => b.price - a.price);
    }

    res.render('phones', {
      title: 'Смартфони',
      isPhone: true,
      userId: req.user ? req.user._id.toString() : null,
      phones,
      isAuth: req.session.isAuthenticated === true,
      isAdmin: req.user && req.user.role === 'admin',
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.get('/:id', auth, async (req, res) => {
  try{
    const phone = await Phones.findById(req.params.id);
    if (!phone) {
      return res.status(404).send('Телефон не знайдено');
    }
    res.render('layouts/single-phone', {
      layout: 'main',
      isPhoneSingle: true,
      title: `${phone.title}`,
      phone,
    });
  }
  catch(err){console.log(`Error: ${err}`)};
});

router.get('/:id/edit', auth, isAdmin, async (req, res) => {
  if(!req.query.allow) return res.redirect('/');
  try{
    const phone = await Phones.findById(req.params.id);
    res.render('phones-edit', {
      isPhoneSingle: true,
      title: `Редагувати ${phone.title}`,
      phone,
    });
  }
  catch(err){console.log(`Error: ${err}`)};
});

router.post('/edit', isAdmin, phonesValidators, async (req, res) => {
  try{
    const errors = validationResult(req);
    const id = req.body.id;
    const phone = await Phones.findById(id);
    if(!errors.isEmpty()){
      return res.status(422).redirect(`/phones/${id}/edit?allow=true`);
    }
    if(phone.userId.toString() === req.user._id.toString()){
      return res.redirect('/phones');
    }
    await Phones.findByIdAndUpdate(id, {$set:{
      title: req.body.title,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
      brand: req.body.brand
    }});
    res.redirect('/phones');
  }
  catch(err){console.log(`Error: ${err}`)};
})

router.post('/remove', auth, isAdmin, async (req, res)=>{
  try{
    await Phones.deleteOne({
      _id: req.body._id,
      userId: req.user._id,
    });
    res.redirect('/phones');
  }
  catch(err){console.log(`Error: ${err}`)};
})

module.exports = router;