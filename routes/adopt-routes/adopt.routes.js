const express = require("express")
const router = express.Router()
const Dog = require("../../models/Dog")
const Adopt = require("../../models/Adoption")



/* CREATE */
// GET
router.get("/create", (req, res, next) => {
	Adopt.find()
		.then(adoptDB => {
      Dog.find()
      .then(dogsFromDB => {
        res.render("adopt-views/create-agency", {adoptDB, dogs: dogsFromDB })
      })
		})
		.catch(err => next(err))
})
//
// POST
router.post("/create", (req, res, next) => {
	
  console.log({req: req.body}) 

	const agencyData = {
    agencyName: req.body.agencyName.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
    phone: `${req.body.phone.slice(0,3)}-${req.body.phone.slice(3,6)}-${req.body.phone.slice(6)}`, 
    //dogs: req.body.dogs,
    address: {
      streetNumber: req.body.streetNumber,
      aptNumber: req.body.aptNumber,
      streetName: req.body.streetName.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
      city: req.body.city.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
      state: req.body.state.toUpperCase(),
      zip: req.body.zip,
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

/* read LIST OF adoption agencies*/
router.get("/", (req, res, next) => {
	Adopt.find()
		.then(adoptDB => {
			//console.log({ adoptDB })
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
      res.render("adopt-views/agency-details", { agency})
  }).catch(err => next(err))
})


//


// <form action="/adopt/edit/{{agency._id}}" method="POST">
// update
router.get("/edit/:id", (req, res, next) => {
  Adopt.findById(req.params.id)
	.then(agencyDb => {
    Dog.find()
    .then(dogsFromDb => {
      //console.log({ dogsFromDb })
      const dogs = dogsFromDb.map(dog => {
          dog.dogSelected = agencyDb.dogs.includes(String(dog._id))  
            return dog;
          })
      	res.render("adopt-views/edit-agency", {...req.body, agency: agencyDb, dogs})
    }).catch(err => next(err))
	}).catch(err => next(err))
})


/// UPDATE post
router.post("/edit/:adoptId", (req, res, next) => {
  const agencyData = {
    agencyName: req.body.agencyName.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
    phone: `${req.body.phone.slice(0,3)}-${req.body.phone.slice(4,7)}-${req.body.phone.slice(8)}`, 
    address: {
      streetNumber: req.body.streetNumber,
      aptNumber: req.body.aptNumber,
      streetName: req.body.streetName.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
      city: req.body.city.split(' ').map(name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`).join(' '),
      state: req.body.state.toUpperCase(),
      zip: req.body.zip,
    }
  }

 
  Adopt.findByIdAndUpdate(req.params.adoptId, agencyData, { new: true })
  .then(adoptFromDb => {
    console.log({adoptFromDb});

    res.redirect(`/adopt/details/${adoptFromDb._id}`);
  }).catch(err => next(err));
});



// UPDATE- ADD REMOVE
router.get('/addRemove/:dogId/:adoptId', (req, res, next) => {
  Adopt.findById(req.params.adoptId)
  .then(adoptFromDb => {
    adoptFromDb.dogs.includes(String(req.params.dogId)) ? adoptFromDb.dogs.pull(req.params.dogId) : adoptFromDb.dogs.push(req.params.dogId);
    adoptFromDb.save()
    .then(updatedAdoptFromDb => {
      res.redirect(`/adopt/edit/${updatedAdoptFromDb._id}?canEdit=anotherBlah`);
    }).catch(err => next(err));
  }).catch(err => next(err));
})

/** Post Home Delete <Delete Route> */
router.get('/delete/:adoptId', (req, res, next) => {
  Adopt.findByIdAndDelete(req.params.adoptId)
  .then(() => {
    res.redirect(`/adopt`);
  }).catch(err => next(err));
});



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
// on edit there will be two slashes with max 10 so fix when see update working
module.exports = router