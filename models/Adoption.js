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

