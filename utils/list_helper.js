const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0)
		return null

	const maxLikes = Math.max(...blogs.map(blog => blog.likes))
	const blog = blogs.find(blog => blog.likes === maxLikes)

	return {
		title: blog.title,
		author: blog.author,
		likes: blog.likes,
	}
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = blogs.reduce((acc, blog) => {
    acc[blog.author] = acc[blog.author] ? acc[blog.author] + 1 : 1
    return acc
  }, {})

  let maxBlogs = 0;
  let topAuthor = ''

  for (let author in blogCounts) {
    if (blogCounts[author] > maxBlogs) {
      maxBlogs = blogCounts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = acc[blog.author] ? acc[blog.author] + blog.likes : blog.likes
    return acc
  }, {})

  let maxLikes = 0;
  let topAuthor = ''

  for (let author in likesByAuthor) {
    if (likesByAuthor[author] > maxLikes) {
      maxLikes = likesByAuthor[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}