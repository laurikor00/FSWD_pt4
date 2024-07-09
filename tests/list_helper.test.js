const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper');  // Import your functions to test
const { expect } = require('@jest/globals');  // Import Jest's expect function

const blogs = [
  { title: "Blog 1", author: "Author 1", likes: 10 },
  { title: "Blog 2", author: "Author 2", likes: 5 },
  { title: "Blog 3", author: "Author 1", likes: 12 },
  { title: "Blog 4", author: "Author 3", likes: 8 },
  { title: "Blog 5", author: "Author 1", likes: 6 }
]

describe('dummy', () => {
  test('returns one', () => {
    const blogs = [];  // Example input
    const result = dummy(blogs);
    expect(result).toBe(1);  // Example assertion
  });
});

describe('totalLikes', () => {

  test('of empty list is zero', () => {
    const blogs = [];
    const result = totalLikes(blogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [
      { likes: 5 }
    ]
    const result = totalLikes(blogs);
    expect(result).toBe(5);
  })

  test('of a bigger list is calculated correctly', () => {
    const blogs = [
      { likes: 10 },
      { likes: 7 },
      { likes: 2 }
    ]
    const result = totalLikes(blogs);
    expect(result).toBe(19); // 10 + 7 + 2
  })
})

describe('favoriteBlog', () => {
  const blogss = [
    { title: "Blog 1", author: "Author 1", likes: 10 },
    { title: "Blog 2", author: "Author 2", likes: 5 },
    { title: "Blog 3", author: "Author 3", likes: 12 }
  ]
  test('returns null for empty list', () => {
    const result = favoriteBlog([])
    expect(result).toBeNull()
  })

  test('returns the blog with the most likes', () => {
    const result = favoriteBlog(blogss);
    expect(result).toEqual({ title: "Blog 3", author: "Author 3", likes: 12 })
  })

})

describe('mostBlogs', () => {
  test('returns null for empty list', () => {
    const result = mostBlogs([])
    expect(result).toBeNull()
  })

  test('returns the author with the most blogs', () => {
    const result = mostBlogs(blogs)
    expect(result).toEqual({ author: "Author 1", blogs: 3 })
  })

})

describe('mostLikes', () => {
  test('returns null for empty list', () => {
    const result = mostLikes([]);
    expect(result).toBeNull();
  })

  test('returns the author with the most likes', () => {
    const result = mostLikes(blogs);
    expect(result).toEqual({ author: "Author 1", likes: 28 })
  })

})
