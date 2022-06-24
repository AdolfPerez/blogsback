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
    likes: body.likes || 0 
  })
  try{
    const savedBlog = await blog.save()
    savedBlog ?
    response.json(savedBlog) :
    response.status(400).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async ({params}, response) => {
  await Blog.findByIdAndRemove(params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {

  Blog.findByIdAndUpdate(request.params.id, 
    { 
      title: request.body.title, 
      author: request.body.author, 
      url: request.body.url, 
      likes: request.body.likes
    }, 
    { new: true }
  )
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter