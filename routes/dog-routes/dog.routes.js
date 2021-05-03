const express = require('express');
const router  = express.Router();
const Dog =  require('../../models/Dog')
const dogColors = ["Black", "Tan", "White", "Brindle"]
/* create */

router.get('/create', (req, res, next) => {
  Dog.find()
  .then(dogsFromDb =>{
    res.render('dog-views/create-dog', {dogs: dogsFromDb});
  }).catch(err => next(err));
})


router.post('/create', (req, res, next) => {
  // const isColorValid = dogColors.filter(color => req.body.color === color)

  Dog.find()
  .then(dogsFromDb =>{
    console.log({dogsFromDb});
    res.render('dog-views/create-dog', {dogs: dogsFromDb});
  }).catch(err => next(err));


  Dog.create(req.body)
  .then(newDog => {
    console.log(newDog)
  }).catch(err => next(err));
});



/* read*/
router.get('/', (req, res, next) => {
  Dog.find()
  .then(dogsFromDb =>{
    console.log({dogsFromDb});
    res.render('dog-views/dogs', {dogs: dogsFromDb});
  }).catch(err => next(err));
});

module.exports = router