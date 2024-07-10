const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	],
	username: {
		type: String,
		minLength: 3,
		required: true,
		unique: true
	},
	name: String,
	passwordHash: String
})

userSchema.plugin(validator)

userSchema.set('toJSON', {
	transform : (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

module.exports = mongoose.model('User', userSchema)
