const router = require('express').Router()
const Blog = require('../models/blog')
const mw = require('../utils/middleware')

router.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
	response.json(blogs)
})

router.post('/', mw.userExtractor, async (request, response) => {
	const body = request.body
	const user = request.user

	if (!body.title || !body.url)
		return response.status(400).end()

	if (!body.likes)
		body.likes = 0

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		user: user.id,
		likes: body.likes,
		comments: []
	})

	const savedBlog = await blog.save()

	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
	response.status(201).json(savedBlog)
})

router.delete('/:id', mw.userExtractor, async (request, response) => {
	const user = request.user
	const blog = await Blog.findById(request.params.id)

	if (blog.user.toString() !== user.id.toString())
		return response.status(401).json({ error: 'invalid token' })

	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

router.put('/:id', async (request, response) => {
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new : true })

	await updatedBlog.populate('user', { username: 1, name: 1, id: 1 })
	response.json(updatedBlog)
})

module.exports = router
