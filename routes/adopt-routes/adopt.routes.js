const express = require("express")
const router = express.Router()
const Dog = require("../../models/Dog")
const Adopt = require("../../models/Adoption")



/* create */
router.get("/create", (req, res, next) => {
	Adopt.find()
		.then(adoptDB => {
			res.render("adopt-views/create-agency", {adoptDB})
		})
		.catch(err => next(err))
})
//

router.post("/create", (req, res, next) => {
	
  console.log({req: req.body}) 
	
  const agencyName = req.body.agencyName.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' ');



	const agencyData = {
    agencyName: agencyName,
    phone: `${req.body.phone.slice(0,3)}-${req.body.phone.slice(3,6)}-${req.body.phone.slice(6)}`, 
    address: {
      streetNumber: req.body.streetNumber,
      aptNumber: req.body.aptNumber,
      streetName: req.body.streetName.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
      city: req.body.city.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
      state: req.body.state.toUpperCase(),
      zip: req.body.zip
    }
  }

	Adopt.create(agencyData)
		.then(newAgency => {
			console.log(newAgency)
			res.redirect("/adopt")
      //res.redirect(`/adopt/details/${newAgency._id}`); //after make details page
		})
		.catch(err => next(err))
})

/* read LIST OF adpotion agencies*/
router.get("/", (req, res, next) => {
	Adopt.find()
		.then(adoptDB => {
			console.log({ adoptDB })
       const agencies = !req.query.searchAgencies ? adoptDB: adoptDB.map(agency => {
        if(agency.agencyName.toLowerCase().includes(req.query.searchAgencies.toLowerCase()) || String(agency.address.zip).includes(req.query.searchAgencies)|| agency.address.state.toLowerCase().includes(req.query.searchAgencies.toLowerCase())) {
          return agency;
        }
      }).filter(agency => !!agency);
			res.render("adopt-views/agencies", {agencies})
		})
		.catch(err => next(err))
})




/* read GET Agency Details ...need populate */

router.get("/details/:adoptId", (req, res, next) => {
  Adopt.findById(req.params.adoptId).populate('dogs')
  .then(agency => {
    console.log({agency})
    Dog.find()
    .then(dogFromDb => {
      console.log({ dogFromDb })
      
      const dogs = dogFromDb.map(dog => {
        dog.dogSelected = agency.dogs.filter(aDog =>  String(aDog._id) ===  String(dog._id))
        if(dog.dogSelected)
        // console.log('dogS', dog.dogSelected)
        // console.log('dogg', dog)
        return dog
      }).filter(dog => !dog)
      console.log('doggzz', dogs)
      res.render("adopt-views/agency-details", { agency, dog: dogFromDb, dogs })
      }).catch(err => next(err))
  }).catch(err => next(err))
})


//


// <form action="/adopt/edit/{{agency._id}}" method="POST">
// update
router.get("/edit/:id", (req, res, next) => {
 
  Adopt.findById(req.params.id)
	.then(agencyDb => {
      // Dog.find()
      //   .then(dogsFromDb => {
      //     //console.log({ dogsFromDb })
      //     //console.log("siblings", dogFromDb.siblings)
      //     // need any siblings checked
      //     const dogs = dogsFromDb.map(dog => {
      //       if(dogFromDb.siblings) dog.dogSelected = dogFromDb.siblings.includes(String(dog._id))   
      //       return dog;
      //     }).filter(dog => String(dog._id) !== String(dogFromDb._id))
         	res.render("adopt-views/edit-agency", {...req.body, agency: agencyDb})
        // }).catch(err => next(err))
	}).catch(err => next(err))
})



// agencyName: String,
// phone: String, 
// dogs: {type: [{type: Schema.Types.ObjectId, ref:"Dog"}]}, 
// address: addressObject
// streetNumber: { type: String },
// aptNumber: { type: String },
// streetName: { type: String },
// city: { type: String },
// state: { type: String },
// zip: { type: Number },


//zip max 99999
//phone maxlength 10
//// ?try to save formatted `${req.body.phone.slice(0,3)}-${req.body.phone.slice(3,6)}-${req.body.phone.slice(6)}`
module.exports = router