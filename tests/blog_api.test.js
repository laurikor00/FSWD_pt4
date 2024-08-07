const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const api = supertest(app)

const passwordHash = await bcrypt.hash('sekret', 10)
beforeEach(async () => {
        await Promise.all([User.deleteMany({}), Blog.deleteMany({})]);
	const user = new User({ username: 'root', passwordHash })
	await user.save()
	const blogs = helper.initialBlogs.map(blog => new Blog(blog))
	const array = blogs.map(blog => blog.save())
	await Promise.all(array)
})


test('Posts are returned as json', async () => {
	const response = await api.get('/api/blogs')
		.expect('Content-Type', /application\/json/)
	expect(response.body).toHaveLength(helper.initialBlogs.length) //helper.initialBlogs.length
})

test('id defined', async () => {
	const response = await api.get('/api/blogs')
	expect(response.body[0].id).toBeDefined()
})

const createToken = async () => {
	const user = await User.findOne()

	const token = {
		username: user.username,
		id: user._id
	}

	return jwt.sign(token, process.env.SECRET, { expiresIn: 60 * 60 })
}


test('new blog added', async () => {

	const token = await createToken()

	const newBlog = {
	  title: 'Blog 1',
	  author: 'Author 2',
	  url: 'www.blog1.fi/',
	  likes: 15
	}

	await api
	  .post('/api/blogs')
	  .set('Authorization', `Bearer ${token}`)
	  .send(newBlog)

	const blogAtEnd = await helper.blogsInDb()
	expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1)

	const titles = blogAtEnd.map((blog) => blog.title)
	expect(titles).toContain(newBlog.title)
})

test('blog added without token', async () => {

	const newBlog = {
	  title: 'Blog 2',
	  author: 'Author 2',
	  url: 'www.blog2.fi/',
	  likes: 10
	}

	await api
	  .post('/api/blogs')
	  .send(newBlog)
	  .expect(401)

	const blogAtEnd = await helper.blogsInDb()
	expect(blogAtEnd).toHaveLength(helper.initialBlogs.length)

	const titles = blogAtEnd.map((blog) => blog.title)
	expect(titles).not.toContain(newBlog.title)
})

test('default value of likes is 0', async () => {

	const token = await createToken()

	const newBlog = {
		title: 'Blog 3',
		author: 'Author 3',
		url: 'www.blog3.fi/',
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newBlog)

	const blogAtEnd = await helper.blogsInDb()

	expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1)

	const targetBlog = blogAtEnd.find(blog => blog.title === newBlog.title)
	expect(targetBlog.likes).toBe(0)
})

test('status code 400 is returned if the title is missing', async() => {

	const token = await createToken()

	const newBlog = {
		title: 'Blog 4',
		author: 'Author 4',
		url: 'www.blog4.fi/',
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newBlog)
		.expect(400)

	const blogAtEnd = await helper.blogsInDb()
	expect(blogAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('status code 400 is returned if the url is missing', async() => {

	const token = await createToken()

	const newBlog = {
		title: 'Bloggie',
		author: 'Author',
		likes: 1222
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newBlog)
		.expect(400)

	const blogAtEnd = await helper.blogsInDb()
	expect(blogAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a blog is deleted', async() => {

	const token = await createToken()
	const user = await User.findOne()
	const newBlog = {
		title: 'Blog 1',
		author: 'Author 1',
		url: 'www.blog1.fi/',
		user: user._id,
		likes: 15
	  }

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newBlog)

	const blogAtStart = await helper.blogsInDb()
	const blogToDelete = await Blog.findOne({ title: 'New blog' })

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(204)

	const blogAtEnd = await helper.blogsInDb()

	expect(blogAtEnd).toHaveLength(blogAtStart.length - 1)

	const titles = blogAtEnd.map(blog => blog.title)

	expect(titles).not.toContain(blogToDelete.title)
})

test('a blog is updated', async() => {
	const blogAtStart = await helper.blogsInDb()
	const blogToUpdated = blogAtStart[0]

	const updatedBlog = { ...blogToUpdated, likes: 8 }

	await api
		.put(`/api/blogs/${blogToUpdated.id}`)
		.send(updatedBlog)

	const blogAtEnd = await helper.blogsInDb()

	expect(blogAtEnd).toHaveLength(helper.initialBlogs.length)

	expect(blogAtEnd[0].likes).toBe(8)
})

describe('when there is initially one user in db', () => {

	test('creation fails with proper statuscode and message if the username is less than 3 characters long', async() => {

		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: 'a',
			name: 'a',
			password: '12345'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		expect(result.body.error).toContain('username: Path `username` (`a`) is shorter than the minimum allowed length (3).')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})

	test('creation fails with proper statuscode and message if username is missing', async() => {

		const usersAtStart = await helper.usersInDb()

		const newUser = {
			name: 'abc',
			password: '12345'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		expect(result.body.error).toContain('username: Path `username` is required')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})

	test('creation fails with proper statuscode and message if password is missing', async() => {

		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'abc',
			name: 'abc'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		expect(result.body.error).toContain('missing password')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})

	test('creation fails with proper statuscode and message if username already taken', async() => {

		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		expect(result.body.error).toContain('expected `username` to be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
