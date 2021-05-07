const express = require("express")
const router = express.Router()
const Dog = require("../../models/Dog")
const dogColors = ["Black", "Tan", "White", "Brindle"]

/* create */
router.get("/create", (req, res, next) => {
	Dog.find()
		.then(dogsFromDb => {
			res.render("dog-views/create-dog", {
				dogs: dogsFromDb,
				colors: dogColors,
			})
		})
		.catch(err => next(err))
})

router.post("/create", (req, res, next) => {
	const isColorValid = dogColors.filter(color => req.body.color.toUpperCase() === color.toUpperCase()).length >0
  console.log({req: req.body}) 
	const { name, color} = req.body 
  
  const errorType = !name && !color ? "please provide a name & color" : !color ? "please choose a color" : !isColorValid ? "please pick Black, Tan, White or Brindle" : "please provide a name"

	if (!name || !color || !isColorValid) { 
		Dog.find()
			.then(dogsFromDb => {
				//console.log({ dogsFromDb })
        //console.log("color", req.body.color)
        // need any siblings checked
        const dogs = dogsFromDb.map(dog => {
          if(req.body.siblings) dog.dogSelected = req.body.siblings.includes(String(dog._id))   
          return dog;
        });
				res.render("dog-views/create-dog", {...req.body, errorMessage: errorType, dogs })
        return;
			})
			.catch(err => next(err))
      return;
	}

	const dogData = {
    name: `${req.body.name.charAt(0).toUpperCase()}${req.body.name.slice(1)}`,
    color: `${req.body.color.charAt(0).toUpperCase()}${req.body.color.slice(1).toLowerCase()}`,
    siblings: req.body.siblings
  }

	Dog.create(dogData)
		.then(newDog => {
			console.log(newDog)
			res.redirect("/dogs")
      //res.redirect(`/dogs/details/${newDog._id}`); //after make details page
		})
		.catch(err => next(err))
})

/* read LIST OF DOGS */
router.get("/", (req, res, next) => {
	Dog.find()
		.then(dogsFromDb => {
			console.log({ dogsFromDb })
			res.render("dog-views/dogs", { dogs: dogsFromDb })
		})
		.catch(err => next(err))
})

/* read GET DOG Details ...need populate */

router.get("/details/:id", (req, res, next) => {
  Dog.findById(req.params.id)
  .populate('siblings')
	.then(dogFromDb => {
		console.log({ dogFromDb })
	  res.render("dog-views/dog-details", { dog: dogFromDb })
		})
		.catch(err => next(err))
})




//// Update GET
/// ~ make so siblings list does not have themselves & ones checked that are  & selected color

router.get("/edit/:id", (req, res, next) => {
 
  Dog.findById(req.params.id)
	.then(dogFromDb => {
      Dog.find()
        .then(dogsFromDb => {
          //console.log({ dogsFromDb })
          //console.log("siblings", dogFromDb.siblings)
          // need any siblings checked
          const dogs = dogsFromDb.map(dog => {
            if(dogFromDb.siblings) dog.dogSelected = dogFromDb.siblings.includes(String(dog._id))   
            return dog;
          }).filter(dog => String(dog._id) !== String(dogFromDb._id))
         	res.render("dog-views/edit-dog", {...req.body, dog: dogFromDb, dogs})
        }).catch(err => next(err))
	}).catch(err => next(err))
})




/// Update POST
router.post("/edit/:id", (req, res, next) => {
  
	const isColorValid = dogColors.filter(color => req.body.color.toUpperCase() === color.toUpperCase()).length >0
  console.log({req: req.body}) 

	const { name, color} = req.body 
  
  const errorType = !name.length && !color.length ? "please provide a name & color" : !color.length ? "please choose a color" : !isColorValid ? "please pick Black, Tan, White or Brindle" : "please provide a name"

  

    if (!name.length  || !color.length || !isColorValid) { 
      Dog.findById(req.params.id)
      .then(dogFromDb => {
      Dog.find()
        .then(dogsFromDb => {
          //console.log({ dogsFromDb })
          
          // need any siblings checked
          const dogs = dogsFromDb.map(dog => {
            if(req.body.siblings) dog.dogSelected = req.body.siblings.includes(String(dog._id))
            return dog;
          }).filter(dog => String(dog._id) !== String(dogFromDb._id))
          const dog = {...req.body, _id: req.params.id}   
          res.render("dog-views/edit-dog", {dog, errorMessage: errorType, dogs, })
          return;

        }).catch(err => next(err))
        return;
      }).catch(err => next(err))
      return;
    }
    
 

  
  
	const dogData = {
    name: `${req.body.name.charAt(0).toUpperCase()}${req.body.name.slice(1)}`,
    color: `${req.body.color.charAt(0).toUpperCase()}${req.body.color.slice(1).toLowerCase()}`,
    siblings: req.body.siblings
  }
  

  Dog.findByIdAndUpdate(req.params.id, dogData, {new: true})
	.then(dogFromDb => {
    res.redirect(`/dogs/details/${dogFromDb._id}`)
	}).catch(err => next(err))
})





/** Post Dog Delete <Delete Route> */
router.get("/delete/:dogId", (req, res, next) => {
	Dog.findByIdAndDelete(req.params.dogId)
		.then(() => {
			res.redirect(`/dogs`)
		})
		.catch(err => next(err))
})

module.exports = router
