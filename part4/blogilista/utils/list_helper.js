const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const sum = (a, b) => a + b.likes;

  return blogs.reduce(sum, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = (a, b) => a.likes > b.likes ? a : b;

  return blogs.reduce(favorite, blogs[0]);
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

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

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const authors = {};
  blogs.forEach(blog => {
    const author = blog.author;
    if (!authors[author]) {
      authors[author] = 0;
    }

    authors[author] += blog.likes;
  });

  const mostLiked = (a, b) => authors[a] > authors[b] ? a : b;
  const result = Object.keys(authors).reduce(mostLiked, authors[0]);
  return {"author": result, "likes": authors[result]};
}

module.exports = {
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes
}

