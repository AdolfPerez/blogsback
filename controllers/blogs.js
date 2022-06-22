const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async ({params}, response, next) => {
  const blog = await Blog.findById(params.id)
  try {
    blog ?
    response.json(blog) :
    response.status(404).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async ({body}, response, next) => {
  const blog = new Blog({ 
    title: body.title, 
    author: body.author, 
    url: body.url, 
    likes: body.likes 
  })
  try{
    const savedBlog = await blog.save()
    response.json(savedBlog)
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter