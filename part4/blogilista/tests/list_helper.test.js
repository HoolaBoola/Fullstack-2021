const listHelper = require('../utils/list_helper')

describe('total likes', () => {

  test('empty list returns null', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(null);
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])
    expect(result).toBe(7)
  })

  test('total count of likes is correct', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  })
})

describe('favorites', () => {

  test('empty list returns null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(null);
  })

  test('list with one blog returns it', () => {
    const result = listHelper.favoriteBlog([blogs[0]]);
    expect(result).toBe(blogs[0]);
  })

  test('favorite of all is correct', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result.title).toBe("Canonical string reduction");
  })
})

describe('mostBlogs', () => {

  test('empty list returns null', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(null);
  })

  test('correct for complete list', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({"author": "Robert C. Martin", "blogs": 3});
  })
})

describe('mostLikes', () => {
  test('empty list returns null', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result.likes).toBe(17);
  })

  test('works for empty lists', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe(null);
  })
})

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]


