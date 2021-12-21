const totalLikes = (blogs) => {
  const sum = (a, b) => a + b.likes;

  return blogs.reduce(sum, 0);
}

const favoriteBlog = (blogs) => {
  const favorite = (a, b) => a.likes > b.likes ? a : b;

  return blogs.reduce(favorite, blogs[0]);
}

const mostBlogs = (blogs) => {
  const authors = {};
  blogs.forEach(blog => {
    const author = blog.author;
    if (!authors[author]) {
      authors[author] = 0;
    }

    authors[author] += 1;
  });

  const mostProlific = (a, b) => authors[a] > authors[b] ? a : b;
  const result = Object.keys(authors).reduce(mostProlific, authors[0]);
  return {"author": result, "blogs": authors[result]};
}

module.exports = {
  favoriteBlog,
  mostBlogs,
  totalLikes
}

