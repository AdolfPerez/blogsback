const Blog = require('../models/blog')

module.exports = {

  initialBlogs: [
    {
      title: 'titulo titulo',
      author: 'autor autor',
      url: 'www.url.com',
      likes: '3'
    },
    {
      title: 'segundo titulo',
      author: 'otro autor',
      url: 'www.securl.com',
      likes: '6'
    },
  ],
  
  nonExistingId: async () => {
    const blog = new Blog({
      title: 'willremovethissoon',
      author: 'willremovethissoon',
      url: 'willremovethissoon',
      likes: '3'
    })
  },
  
  blogsInDb: async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
  
}