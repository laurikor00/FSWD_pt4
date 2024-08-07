const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	likes: Number,
	comments: [String]
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
module.exports = Blog //mongoose.model('Blog', blogSchema)