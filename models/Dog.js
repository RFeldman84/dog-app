const mongoose = require("mongoose")
const Schema = mongoose.Schema

const dogSchema = new Schema(
	{
		name: String,
		color: {type: String, enum:["Black", "Tan", "White", "Brindle"]},
		siblings: {type: [{type: Schema.Types.ObjectId, ref:"Dog"}]} 
	},
	{
		timestamps: true,
	}
)

const Dog = mongoose.model("Dog", dogSchema)
module.exports = Dog
