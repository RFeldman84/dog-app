const mongoose = require("mongoose")
const Schema = mongoose.Schema
const addressObject = require('./address');

const adoptSchema = new Schema(
	{
		agencyName: String,
    phone: String, 
		dogs: {type: [{type: Schema.Types.ObjectId, ref:"Dog"}]}, 
		address: addressObject
	},
	{
		timestamps: true,
	}
)

const Adopt = mongoose.model("Adoption", adoptSchema)
module.exports = Adopt

//zip max 99999
//phone maxLength 10
//`(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6)}`